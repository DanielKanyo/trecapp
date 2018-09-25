import React, { Component } from 'react';
import '../App/index.css';

import NewRecipe from './NewRecipe';
import Recipe from './Recipe';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';
import Receipt from '@material-ui/icons/Receipt';;

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
});

class MyRecipes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  render() {
    const { classes } = this.props;
    let recipes = this.state.recipes;

    return (
      <div className="ComponentContent">
        <div className="scrollable-view">
          <Grid container spacing={16}>
            {/* MY RECIPES SECTION */}
            <Grid item xs={6}>

              <Paper className={classes.paper + ' paper-title paper-title-myrecipes'}>
                <div className="paper-title-icon">
                  <Receipt />
                </div>
                <div className="paper-title-text">
                  My Recipes
                </div>
              </Paper>

              { recipes.length === 0 ? <EmptyList /> : ''}

              {recipes.map((recipe, index) => {
                return recipe;
              })}

              <Recipe />
            </Grid>

            {/* NEW RECIPE SECTION */}
            <Grid item xs={6}>
              <NewRecipe />
            </Grid>

          </Grid>
        </div>
      </div>
    );
  }
}


const EmptyList = () =>
  <div className="empty-container">
    Empty
  </div>


MyRecipes.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(MyRecipes);