import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftMenu from '../LeftMenu/LeftMenu';

import * as routes from '../../constants/routes';
import { auth, db } from '../../firebase';
import compose from 'recompose/compose';
import withAuthorization from '../Session/withAuthorization';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Face from '@material-ui/icons/Face';
import Public from '@material-ui/icons/Public';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const styles = {
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: '#F8B000',
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
    marginLeft: 15,
    paddingLeft: 14,
    paddingRight: 14,
    background: '#F8B000',
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
      isToggleOn: true,
      user: {},
      openAccountDropdown: false,
    };

    // This binding is necessary to make `this` work in the callback
    this.toggleLeftMenu = this.toggleLeftMenu.bind(this);
  }

  toggleLeftMenu() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  handleToggleAccountDropdown = () => {
    this.setState(state => ({ openAccountDropdown: !state.openAccountDropdown }));
  };

  handleCloseAccountDropdown = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ openAccountDropdown: false });
  };

  componentDidMount() {
    let loggedInUserId = auth.getCurrentUserId();

    db.getUserInfo(loggedInUserId).then(snapshot => {
      this.setState(() => ({ user: snapshot }))
    });

  }

  render() {
    const { classes } = this.props;
    const { openAccountDropdown } = this.state;
    const userename = this.state.user.username;
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

            <Button component={Link} to={routes.WALL} variant="contained" size="small" aria-label="Add" className={classes.button + ' btn-my'}>
              <Public />
            </Button>

            <Button
              variant="contained"
              size="small"
              className={classes.button + ' btn-my'}
              buttonRef={node => {
                this.anchorEl = node;
              }}
              aria-owns={openAccountDropdown ? 'menu-list-grow' : null}
              aria-haspopup="true"
              onClick={this.handleToggleAccountDropdown}
            >
              {userename}
              <Face className={classes.rightIcon} />
            </Button>

            <Popper open={openAccountDropdown} anchorEl={this.anchorEl} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  id="menu-list-grow"
                  style={{ transformOrigin: placement === 'bottom' ? 'right top' : 'right bottom' }}
                >
                  <Paper className="account-dropdown">
                    <ClickAwayListener onClickAway={this.handleCloseAccountDropdown}>
                      <MenuList>
                        <MenuItem component={Link} to={routes.ACCOUNT} onClick={this.handleCloseAccountDropdown}>My Account</MenuItem>
                        <MenuItem onClick={auth.doSignOut}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>

          </Toolbar>
        </AppBar>
        <LeftMenu toggleLeftMenuProp={this.state.isToggleOn} />
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

NavigationAuth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(NavigationAuth);