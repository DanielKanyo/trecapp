import React, { Component } from 'react';
import { auth, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import Recipe from '../Recipes/Recipe';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';

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

    let loggedInUserId = auth.getCurrentUserId();
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

                  previousRecipes.push(
                    <Recipe
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

          <Grid item className="grid-component" xs={6}>
            <Paper className={classes.paper + ' paper-title paper-title-fav-settings'}>
              <div className="paper-title-icon">
                <SettingsIcon />
              </div>
              <div className="paper-title-text">
                Settings
              </div>
            </Paper>
          </Grid>

          <Grid item className="grid-component" xs={6}>
            <Paper className={classes.paper + ' paper-title paper-title-favourites'}>
              <div className="paper-title-icon">
                <FavoriteIcon />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.menuItems[2]}
              </div>
            </Paper>

            {favRecipes.length === 0 ? <EmptyList /> : ''}

            {favRecipes.map((recipe, index) => {
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

Favourites.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(Favourites);