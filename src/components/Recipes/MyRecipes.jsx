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

import Notifications, { notify } from 'react-notify-toast';

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
      currency: ''
    };

    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  /**
   * ComponentDidMount built in function
   * 
   * Get favourites, get recipes, push recipes
   */
  componentDidMount() {
    this.mounted = true;

    let loggedInUserId = auth.getCurrentUserId();
    let previousRecipes = this.state.recipes;
    let favRecipeIdArray = [];
    let favouriteId;
    let isFavourite = false;

    db.getUserInfo(loggedInUserId).then(resUserInfo => {
      this.setState({
        currency: resUserInfo.currency
      });
    });

    this.setState({ loggedInUserId: loggedInUserId });

    db.getFavouriteRecipesByUserId(loggedInUserId).then(resFavourites => {
      if (resFavourites.val()) {
        let fav = resFavourites.val();
        for (var key in fav) {
          if (fav[key]) {
            favouriteId = key;

            favRecipeIdArray.push(fav[key].recipeId);
          }
        }
      }

      db.getUsersRecipes().then(resRecipes => {
        if (this.mounted) {
          let recipes = resRecipes;

          for (var key in recipes) {
            if (recipes.hasOwnProperty(key) && recipes[key].userId === loggedInUserId) {
              
              if (favRecipeIdArray.includes(key)) isFavourite = true;
              else isFavourite = false;

              let data = recipes[key];

              data.recipeId = key;
              data.isFavourite = isFavourite;
              data.favouriteId = isFavourite ? favouriteId : null;

              previousRecipes.unshift(
                <Recipe
                  key={key}
                  dataProp={data}
                  deleteRecipeProp={this.deleteRecipe.bind(this)}
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
  saveRecipe(obj) {
    let dataToSend = obj;
    let recipes = this.state.recipes;

    dataToSend.userId = this.state.loggedInUserId;
    dataToSend.ownRecipe = true;
    dataToSend.currency = this.state.currency;
    obj.currency = this.state.currency;

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

      this.toastr(this.props.languageObjectProp.data.myRecipes.toaster.recipeSaved, '#4BB543');

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
  deleteRecipe(recipeId) {
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

    this.toastr(this.props.languageObjectProp.data.myRecipes.toaster.recipeRemoved, '#4BB543');
  }

  /**
   * Show notification
   * 
   * @param {string} msg 
   * @param {string} bgColor 
   */
  toastr(msg, bgColor) {
    let style = { background: bgColor, text: "#FFFFFF" };

    notify.show(msg, 'custom', 4000, style);
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
            <NewRecipe saveRecipeProps={this.saveRecipe.bind(this)} languageObjectProp={languageObjectProp} />
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

        <Notifications options={{ zIndex: 5000 }} />
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