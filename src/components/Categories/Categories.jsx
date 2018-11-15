import React, { Component } from 'react';
import '../App/index.css';
import { auth, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import DashboardIcon from '@material-ui/icons/Dashboard';

import CategoryItem from './CategoryItem';

const styles = theme => ({
  card: {
    maxWidth: '100%',
  }
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
      categories: []
    };
  }

  componentDidMount() {
    this.mounted = true;

    let previousCategories = this.state.categories;
    let loggedInUserId = auth.getCurrentUserId();
    let recipeCategorys = this.props.languageObjectProp.data.myRecipes.newRecipe.categoryItems;

    this.setState({
      loggedInUserId: loggedInUserId
    });

    db.getRecipes().then(resRecipes => {
      if (this.mounted) {
        let recipes = resRecipes;
        let categoryNumbersInArray = [];
        let counter = 0; 

        for (var key in recipes) {
          categoryNumbersInArray.push(recipes[key].category);
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
            imageNumber: i,
            numberOfRecipe: counter
          }

          previousCategories.push(
            <CategoryItem
              key={i}
              dataProp={data}
              languageObjectProp={this.props.languageObjectProp}
            />
          )

          counter = 0;
        }

        this.setState({
          categories: previousCategories
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

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component" xs={12}>
            <Paper className={classes.paper + ' paper-title paper-title-categories'}>
              <div className="paper-title-icon">
                <DashboardIcon />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.menuItems[3]}
              </div>
            </Paper>

            <Grid container spacing={16} className="category-items-container">

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

export default compose(withAuthorization(authCondition), withStyles(styles))(Categories);