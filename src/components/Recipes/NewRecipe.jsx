import React, { Component } from 'react';
import '../App/index.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import AddCircle from '@material-ui/icons/AddCircle';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  }
});

class NewRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.paper + ' paper-title paper-title-newrecipe'}>
          <div className="paper-title-icon">
            <AddCircle />
          </div>
          <div className="paper-title-text">
            New Recipe
              </div>
        </Paper>

        <Paper className={classes.paper + ' paper-recipe'}>
          <p>New Recipe</p>
        </Paper>
      </div>
    );
  }
}

NewRecipe.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewRecipe);