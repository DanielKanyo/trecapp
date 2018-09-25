import React, { Component } from 'react';
import '../App/index.css';

import NewRecipe from './NewRecipe';
import Recipe from './Recipe';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({});

class MyRecipes extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  render() {
    return (
      <div className="ComponentContent">
        <div className="scrollable-view">
          <Grid container spacing={16}>

            <Grid item xs={6}>
              <Recipe />
            </Grid>

            <Grid item xs={6}>
              <NewRecipe />
            </Grid>

          </Grid>
        </div>
      </div>
    );
  }
}

MyRecipes.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(MyRecipes);