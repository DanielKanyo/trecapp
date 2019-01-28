import React, { Component } from 'react';
import '../App/index.css';
import { db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { dataEng } from '../../constants/languages/eng';
import Paper from '@material-ui/core/Paper';
import RoomService from '@material-ui/icons/RoomService';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import RecipePreview from './RecipePreview';
import { ToastContainer } from 'react-toastify';

const styles = theme => ({
  progressLine: {
    borderRadius: '4px',
  },
  progressBar: {
    background: '#F55300'
  },
});

class CategoryRecipes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      categoryName: '',
      loading: true,
      categoryNumber: null,
    };
  }

  componentDidMount = () => {
    this.mounted = true;
    let previousRecipes = this.state.recipes;

    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;

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
            for (let prepKey in resRecipes) {
              if (resRecipes[prepKey].recipeLanguage !== permittedRecipesLanguage) {
                delete resRecipes[prepKey];
              }
            }
          }

          db.users().once('value').then(users => {
            let usersObject = users.val();

            let recipes = resRecipes;

            let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
            let categoryNameEng = this.props.match.params.category;
            let categoryNumber = categoryItems.indexOf(categoryNameEng.charAt(0).toUpperCase() + categoryNameEng.slice(1));
            let categoryName = this.props.languageObjectProp.data.myRecipes.newRecipe.categoryItems[categoryNumber];

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
                let favouritesObject = recipes[key].favourites;
                let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;

                let data = {
                  ...recipes[key],
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
                  favouriteCounter: recipes[key].favouriteCounter,
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
              }
            }

            this.setState({
              recipes: previousRecipes,
              loggedInUserId,
              loading: false
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

  render() {
    const { classes, languageObjectProp } = this.props;
    let { loading } = this.state;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component" xs={12}>
            <Paper className={classes.paper + ' paper-title paper-title-category-recipe'}>
              <div className="paper-title-icon">
                <RoomService />
              </div>
              <div className="paper-title-text">
                {this.state.categoryName}
              </div>
            </Paper>

            <Grid container spacing={16}>
              {
                loading && <Grid item className="grid-component" xs={12}><LinearProgress classes={{ colorPrimary: classes.progressLine, barColorPrimary: classes.progressBar }} /></Grid>
              }

              {this.state.recipes.length === 0 && !loading ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

              {this.state.recipes.map((recipe, index) => {
                return recipe;
              })}
            </Grid>

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