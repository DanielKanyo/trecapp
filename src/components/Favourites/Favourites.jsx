import React, { Component } from 'react';
import { db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import RecipePreview from '../Categories/RecipePreview';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { dataEng } from '../../constants/languages/eng';

import { ToastContainer } from 'react-toastify';

const styles = theme => ({});

class Favourites extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedInUserId: '',
      favRecipes: [],
    }
  }

  componentDidMount() {
    this.mounted = true;

    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;
    let previousRecipes = this.state.favRecipes;

    this.setState({
      loggedInUserId
    });

    db.getRecipes().then(resRecipes => {
      if (this.mounted) {
        let favRecipes = resRecipes;

        db.onceGetUsers().then(users => {
          let usersObject = users.val();

          for (let key in favRecipes) {
            if (favRecipes.hasOwnProperty(key)) {
              let item = favRecipes[key];

              let favouritesObject = item.favourites;

              if (favouritesObject) {
                if (favouritesObject.hasOwnProperty(loggedInUserId) && item.publicChecked) {
                  let username = usersObject[favRecipes[key].userId].username;
                  let profilePicUrl = usersObject[favRecipes[key].userId].profilePicUrl;

                  let isMine = favRecipes[key].userId === loggedInUserId ? true : false;

                  let visibilityEditable = false;
                  let recipeDeletable = false;
                  let displayUserInfo = true;
                  let withPhoto = favRecipes[key].imageUrl !== '' ? true : false;
                  let favouriteCounter = favRecipes[key].favouriteCounter;

                  let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
                  let categoryNameEng = categoryItems[favRecipes[key].category];
                  let url = `/categories/${categoryNameEng.charAt(0).toLowerCase() + categoryNameEng.slice(1)}`;

                  let data = favRecipes[key];

                  data.recipeId = key;
                  data.loggedInUserId = loggedInUserId;
                  data.username = username;
                  data.profilePicUrl = profilePicUrl;
                  data.isMine = isMine;
                  data.isFavourite = true;
                  data.favouriteCounter = favouriteCounter;
                  data.recipeDeletable = recipeDeletable;
                  data.withPhoto = withPhoto;
                  data.visibilityEditable = visibilityEditable;
                  data.displayUserInfo = displayUserInfo;
                  data.url = url;

                  previousRecipes.push(
                    <RecipePreview
                      key={data.recipeId}
                      dataProp={data}
                      deleteRecipeProp={this.deleteRecipe}
                      languageObjectProp={this.props.languageObjectProp}
                    />
                  )

                  this.setState({
                    favRecipes: previousRecipes
                  });
                }
              }
            }
          }
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

  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;
    let { favRecipes } = this.state;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component" xs={12}>
            <Paper className={classes.paper + ' paper-title paper-title-favourites'}>
              <div className="paper-title-icon">
                <FavoriteIcon />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.menuItems[2]}
              </div>
            </Paper>

            <Grid container spacing={16}>
              {favRecipes.length === 0 ? <EmptyList /> : ''}

              {favRecipes.map((recipe, index) => {
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
    );
  }
}

const EmptyList = () =>
  <Grid item xs={12}>
    <div className="empty-container">
      Empty
    </div>
  </Grid>

const authCondition = (authUser) => !!authUser;

Favourites.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(Favourites);