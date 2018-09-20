import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftMenu from '../LeftMenu/LeftMenu';

import * as routes from '../../constants/routes';
import { auth } from '../../firebase';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Home from '@material-ui/icons/Home';
import Person from '@material-ui/icons/Person';
import Lock from '@material-ui/icons/Lock';

const styles = {
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: '#e84a1e',
    position: 'fixed',
    top: 0
  },
  grow: {
    flexGrow: 1,
    textDecoration: 'none'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  }
};

class NavigationAuth extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true
    };

    // This binding is necessary to make `this` work in the callback
    this.toggleLeftMenu = this.toggleLeftMenu.bind(this);
  }

  toggleLeftMenu() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className={classes.appbar} position="static">
          <Toolbar>
            <IconButton onClick={this.toggleLeftMenu} className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography component={Link} to={routes.HOME} variant="title" color="inherit" className={classes.grow}>
              My Recipes
            </Typography>
            <IconButton component={Link} to={routes.HOME} className={classes.menuButton} color="inherit" aria-label="Menu">
              <Home />
            </IconButton>
            <IconButton component={Link} to={routes.ACCOUNT} className={classes.menuButton} color="inherit" aria-label="Menu">
              <Person />
            </IconButton>
            <IconButton onClick={auth.doSignOut} className={classes.menuButton} color="inherit" aria-label="Menu">
              <Lock />
            </IconButton>
          </Toolbar>
        </AppBar>
        <LeftMenu toggleLeftMenuProp={this.state.isToggleOn} />
      </div>
    );
  }
}

NavigationAuth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationAuth);