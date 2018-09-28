import React, { Component } from 'react';
import '../App/index.css';
import { auth, db } from '../../firebase';
import compose from 'recompose/compose';
import withAuthorization from '../Session/withAuthorization';

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
      recipes: [],
      loggedInUserId: ''
    };
  }

  componentDidMount() {
    let loggedInUserId = auth.getCurrentUserId();
    
    this.setState({ loggedInUserId: loggedInUserId });
  }

  saveRecipe(obj) {
    let dataToSend = obj;
    let recipes = this.state.recipes;
    
    db.addRecipe(this.state.loggedInUserId, obj).then(snap => {
      let temp = [<Recipe key={ snap.key } dataProp={ dataToSend } />].concat(recipes)

      this.setState({
        recipes: temp
      });

    });
  }

  render() {
    const { classes } = this.props;
    let recipes = this.state.recipes;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component" xs={6}>
            <NewRecipe saveRecipeProps={this.saveRecipe.bind(this)} />
          </Grid>

          <Grid item className="grid-component" xs={6}>

            <Paper className={classes.paper + ' paper-title paper-title-myrecipes'}>
              <div className="paper-title-icon">
                <Receipt />
              </div>
              <div className="paper-title-text">
                My Recipes
                </div>
              <div className="number-of-recipes">({recipes.length})</div>
            </Paper>

            {recipes.length === 0 ? <EmptyList /> : ''}

            {recipes.map((recipe, index) => {
              return recipe;
            })}

          </Grid>

        </Grid>
      </div>
    );
  }
}

const EmptyList = () =>
  <div className="empty-container">
    Empty
  </div>

const authCondition = (authUser) => !!authUser;

MyRecipes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(MyRecipes);