import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

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
    backgroundColor: '#F8B000'
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

const NavigationNonAuth = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root + ' nav-non-auth'}>
      <AppBar className={classes.appbar + ' app-bar-nav-non-auth'} position="static">
        <Toolbar>
          <Typography component={Link} to={ROUTES.WALL} variant="h6" color="inherit" className={classes.grow}>
            {/* My Recipes */}
          </Typography>
          <IconButton component={Link} to={ROUTES.LANDING} className={classes.menuButton} color="inherit" aria-label="Menu">
            <Home />
          </IconButton>
          <IconButton component={Link} to={ROUTES.SIGN_IN} className={classes.menuButton} color="inherit" aria-label="Menu">
            <LockOpen />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
 
NavigationNonAuth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationNonAuth);