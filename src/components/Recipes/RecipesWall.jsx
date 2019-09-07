import React, { Component } from 'react';

import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import { db } from '../../firebase';
import compose from 'recompose/compose';
import { dataEng } from '../../constants/languages/eng';

import Recipe from './Recipe';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Public from '@material-ui/icons/Public';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Grade from '@material-ui/icons/Grade';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  progressLine: {
    borderRadius: '4px',
  },
  progressBarLatest: {
    background: '#008E3D'
  },
  progressBarTop: {
    background: '#2AA7BB'
  },
  topButton: {
    width: '100%',
    background: '#2AA7BB',
    color: 'white'
  },
  latestButton: {
    width: '100%',
    background: '#008E3D',
    color: 'white'
  },
});

const constants = {
  DEFAULT_NUMBER_OF_RECIPES: 10
}

class RecipesWall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      latestRecipes: [],
      topRecipes: [],
      loggedInUserId: '',
      numberOfLatestRecipesDisplayed: constants.DEFAULT_NUMBER_OF_RECIPES,
      numberOfTopRecipesDisplayed: constants.DEFAULT_NUMBER_OF_RECIPES,
      loggedInUserName: '',
      loggedInUserProfilePicUrl: ''
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

      let filterRecipes = false;
      let permittedRecipesLanguage;

      if (userUptodateData.filterRecipes && userUptodateData.filterRecipes !== 'all') {
        filterRecipes = true;
        permittedRecipesLanguage = userUptodateData.filterRecipes;
      }

      db.getRecipes().then(resRecipes => {
        let sortedRecipesByTimestamp = [];
        let sortedRecipesByFavAndLikeCounter = [];

        if (filterRecipes) {
          if (resRecipes) {
            Object.keys(resRecipes).forEach(prepKey => {
              if (Array.isArray(permittedRecipesLanguage)) {
                if (!permittedRecipesLanguage.includes(resRecipes[prepKey].recipeLanguage)) {
                  delete resRecipes[prepKey];
                }
              } else if (resRecipes[prepKey].recipeLanguage !== permittedRecipesLanguage) {
                delete resRecipes[prepKey];
              }
            });
          }
        }

        if (resRecipes) {
          Object.entries(resRecipes).forEach(([key, value], i) => {
            if (resRecipes.hasOwnProperty(key)) {
              sortedRecipesByTimestamp.push(value);
              sortedRecipesByTimestamp[i].recipeId = key;

              sortedRecipesByFavAndLikeCounter.push(value);
              sortedRecipesByFavAndLikeCounter[i].recipeId = key;
            }
          });

          db.users().once('value').then(users => {
            let usersObject = users.val();

            if (this.mounted) {

              let loggedInUserName = usersObject[loggedInUserId].username;
              let loggedInUserProfilePicUrl = usersObject[loggedInUserId].profilePicUrl ? usersObject[loggedInUserId].profilePicUrl : '';

              if (sortedRecipesByTimestamp.length && sortedRecipesByFavAndLikeCounter.length) {
                sortedRecipesByTimestamp.sort((a, b) => (a.creationTime < b.creationTime) ? 1 : ((b.creationTime < a.creationTime) ? -1 : 0));
                sortedRecipesByFavAndLikeCounter.sort((a, b) => ((a.favouriteCounter + a.likeCounter) < (b.favouriteCounter + b.likeCounter)) ? 1 : (((b.favouriteCounter + b.likeCounter) < (a.favouriteCounter + a.likeCounter)) ? -1 : 0));

                let latestRecipes = sortedRecipesByTimestamp;
                let topRecipes = sortedRecipesByFavAndLikeCounter;

                for (let i = 0; i < latestRecipes.length; i++) {
                  if (latestRecipes[i].publicChecked) {
                    let username = usersObject[latestRecipes[i].userId].username;
                    let profilePicUrl = usersObject[latestRecipes[i].userId].profilePicUrl;

                    let favouritesObject = latestRecipes[i].favourites;
                    let likesObject = latestRecipes[i].likes;

                    let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
                    let categoryNameEng = categoryItems[latestRecipes[i].category];
                    let url = `/categories/${categoryNameEng.charAt(0).toLowerCase() + categoryNameEng.slice(1)}`;

                    let isMine = latestRecipes[i].userId === loggedInUserId ? true : false;
                    let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;
                    let isLiked = !likesObject ? false : likesObject.hasOwnProperty(loggedInUserId) ? true : false;
                    let visibilityEditable = false;
                    let recipeDeletable = false;
                    let recipeEditable = isMine;
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
                    data.isLiked = isLiked;
                    data.favouriteCounter = favouriteCounter;
                    data.recipeDeletable = recipeDeletable;
                    data.recipeEditable = recipeEditable;
                    data.withPhoto = withPhoto;
                    data.visibilityEditable = visibilityEditable;
                    data.displayUserInfo = displayUserInfo;
                    data.showMore = showMore;
                    data.url = url;
                    data.loggedInUserName = loggedInUserName;
                    data.loggedInUserProfilePicUrl = loggedInUserProfilePicUrl;
                    data.withComments = true;

                    previousLatestRecipes.push(
                      <Recipe
                        key={data.recipeId}
                        dataProp={data}
                        deleteRecipeProp={this.deleteRecipe}
                        languageObjectProp={this.props.languageObjectProp}
                      />
                    )
                  }
                }

                this.setState({
                  latestRecipes: previousLatestRecipes
                });

                for (let j = 0; j < topRecipes.length; j++) {
                  if (topRecipes[j].publicChecked) {
                    let username = usersObject[topRecipes[j].userId].username;
                    let profilePicUrl = usersObject[topRecipes[j].userId].profilePicUrl;

                    let favouritesObject = topRecipes[j].favourites;
                    let likesObject = topRecipes[j].likes;

                    let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
                    let categoryNameEng = categoryItems[topRecipes[j].category];
                    let url = `/categories/${categoryNameEng.charAt(0).toLowerCase() + categoryNameEng.slice(1)}`;

                    let isMine = topRecipes[j].userId === loggedInUserId ? true : false;
                    let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;
                    let isLiked = !likesObject ? false : likesObject.hasOwnProperty(loggedInUserId) ? true : false;
                    let visibilityEditable = false;
                    let recipeDeletable = false;
                    let recipeEditable = isMine;
                    let displayUserInfo = true;
                    let withPhoto = topRecipes[j].imageUrl !== '' ? true : false;
                    let favouriteCounter = topRecipes[j].favouriteCounter;

                    let data = topRecipes[j];

                    data.loggedInUserId = loggedInUserId;
                    data.username = username;
                    data.profilePicUrl = profilePicUrl;
                    data.isMine = isMine;
                    data.isFavourite = isFavourite;
                    data.isLiked = isLiked;
                    data.favouriteCounter = favouriteCounter;
                    data.recipeDeletable = recipeDeletable;
                    data.recipeEditable = recipeEditable;
                    data.withPhoto = withPhoto;
                    data.visibilityEditable = visibilityEditable;
                    data.displayUserInfo = displayUserInfo;
                    data.url = url;
                    data.loggedInUserName = loggedInUserName;
                    data.loggedInUserProfilePicUrl = loggedInUserProfilePicUrl;
                    data.withComments = true;

                    previousTopRecipes.push(
                      <Recipe
                        key={data.recipeId}
                        dataProp={data}
                        deleteRecipeProp={this.deleteRecipe}
                        languageObjectProp={this.props.languageObjectProp}
                      />
                    )
                  }
                }

                this.setState({
                  topRecipes: previousTopRecipes,
                  loggedInUserId,
                  loggedInUserName,
                  loggedInUserProfilePicUrl,
                  loading: false
                });
              } else {
                this.setState({
                  loading: false,
                });
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

  loadMore = category => {
    if (category === 'latest') {
      let { numberOfLatestRecipesDisplayed } = this.state;
      numberOfLatestRecipesDisplayed += numberOfLatestRecipesDisplayed;

      this.setState({ numberOfLatestRecipesDisplayed });
    } else if ('top') {
      let { numberOfTopRecipesDisplayed } = this.state;
      numberOfTopRecipesDisplayed += numberOfTopRecipesDisplayed;

      this.setState({ numberOfTopRecipesDisplayed })
    }
  }

  render() {
    const { classes, languageObjectProp } = this.props;
    let { latestRecipes, topRecipes, loading, numberOfLatestRecipesDisplayed, numberOfTopRecipesDisplayed } = this.state;

    let latestLoadBtnAvailable = latestRecipes.length > numberOfLatestRecipesDisplayed;
    let topLoadBtnAvailable = topRecipes.length > numberOfTopRecipesDisplayed;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={2}>

          <Grid item className="grid-component recipes-wall" xs={6}>

            <Paper className={classes.paper + ' paper-title paper-title-wall'}>
              <div className="paper-title-icon">
                <Public />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.myRecipes.RecipesWall.latestRecipes}
              </div>
            </Paper>

            {loading && <LinearProgress classes={{ colorPrimary: classes.progressLine, barColorPrimary: classes.progressBarLatest }} />}

            {latestRecipes.length === 0 && !loading ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

            {latestRecipes.map((recipe, index) => {
              return index < this.state.numberOfLatestRecipesDisplayed ? recipe : null
            })}

            {
              !loading && latestRecipes.length !== 0 ?
                <Tooltip title={languageObjectProp.data.showMore}>
                  <Button
                    component="div"
                    onClick={() => { this.loadMore('latest') }}
                    disabled={!latestLoadBtnAvailable}
                    variant="contained"
                    className={classes.latestButton + ' load-more-btn load-latest-btn'}
                  >
                    <MoreHoriz />
                  </Button>
                </Tooltip> : ''
            }

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

            {loading && <LinearProgress classes={{ colorPrimary: classes.progressLine, barColorPrimary: classes.progressBarTop }} />}

            {topRecipes.length === 0 && !loading ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

            {topRecipes.map((recipe, index) => {
              return index < this.state.numberOfTopRecipesDisplayed ? recipe : null
            })}

            {
              !loading && topRecipes.length !== 0 ?
                <Tooltip title={languageObjectProp.data.showMore}>
                  <Button
                    component="div"
                    onClick={() => { this.loadMore('top') }}
                    disabled={!topLoadBtnAvailable}
                    variant="contained"
                    className={classes.topButton + ' load-more-btn load-top-btn'}
                  >
                    <MoreHoriz />
                  </Button>
                </Tooltip> : ''
            }

          </Grid>

        </Grid>
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

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(RecipesWall);