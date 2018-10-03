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

import Notifications, { notify } from 'react-notify-toast';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
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
      loggedInUserId: ''
    };
  }

  /**
   * ComponentDidMount built in function
   */
  componentDidMount() {
    let loggedInUserId = auth.getCurrentUserId();
    let previousRecipes = this.state.recipes;
    
    this.setState({ loggedInUserId: loggedInUserId });
    
    db.getUsersRecipes(loggedInUserId).then(snapshot => {
      let dataObject = snapshot;

      let id = dataObject.id;
      let recipes = dataObject.value;
      let ownRecipe = loggedInUserId === id ? true : false;

      for (var key in recipes) {
        if (recipes.hasOwnProperty(key)) {
          let data = recipes[key];

          data.ownRecipe = ownRecipe;
          data.recipeId = key;

          previousRecipes.unshift(<Recipe key={ key } dataProp={ data } deleteRecipeProp={this.deleteRecipe.bind(this)} />)
        }
      }

      this.setState({
        recipes: previousRecipes
      });
    });
  }

  /**
   * Save new recipe
   * 
   * @param {Object} obj 
   */
  saveRecipe(obj) {
    let dataToSend = obj;
    let recipes = this.state.recipes;

    dataToSend.id = this.state.loggedInUserId;
    dataToSend.ownRecipe = true;
    
    db.addRecipe(this.state.loggedInUserId, obj).then(snap => {
      dataToSend.recipeId = snap.key;
      let temp = [<Recipe key={ snap.key } dataProp={ dataToSend } deleteRecipeProp={this.deleteRecipe.bind(this)} />].concat(recipes)

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
    let loggedInUserId = this.state.loggedInUserId;
    let previousRecipes = this.state.recipes;

    db.removeRecipe(loggedInUserId, recipeId);

    for (let i = 0; i < previousRecipes.length; i++) {
      if (previousRecipes[i].key === recipeId) {
        previousRecipes.splice(i, 1);
      }
    }

    this.setState({
      notes: previousRecipes
    });

    this.toastr('Recipe deleted!', '#4BB543');
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
    let recipes = this.state.recipes;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component" xs={6}>
            <NewRecipe saveRecipeProps={this.saveRecipe.bind(this)} />
          </Grid>

          <Grid item className="grid-component" xs={6}>

            <Paper className={classes.paper + ' paper-title paper-title-myrecipes'}>
              <div className="paper-title-icon">
                <Receipt />
              </div>
              <div className="paper-title-text">
                My Recipes
                </div>
              <div className="number-of-recipes">({recipes.length})</div>
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