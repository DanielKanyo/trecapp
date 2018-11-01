import React, { Component } from 'react';

import withAuthorization from '../Session/withAuthorization';
import { db, auth } from '../../firebase';
import compose from 'recompose/compose';

import Recipe from './Recipe';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Public from '@material-ui/icons/Public';
import Grade from '@material-ui/icons/Grade';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class RecipesWall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: [],
      loggedInUserId: '',
      numberOfRecipesDisplayed: 15
    };
  }

  componentDidMount() {
    this.mounted = true;

    let loggedInUserId = auth.getCurrentUserId();
    let previousRecipes = this.state.recipes;

    db.getRecipes().then(resRecipes => {
      var arrangedRecipesBasedOnTimestamp = [];

      Object.entries(resRecipes).forEach(([key, value], i) => {
        if (resRecipes.hasOwnProperty(key)) {
          arrangedRecipesBasedOnTimestamp.push(value);
          arrangedRecipesBasedOnTimestamp[i].recipeId = key;
        }
      });

      if (arrangedRecipesBasedOnTimestamp.length) {
        arrangedRecipesBasedOnTimestamp.sort((a, b) => (a.creationTime < b.creationTime) ? 1 : ((b.creationTime < a.creationTime) ? -1 : 0));

        if (this.mounted) {
          let recipes = arrangedRecipesBasedOnTimestamp;

          for (let i = 0; i < recipes.length; i++) {

            if (i < this.state.numberOfRecipesDisplayed) {
              db.getUserInfo(recipes[i].userId).then(resUserInfo => {
                let username = resUserInfo.username;

                this.setState({
                  loggedInUserId
                });
                
                let favouritesObject = recipes[i].favourites;

                let isMine = recipes[i].userId === loggedInUserId ? true : false;
                let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;
                let visibilityEditable = false;
                let recipeDeletable = false;
                let displayUserInfo = true;
                let withPhoto = recipes[i].imageUrl !== '' ? true : false;
                let favouriteCounter = recipes[i].favouriteCounter;

                let data = recipes[i];

                data.loggedInUserId = loggedInUserId;
                data.username = username;
                data.isMine = isMine;
                data.isFavourite = isFavourite;
                data.favouriteCounter = favouriteCounter;
                data.recipeDeletable = recipeDeletable;
                data.withPhoto = withPhoto;
                data.visibilityEditable = visibilityEditable;
                data.displayUserInfo = displayUserInfo;

                previousRecipes.push(
                  <Recipe
                    key={data.recipeId}
                    dataProp={data}
                    deleteRecipeProp={this.deleteRecipe}
                    languageObjectProp={this.props.languageObjectProp}
                  />
                )

              });
            } else break
          }

          this.setState({
            recipes: previousRecipes
          });
        }
      }

    });
  }


  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { classes } = this.props;

    let recipes = this.state.recipes;

    return (
      <div className="ComponentContent">

        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component" xs={6}>

            <Paper className={classes.paper + ' paper-title paper-title-wall'}>
              <div className="paper-title-icon">
                <Public />
              </div>
              <div className="paper-title-text">
                Latest Recipes
              </div>
            </Paper>

            {recipes.length === 0 ? <EmptyList /> : ''}

            {recipes.map((recipe, index) => {
              return recipe;
            })}

          </Grid>

          <Grid item className="grid-component" xs={6}>

            <Paper className={classes.paper + ' paper-title paper-title-top'}>
              <div className="paper-title-icon">
                <Grade />
              </div>
              <div className="paper-title-text">
                Top 10 Recipes
              </div>
            </Paper>

            <Paper className={classes.paper + ' paper-events'}>
              <p>Top 10 Recipes</p>
            </Paper>

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

RecipesWall.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(RecipesWall);