import React, { Component } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import TuneIcon from '@material-ui/icons/Tune';
import ClearIcon from '@material-ui/icons/Clear';
import RecipePreview from '../Categories/RecipePreview';
import { db } from '../../firebase';
import { dataEng } from '../../constants/languages/eng';

const styles = theme => ({
  root: {
    padding: '6px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 8px)',
    marginBottom: 14,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  }
});

const constants = {
  MIN_NUMBER_OF_CHARS: 3
}

class Search extends Component {

	/**
	 * Constructor
	 * 
	 * @param {Object} props 
	 */
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      searchResults: [],
      recipeData: [],
    };
  }

  /**
   * Get user and recipe data
   */
  componentDidMount = () => {
    this.mounted = true;

    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;

    let previousRecipeData = this.state.recipeData;

    db.getRecipes().then(resRecipes => {
      if (this.mounted) {
        let recipes = resRecipes;

        db.users().once('value').then(users => {
          let usersObject = users.val();

          for (let key in recipes) {
            if (recipes.hasOwnProperty(key)) {
              let item = recipes[key];

              if (item.publicChecked) {

              }

              let username = usersObject[item.userId].username;
              let profilePicUrl = usersObject[item.userId].profilePicUrl;

              let isMine = item.userId === loggedInUserId ? true : false;

              let favouritesObject = item.favourites;
              let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;

              let visibilityEditable = false;
              let recipeDeletable = false;
              let recipeEditable = false;
              let displayUserInfo = true;
              let withPhoto = item.imageUrl !== '' ? true : false;
              let favouriteCounter = item.favouriteCounter;

              let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
              let categoryNameEng = categoryItems[item.category];
              let url = `/categories/${categoryNameEng.charAt(0).toLowerCase() + categoryNameEng.slice(1)}`;

              let data = item;

              data.recipeId = key;
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

              previousRecipeData.push(data);
            }
          }

          this.setState({
            recipeData: previousRecipeData,
            loggedInUserId
          });
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
   * Input changed
   */
  handleInputChanged = (e) => {
    this.setState({
      value: e.target.value
    });
  }

  /**
   * Search in recipes data
   */
  handleSearch = event => {
    this.setState({
      searchResults: []
    }, () => {
      const { recipeData, value } = this.state;
      let previousSeachResults = this.state.searchResults;

      const normalizedValueString = this.normalizeString(value);

      if (normalizedValueString.length >= constants.MIN_NUMBER_OF_CHARS) {
        for (let i in recipeData) {
          let recipe = recipeData[i];

          for (let key in recipe) {
            let rec = recipe[key];

            if (typeof rec === 'string') {
              let normalizedRecString = this.normalizeString(rec);

              if (normalizedRecString.includes(normalizedValueString)) {
                console.log(recipe);
                previousSeachResults.push(
                  <RecipePreview
                    key={recipe.recipeId}
                    dataProp={recipe}
                    languageObjectProp={this.props.languageObjectProp}
                  />
                )

                break;
              }
            }
          }
        }

        this.setState({
          searchResults: previousSeachResults
        });
      }
    });

    event.preventDefault();
  }

  /**
   * Normalize string
   */
  normalizeString = (string) => {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  /**
   * Toggle tune component
   */
  handleToggleTune = () => {
    console.log('tune');
  }

  render() {
    const { classes, languageObjectProp } = this.props;
    const { searchResults, value } = this.state;
    const searchButtonAvailable = value.length >= constants.MIN_NUMBER_OF_CHARS ? false : true;

    return (
      <div className="ComponentContent Search">
        <Grid className="main-grid" container spacing={16}>
          <Grid item className="grid-component" xs={12}>
            <Paper className={classes.root} elevation={1}>
              <IconButton
                className={classes.iconButton}
                aria-label="Tune"
                onClick={this.handleToggleTune}
              >
                <TuneIcon />
              </IconButton>

              <form onSubmit={this.handleSearch} className={classes.input + " search-form"}>
                <InputBase
                  className={classes.input}
                  placeholder={languageObjectProp.data.Search.title}
                  onChange={(e) => { this.handleInputChanged(e) }}
                  value={value}
                  autoFocus
                />
              </form>

              <IconButton
                className={classes.iconButton}
                aria-label="Search"
                onClick={this.handleSearch}
                disabled={searchButtonAvailable}
              >
                <SearchIcon />
              </IconButton>
              <Divider className={classes.divider} />
              <IconButton className={classes.iconButton} aria-label="Directions">
                <ClearIcon />
              </IconButton>
            </Paper>

            {searchResults.length === 0 ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

            <Grid container spacing={16}>
              {searchResults.map(recipe => recipe)}
            </Grid>

          </Grid>
        </Grid>
      </div>
    )
  }
}

const EmptyList = (props) =>
  <div className="empty-container">
    {props.languageObjectProp.data.emptyList}
  </div>

const authCondition = (authUser) => !!authUser;

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(Search);