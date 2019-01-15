import React, { Component } from 'react';

import withAuthorization from '../Session/withAuthorization';
import { db } from '../../firebase';
import compose from 'recompose/compose';
import { dataEng } from '../../constants/languages/eng';

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
      latestRecipes: [],
      topRecipes: [],
      loggedInUserId: '',
      numberOfRecipesDisplayed: 15
    };
  }

  componentDidMount() {
    this.mounted = true;

    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;

    db.user(loggedInUserId).once('value').then(snapshot => {
      let userUptodateData = snapshot.val();

      let previousLatestRecipes = this.state.latestRecipes;
      let previousTopRecipes = this.state.topRecipes;
      let counter1 = 0;
      let counter2 = 0;

      let filterRecipes = false;
      let permittedRecipesLanguage;

      if (userUptodateData.filterRecipes && userUptodateData.filterRecipes !== 'all') {
        filterRecipes = true;
        permittedRecipesLanguage = userUptodateData.filterRecipes;
      }

      db.getRecipes().then(resRecipes => {
        let sortedRecipesByTimestamp = [];
        let sortedRecipesByFavCounter = [];

        if (filterRecipes) {
          for (let prepKey in resRecipes) {
            if (resRecipes[prepKey].recipeLanguage !== permittedRecipesLanguage) {
              delete resRecipes[prepKey];
            }
          }
        }

        if (resRecipes) {
          Object.entries(resRecipes).forEach(([key, value], i) => {
            if (resRecipes.hasOwnProperty(key)) {
              sortedRecipesByTimestamp.push(value);
              sortedRecipesByTimestamp[i].recipeId = key;

              sortedRecipesByFavCounter.push(value);
              sortedRecipesByFavCounter[i].recipeId = key;
            }
          });

          db.users().once('value').then(users => {
            let usersObject = users.val();

            if (sortedRecipesByTimestamp.length && sortedRecipesByFavCounter.length) {
              sortedRecipesByTimestamp.sort((a, b) => (a.creationTime < b.creationTime) ? 1 : ((b.creationTime < a.creationTime) ? -1 : 0));
              sortedRecipesByFavCounter.sort((a, b) => (a.favouriteCounter < b.favouriteCounter) ? 1 : ((b.favouriteCounter < a.favouriteCounter) ? -1 : 0));

              if (this.mounted) {
                let latestRecipes = sortedRecipesByTimestamp;
                let topRecipes = sortedRecipesByFavCounter;

                for (let i = 0; i < latestRecipes.length; i++) {
                  if (latestRecipes[i].publicChecked && counter1 < this.state.numberOfRecipesDisplayed) {
                    let username = usersObject[latestRecipes[i].userId].username;
                    let profilePicUrl = usersObject[latestRecipes[i].userId].profilePicUrl;

                    let favouritesObject = latestRecipes[i].favourites;

                    let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
                    let categoryNameEng = categoryItems[latestRecipes[i].category];
                    let url = `/categories/${categoryNameEng.charAt(0).toLowerCase() + categoryNameEng.slice(1)}`;

                    let isMine = latestRecipes[i].userId === loggedInUserId ? true : false;
                    let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;
                    let visibilityEditable = false;
                    let recipeDeletable = false;
                    let recipeEditable = false;
                    let displayUserInfo = true;
                    let withPhoto = latestRecipes[i].imageUrl !== '' ? true : false;
                    let favouriteCounter = latestRecipes[i].favouriteCounter;
                    let showMore = false;

                    let data = latestRecipes[i];

                    data.loggedInUserId = loggedInUserId;
                    data.username = username;
                    data.profilePicUrl = profilePicUrl;
                    data.isMine = isMine;
                    data.isFavourite = isFavourite;
                    data.favouriteCounter = favouriteCounter;
                    data.recipeDeletable = recipeDeletable;
                    data.recipeEditable = recipeEditable;
                    data.withPhoto = withPhoto;
                    data.visibilityEditable = visibilityEditable;
                    data.displayUserInfo = displayUserInfo;
                    data.showMore = showMore;
                    data.url = url;

                    previousLatestRecipes.push(
                      <Recipe
                        key={data.recipeId}
                        dataProp={data}
                        deleteRecipeProp={this.deleteRecipe}
                        languageObjectProp={this.props.languageObjectProp}
                      />
                    )

                    this.setState({
                      latestRecipes: previousLatestRecipes
                    });

                    counter1++;
                  }
                }

                for (let j = 0; j < topRecipes.length; j++) {
                  if (topRecipes[j].publicChecked && counter2 < this.state.numberOfRecipesDisplayed) {
                    let username = usersObject[topRecipes[j].userId].username;
                    let profilePicUrl = usersObject[topRecipes[j].userId].profilePicUrl;

                    let favouritesObject = topRecipes[j].favourites;

                    let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
                    let categoryNameEng = categoryItems[topRecipes[j].category];
                    let url = `/categories/${categoryNameEng.charAt(0).toLowerCase() + categoryNameEng.slice(1)}`;

                    let isMine = topRecipes[j].userId === loggedInUserId ? true : false;
                    let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;
                    let visibilityEditable = false;
                    let recipeDeletable = false;
                    let recipeEditable = false;
                    let displayUserInfo = true;
                    let withPhoto = topRecipes[j].imageUrl !== '' ? true : false;
                    let favouriteCounter = topRecipes[j].favouriteCounter;

                    let data = topRecipes[j];

                    data.loggedInUserId = loggedInUserId;
                    data.username = username;
                    data.profilePicUrl = profilePicUrl;
                    data.isMine = isMine;
                    data.isFavourite = isFavourite;
                    data.favouriteCounter = favouriteCounter;
                    data.recipeDeletable = recipeDeletable;
                    data.recipeEditable = recipeEditable;
                    data.withPhoto = withPhoto;
                    data.visibilityEditable = visibilityEditable;
                    data.displayUserInfo = displayUserInfo;
                    data.url = url;

                    previousTopRecipes.push(
                      <Recipe
                        key={data.recipeId}
                        dataProp={data}
                        deleteRecipeProp={this.deleteRecipe}
                        languageObjectProp={this.props.languageObjectProp}
                      />
                    )

                    this.setState({
                      topRecipes: previousTopRecipes,
                      loggedInUserId
                    });

                    counter2++;
                  }
                }
              }
            }
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

  render() {
    const { classes, languageObjectProp } = this.props;
    let { latestRecipes, topRecipes } = this.state;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component recipes-wall" xs={6}>

            <Paper className={classes.paper + ' paper-title paper-title-wall'}>
              <div className="paper-title-icon">
                <Public />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.myRecipes.RecipesWall.latestRecipes}
              </div>
            </Paper>

            {latestRecipes.length === 0 ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

            {latestRecipes.map((recipe, index) => {
              return recipe;
            })}

          </Grid>

          <Grid item className="grid-component" xs={6}>

            <Paper className={classes.paper + ' paper-title paper-title-top'}>
              <div className="paper-title-icon">
                <Grade />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.myRecipes.RecipesWall.topRecipes}
              </div>
            </Paper>

            {topRecipes.length === 0 ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

            {topRecipes.map((recipe, index) => {
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

const EmptyList = (props) =>
  <div className="empty-container">
    {props.languageObjectProp.data.emptyList}
  </div>

const authCondition = (authUser) => !!authUser;

RecipesWall.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(RecipesWall);