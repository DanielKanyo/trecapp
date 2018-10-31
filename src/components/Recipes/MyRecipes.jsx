import React, { Component } from 'react';
import '../App/index.css';
import { auth, db } from '../../firebase';
import compose from 'recompose/compose';
import withAuthorization from '../Session/withAuthorization';

import NewRecipe from './NewRecipe';
import Recipe from './Recipe';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Receipt from '@material-ui/icons/Receipt';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
  chip: {
    background: '#ffca44',
    color: 'white'
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
      favouriteCounter: 0
    };
  }

  /**
   * ComponentDidMount built in function
   * Get favourites, get recipes, push recipes
   */
  componentDidMount() {
    this.mounted = true;

    let loggedInUserId = auth.getCurrentUserId();
    let previousRecipes = this.state.recipes;
    let isFavourite = false;

    db.getUserInfo(loggedInUserId).then(resUserInfo => {
      this.setState({
        currency: resUserInfo.currency,
        loggedInUserId: loggedInUserId
      });
    });

    db.getRecipes().then(resRecipes => {
      if (this.mounted) {
        let recipes = resRecipes;

        for (var key in recipes) {
          if (recipes.hasOwnProperty(key) && recipes[key].userId === loggedInUserId) {
            let favouritesObject = recipes[key].favourites;

            isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;

            let recipeDeletable = true;
            let visibilityEditable = true;
            let withPhoto = false;

            let data = recipes[key];

            data.loggedInUserId = loggedInUserId;
            data.recipeId = key;
            data.isFavourite = isFavourite;
            data.favouriteCounter = recipes[key].favouriteCounter;
            data.recipeDeletable = recipeDeletable;
            data.withPhoto = withPhoto;
            data.visibilityEditable = visibilityEditable;

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
          recipes: previousRecipes
        });
      }
    });
  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
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
    let visibilityEditable = true;

    dataToSend.userId = this.state.loggedInUserId;
    dataToSend.imageUrl = '';
    dataToSend.currency = this.state.currency;
    dataToSend.favouriteCounter = this.state.favouriteCounter;
    dataToSend.recipeDeletable = recipeDeletable;
    dataToSend.visibilityEditable = visibilityEditable;

    obj.currency = this.state.currency;
    obj.favouriteCounter = this.state.favouriteCounter;

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

      toast.success(this.props.languageObjectProp.data.myRecipes.toaster.recipeSaved);

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
  deleteRecipe = (recipeId) => {
    let previousRecipes = this.state.recipes;

    db.removeRecipe(recipeId);

    for (let i = 0; i < previousRecipes.length; i++) {
      if (previousRecipes[i].key === recipeId) {
        previousRecipes.splice(i, 1);
      }
    }

    this.setState({
      notes: previousRecipes
    });

    toast.success(this.props.languageObjectProp.data.myRecipes.toaster.recipeRemoved);
  }

  /**
   * Render function
   */
  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;

    let recipes = this.state.recipes;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component" xs={6}>
            <NewRecipe
              currencyProp={this.state.currency}
              saveRecipeProps={this.saveRecipe}
              languageObjectProp={languageObjectProp} />
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

            {recipes.length === 0 ? <EmptyList /> : ''}

            {recipes.map((recipe, index) => {
              return recipe;
            })}

          </Grid>

        </Grid>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          pauseOnHover
        />
      </div>
    );
  }
}

const EmptyList = () =>
  <div className="empty-container">
    Empty
  </div>

const authCondition = (authUser) => !!authUser;

MyRecipes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(MyRecipes);