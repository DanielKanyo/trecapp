import React, { Component } from 'react';
// import { auth, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({});

class FavRecipeItem extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid item className="grid-component" xs={6}>
        <Paper className={classes.paper}>
          fav1
          </Paper>
      </Grid>
    )
  }
}

const authCondition = (authUser) => !!authUser;

FavRecipeItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(FavRecipeItem);