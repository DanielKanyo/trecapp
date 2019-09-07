import React, { Component } from 'react';
import '../App/index.css';
import { db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { dataEng } from '../../constants/languages/eng';
import Paper from '@material-ui/core/Paper';
import RoomService from '@material-ui/icons/RoomService';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import MyPagination from '../Pagination/MyPagination';

import RecipePreview from './RecipePreview';

const styles = theme => ({
  progressLine: {
    borderRadius: '4px',
  },
  progressBar: {
    background: '#F55300'
  },
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#F55300',
      main: '#F55300',
      dark: '#F55300',
      contrastText: '#fff',
    }
  }
});

const constants = {
  DEFAULT_NUMBER_OF_RECIPES: 20
}

class CategoryRecipes extends Component {

  constructor(props) {
    const locationObject = new URL(window.location.href);
    let pageId = locationObject.searchParams.get('pageId');

    if (pageId === null) {
      props.history.push({
        search: '?pageId=1'
      });

      pageId = 1;
    }

    super(props);
    this.state = {
      recipes: [],
      recipesTotal: [],
      categoryName: '',
      loading: true,
      categoryNumber: null,
      pageId,
      numberOfPages: null,
    };
  }

  componentDidMount = () => {
    this.mounted = true;
    let previousRecipes = this.state.recipes;

    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;
    let lengthCounter = 0;

    db.user(loggedInUserId).once('value').then(snapshot => {
      let userUptodateData = snapshot.val();

      let filterRecipes = false;
      let permittedRecipesLanguage;

      if (userUptodateData.filterRecipes && userUptodateData.filterRecipes !== 'all') {
        filterRecipes = true;
        permittedRecipesLanguage = userUptodateData.filterRecipes;
      }

      db.getRecipes().then(resRecipes => {
        if (this.mounted) {

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

          db.users().once('value').then(users => {
            let usersObject = users.val();

            let recipes = resRecipes;

            let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
            let categoryNameEng = this.props.match.params.category;
            let categoryNumber = categoryItems.indexOf(categoryNameEng.charAt(0).toUpperCase() + categoryNameEng.slice(1));
            let categoryName = this.props.languageObjectProp.data.myRecipes.newRecipe.categoryItems[categoryNumber].replace('_', ' ');

            this.setState({
              categoryNumber,
              categoryName
            });

            for (var key in recipes) {
              let recipe = recipes[key];
              let recipeUserId = recipe.userId;

              let username = usersObject[recipeUserId].username;
              let profilePicUrl = usersObject[recipeUserId].profilePicUrl;

              let isMine = recipeUserId === loggedInUserId ? true : false;

              if (recipe.category === categoryNumber && recipe.publicChecked) {
                let favouritesObject = recipe.favourites;
                let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;

                let data = {
                  ...recipe,
                  loggedInUserId: loggedInUserId,
                  recipeId: key,
                  imageUrl: recipe.imageUrl,
                  title: recipe.title,
                  creationTime: recipe.creationTime,
                  difficulty: recipe.difficulty,
                  displayUserInfo: true,
                  username: username,
                  isMine: isMine,
                  profilePicUrl: profilePicUrl,
                  isFavourite: isFavourite,
                  favouriteCounter: recipe.favouriteCounter,
                  userId: recipe.userId,
                  url: this.props.match.url
                }

                previousRecipes.unshift(
                  <RecipePreview
                    key={key}
                    dataProp={data}
                    languageObjectProp={this.props.languageObjectProp}
                  />
                )

                lengthCounter++;
              }
            }

            let counter = 0;
            let recipesPerPage = [];
            let recipesTotal = [];

            for (let i = 0; i < previousRecipes.length; i++) {
              recipesPerPage.push(previousRecipes[i]);
              counter++;

              if (counter === constants.DEFAULT_NUMBER_OF_RECIPES) {
                recipesTotal.push(recipesPerPage);
                recipesPerPage = [];
                counter = 0;
              }
            }

            if (recipesPerPage.length > 0) {
              recipesTotal.push(recipesPerPage);
            }

            let numberOfPages = Math.ceil(lengthCounter / constants.DEFAULT_NUMBER_OF_RECIPES);

            this.setState({
              recipes: previousRecipes,
              recipesTotal,
              loggedInUserId,
              loading: false,
              numberOfPages,
            });
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
	 * Pagination button clicked
	 */
  pagBtnClicked = (pageId) => {
    let newParam = `?pageId=${pageId}`;

    this.props.history.push({
      search: newParam
    });

    this.setState({
      pageId
    });
  }

  render() {
    const { classes, languageObjectProp } = this.props;
    let { loading, pageId, numberOfPages, recipes, recipesTotal } = this.state;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={2}>

          <Grid item className="grid-component category-recipes-grid-component" xs={12}>
            <Paper className={classes.paper + ' paper-title paper-title-category-recipe'}>
              <div className="paper-title-icon">
                <RoomService />
              </div>
              <div className="paper-title-text">
                {this.state.categoryName}
              </div>
            </Paper>

            <Grid container spacing={2}>
              {
                loading && <Grid item className="grid-component" xs={12}><LinearProgress classes={{ colorPrimary: classes.progressLine, barColorPrimary: classes.progressBar }} /></Grid>
              }

              {recipes.length === 0 && !loading ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

              {recipesTotal[pageId - 1] && recipesTotal[pageId - 1].map(recipe => recipe)}

              <MuiThemeProvider theme={theme}>
                {
                  !loading && numberOfPages > 1 &&
                  <MyPagination
                    pagBtnClickedProp={this.pagBtnClicked}
                    totalProp={numberOfPages}
                    activePageProp={pageId}
                  />
                }
              </MuiThemeProvider>
            </Grid>

          </Grid>
        </Grid>
      </div>
    )
  }
}

const EmptyList = (props) =>
  <Grid item xs={12}>
    <div className="empty-container">
      {props.languageObjectProp.data.emptyList}
    </div>
  </Grid>

const authCondition = (authUser) => !!authUser;

CategoryRecipes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(CategoryRecipes);