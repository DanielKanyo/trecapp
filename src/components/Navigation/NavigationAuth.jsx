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
import Face from '@material-ui/icons/Face';
import Lock from '@material-ui/icons/Lock';
import Public from '@material-ui/icons/Public';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: '#00c96b',
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
  },
  button: {
    margin: 0,
    paddingLeft: 14,
    paddingRight: 14,
    background: '#00c96b',
    color: 'white'
  },
  rightIcon: {
    marginLeft: 12,
  },
  iconSmall: {
    fontSize: 20,
  },
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
            <Typography component={Link} to={routes.LANDING} variant="title" color="inherit" className={classes.grow}>
              My Recipes
            </Typography>
            <IconButton component={Link} to={routes.WORLD} className={classes.menuButton} color="inherit" aria-label="Menu">
              <Public />
            </IconButton>
            <IconButton onClick={auth.doSignOut} className={classes.menuButton} color="inherit" aria-label="Menu">
              <Lock />
            </IconButton>
            <Button component={Link} to={routes.ACCOUNT} variant="contained" size="small" className={classes.button}>
              Daniel Kanyo
              <Face className={classes.rightIcon} />
            </Button>
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