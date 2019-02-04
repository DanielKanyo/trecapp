import React, { Component } from 'react';
import '../App/index.css';
import { db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LinearProgress from '@material-ui/core/LinearProgress';

import CategoryListItem from './CategoryListItem';

const styles = theme => ({
  card: {
    maxWidth: '100%',
  },
  progressLine: {
    borderRadius: '4px',
  },
  progressBar: {
    background: '#66bf00'
  },
});

class Categories extends Component {

  /**
    * Constructor
    * 
    * @param {Object} props 
    */
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      categories: []
    };
  }

  componentDidMount() {
    this.mounted = true;

    let previousCategories = this.state.categories;
    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;
    let recipeCategorys = this.props.languageObjectProp.data.myRecipes.newRecipe.categoryItems;

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
              if (Array.isArray(permittedRecipesLanguage)) {
                if (!permittedRecipesLanguage.includes(resRecipes[prepKey].recipeLanguage)) {
                  delete resRecipes[prepKey];
                }
              } else if (resRecipes[prepKey].recipeLanguage !== permittedRecipesLanguage) {
                delete resRecipes[prepKey];
              }
            }
          }

          let recipes = resRecipes;
          let categoryNumbersInArray = [];
          let counter = 0;

          for (var key in recipes) {
            if (recipes[key].publicChecked) {
              categoryNumbersInArray.push(recipes[key].category);
            }
          }

          for (let i = 1; i < recipeCategorys.length; i++) {
            let categoryName = recipeCategorys[i];

            for (let j = 0; j < categoryNumbersInArray.length; j++) {
              if (categoryNumbersInArray[j] === i) {
                counter += 1;
              }
            }

            let data = {
              categoryName: categoryName,
              categoryNumber: i,
              imageNumber: i,
              numberOfRecipe: counter,
              url: this.props.match.path
            }

            previousCategories.push(
              <CategoryListItem
                key={i}
                dataProp={data}
                languageObjectProp={this.props.languageObjectProp}
              />
            )

            counter = 0;
          }

          this.setState({
            categories: previousCategories,
            loggedInUserId,
            loading: false
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
            <Paper className={classes.paper + ' paper-title paper-title-categories'}>
              <div className="paper-title-icon">
                <DashboardIcon />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.menuItems[4]}
              </div>
            </Paper>

            <Grid container spacing={16} className="category-items-container">
              {
                loading && <Grid item className="grid-component" xs={12}><LinearProgress classes={{ colorPrimary: classes.progressLine, barColorPrimary: classes.progressBar }} /></Grid>
              }

              {this.state.categories.map((category, index) => {
                return category;
              })}

            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(Categories);