import React from 'react';
import './Landing.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

const styles = theme => ({
  card: {
    maxWidth: '100%',
    marginBottom: '10px',
    padding: '20px'
  }
});

const LandingPage = (props) => {
  const { classes } = props;

  return (
    <div className={props.isAuthenticatedProp ? "ComponentContent" : 'LandingComponent'}>
      <div className="landing-component-container">
        <Card className={classes.card + " landing-title"}>My Recipes App</Card>
      </div>
    </div>
  )
}

LandingPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LandingPage);