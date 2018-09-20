import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../../constants/routes';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import LockOpen from '@material-ui/icons/LockOpen';
import Home from '@material-ui/icons/Home';

const styles = {
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: '#338c52'
  },
  grow: {
    flexGrow: 1,
    textDecoration: 'none'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const NavigationAuth = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} position="static">
        <Toolbar>
          <Typography component={Link} to={routes.HOME} variant="title" color="inherit" className={classes.grow}>
            My Recipes
          </Typography>
          <IconButton component={Link} to={routes.LANDING} className={classes.menuButton} color="inherit" aria-label="Menu">
            <Home />
          </IconButton>
          <IconButton component={Link} to={routes.SIGN_IN} className={classes.menuButton} color="inherit" aria-label="Menu">
            <LockOpen />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
 
NavigationAuth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationAuth);