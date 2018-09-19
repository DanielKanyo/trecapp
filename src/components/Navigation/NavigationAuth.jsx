import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../../constants/routes';
import { auth } from '../../firebase';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Person from '@material-ui/icons/Person';
import MeetingRoom from '@material-ui/icons/MeetingRoom';

const styles = {
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: '#13a7b2'
  },
  grow: {
    flexGrow: 1,
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
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.grow}>
            My Recipes
          </Typography>
          <IconButton component={Link} to={routes.ACCOUNT} className={classes.menuButton} color="inherit" aria-label="Menu">
            <Person />
          </IconButton>
          <IconButton onClick={auth.doSignOut} className={classes.menuButton} color="inherit" aria-label="Menu">
            <MeetingRoom />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ul>
        <li><Link to={routes.HOME}>Home</Link></li>
        <li><Link to={routes.ACCOUNT}>Account</Link></li>
      </ul>
    </div>
  );
}
 
NavigationAuth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationAuth);