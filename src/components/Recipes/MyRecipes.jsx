import React, { Component } from 'react';
import '../App/index.css';
import { db, storage } from '../../firebase';
import compose from 'recompose/compose';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import { dataEng } from '../../constants/languages/eng';

import NewRecipe from './NewRecipe';
import Recipe from './Recipe';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Receipt from '@material-ui/icons/Receipt';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '../Snackbar/MySnackbar';

import { isoLanguages } from '../../constants/languages/iso-639';

const styles = theme => ({
  paper: {
    padding: theme.spacing(),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
  chip: {
    background: '#ffca44',
    color: 'white'
  },
  progressLine: {
    borderRadius: '4px',
  },
  progressBar: {
    background: '#F8B000'
  }
});

class MyRecipes extends Component {

  /**
   * Constructor
   * 
   * @param {Object} props 
   */
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      loggedInUserId: '',
      currency: '',
      favouriteCounter: 0,
      likeCounter: 0,
      languages: [],
      recipeLanguage: '',
      loading: true,
      snackbarMessage: '',
      snackbarType: '',
      snackbarOpen: false,
    };
  }

  /**
   * ComponentDidMount built in function
   * Get favourites, get recipes, push recipes
   */
  componentDidMount() {
    this.mounted = true;

    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;
    let previousRecipes = this.state.recipes;
    let isFavourite = false;
    let isLiked = false;

    let previousLanguages = this.state.languages;

    db.getUserInfo(loggedInUserId).then(resUserInfo => {
      let username = resUserInfo.username;

      db.getRecipes().then(resRecipes => {
        if (this.mounted) {

          this.setState({
            currency: resUserInfo.currency ? resUserInfo.currency : 'USD',
            recipeLanguage: resUserInfo.recipesLanguage ? resUserInfo.recipesLanguage : 'en',
            loggedInUserId: loggedInUserId
          });

          let recipes = resRecipes;

          Object.keys(isoLanguages).forEach(key => {
            let nativeName = isoLanguages[key].nativeName;
            let name = isoLanguages[key].name;

            previousLanguages.push(
              <MenuItem key={key} value={isoLanguages[key]['639-1']}>{nativeName} ({name})</MenuItem>
            )
          });

          this.setState({
            languages: previousLanguages
          });

          for (var key in recipes) {
            if (recipes.hasOwnProperty(key) && recipes[key].userId === loggedInUserId) {
              let favouritesObject = recipes[key].favourites;
              let likesObject = recipes[key].likes;

              isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;
              isLiked = !likesObject ? false : likesObject.hasOwnProperty(loggedInUserId) ? true : false;

              let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
              let categoryNameEng = categoryItems[recipes[key].category];
              let url = `/categories/${categoryNameEng.charAt(0).toLowerCase() + categoryNameEng.slice(1)}`;

              let recipeDeletable = true;
              let recipeEditable = true;
              let visibilityEditable = true;
              let displayUserInfo = false;
              let withPhoto = true;
              let isMine = true;
              let showMore = false;

              let data = recipes[key];

              data.loggedInUserId = loggedInUserId;
              data.username = username;
              data.isMine = isMine;
              data.recipeId = key;
              data.isFavourite = isFavourite;
              data.isLiked = isLiked;
              data.favouriteCounter = recipes[key].favouriteCounter;
              data.likeCounter = recipes[key].likeCounter;
              data.recipeDeletable = recipeDeletable;
              data.recipeEditable = recipeEditable;
              data.withPhoto = withPhoto;
              data.visibilityEditable = visibilityEditable;
              data.displayUserInfo = displayUserInfo;
              data.profilePicUrl = '';
              data.showMore = showMore;
              data.url = url;

              previousRecipes.unshift(
                <Recipe
                  key={key}
                  dataProp={data}
                  deleteRecipeProp={this.deleteRecipe}
                  languageObjectProp={this.props.languageObjectProp}
                />
              )
            }
          }

          this.setState({
            recipes: previousRecipes,
            loading: false,
          });
        }
      });

    });
  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  handleChangeCurrency = (value) => {
    db.updateCurrency(this.state.loggedInUserId, value);

    this.setState({ currency: value });
  }

  /**
   * Save new recipe
   * 
   * @param {Object} obj 
   */
  saveRecipe = (obj) => {
    let dataToSend = obj;
    let recipes = this.state.recipes;

    let recipeDeletable = true;
    let recipeEditable = true;
    let visibilityEditable = true;
    let displayUserInfo = false;
    let withPhoto = true;
    let showMore = false;

    let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
    let categoryNameEng = categoryItems[dataToSend.category];
    let url = `/categories/${categoryNameEng.charAt(0).toLowerCase() + categoryNameEng.slice(1)}`;

    dataToSend.userId = this.state.loggedInUserId;
    dataToSend.imageUrl = '';
    dataToSend.imageName = '';
    dataToSend.currency = this.state.currency;
    dataToSend.favouriteCounter = this.state.favouriteCounter;
    dataToSend.likeCounter = this.state.likeCounter;
    dataToSend.recipeDeletable = recipeDeletable;
    dataToSend.recipeEditable = recipeEditable;
    dataToSend.visibilityEditable = visibilityEditable;
    dataToSend.displayUserInfo = displayUserInfo;
    dataToSend.withPhoto = withPhoto;
    dataToSend.showMore = showMore;
    dataToSend.url = url;
    dataToSend.loggedInUserId = this.state.loggedInUserId;

    obj.currency = this.state.currency;
    obj.favouriteCounter = this.state.favouriteCounter;
    obj.likeCounter = this.state.likeCounter;
    obj.recipeLanguage = this.state.recipeLanguage;

    db.addRecipe(this.state.loggedInUserId, obj).then(snap => {
      dataToSend.recipeId = snap.key;

      let temp = [
        <Recipe
          key={snap.key}
          dataProp={dataToSend}
          deleteRecipeProp={this.deleteRecipe}
          languageObjectProp={this.props.languageObjectProp}
        />
      ].concat(recipes);

      this.setState({
        snackbarOpen: true,
        snackbarMessage: this.props.languageObjectProp.data.myRecipes.toaster.recipeSaved,
        snackbarType: 'success'
      });

      this.setState({
        recipes: temp
      });

    });
  }

  /**
   * Delete recipe by id
   * 
   * @param {string} recipeId 
   */
  deleteRecipe = (recipeId, imageName) => {
    let previousRecipes = this.state.recipes;

    db.removeRecipe(recipeId);
    if (imageName) {
      storage.deleteRecipeImage(imageName);
    }

    for (let i = 0; i < previousRecipes.length; i++) {
      if (previousRecipes[i].key === recipeId) {
        previousRecipes.splice(i, 1);
      }
    }

    this.setState({
      notes: previousRecipes
    });

    this.setState({
      snackbarOpen: true,
      snackbarMessage: this.props.languageObjectProp.data.myRecipes.toaster.recipeRemoved,
      snackbarType: 'success'
    });
  }

  /**
   * Save recipe language to the database
   */
  changeRecipeLanguage = (value) => {
    db.updateRecipesLanguage(this.state.loggedInUserId, value);

    this.setState({ recipeLanguage: value });
  }

  /**
   * Hide snackbar after x seconds
   */
  hideSnackbar = () => {
    this.setState({
      snackbarOpen: false
    });
  }

  /**
   * Render function
   */
  render() {
    const { classes, languageObjectProp } = this.props;
    let { loading } = this.state;

    let recipes = this.state.recipes;

    return (
      <div className="ComponentContent MyRecipes">
        <Grid className="main-grid" container spacing={2}>

          <Grid item className="grid-component" xs={6}>
            <NewRecipe
              currencyProp={this.state.currency}
              saveRecipeProps={this.saveRecipe}
              languageObjectProp={languageObjectProp}
              availableLanguagesProp={this.state.languages}
              recipeLanguageProp={this.state.recipeLanguage}
              changeRecipeLanguageProp={this.changeRecipeLanguage}
              handleChangeCurrencyProp={this.handleChangeCurrency}
            />
          </Grid>

          <Grid item className="grid-component" xs={6}>

            <Paper className={classes.paper + ' paper-title paper-title-myrecipes'}>
              <div className="paper-title-icon">
                <Receipt />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.myRecipes.myRecipes.title}
              </div>
              <div className="number-of-recipes">
                <Tooltip title={languageObjectProp.data.myRecipes.tooltips.numOfRecipes}>
                  <Chip label={recipes.length} className={classes.chip} />
                </Tooltip>
              </div>
            </Paper>

            {loading && <LinearProgress classes={{ colorPrimary: classes.progressLine, barColorPrimary: classes.progressBar }} />}

            {recipes.length === 0 && !loading ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

            {recipes.map((recipe, index) => {
              return recipe;
            })}

          </Grid>

        </Grid>

        <Snackbar
          messageProp={this.state.snackbarMessage}
          typeProp={this.state.snackbarType}
          openProp={this.state.snackbarOpen}
          hideSnackbarProp={this.hideSnackbar}
        />
      </div>
    );
  }
}

const EmptyList = (props) =>
  <div className="empty-container">
    {props.languageObjectProp.data.emptyList}
  </div>

const authCondition = (authUser) => !!authUser;

MyRecipes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(MyRecipes);