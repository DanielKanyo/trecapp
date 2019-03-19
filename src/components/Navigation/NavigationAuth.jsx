import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftMenu from '../LeftMenu/LeftMenu';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
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
import Security from '@material-ui/icons/Security';
import Home from '@material-ui/icons/Home';
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
    textDecoration: 'none',
    opacity: 0
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
    paddingTop: 0,
    paddingBottom: 0,
    height: 36,
    background: '#F8B000',
    color: 'white'
  },
  rightIcon: {
    marginLeft: 12,
  },
  iconSmall: {
    fontSize: 20,
  }
};

class NavigationAuth extends Component {

  /**
   * 
   * @param {Object} props - props object 
   */
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true,
      user: {},
      openAccountDropdown: false,
      loggedInUserId: '',
      emailVerified: false,
    };
  }

  /**
   * Toggle left menu function, set isToggleOn state
   */
  toggleLeftMenu = () => {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  /**
   * Open or close the account dropdown menu
   */
  handleToggleAccountDropdown = () => {
    this.setState(state => ({ openAccountDropdown: !state.openAccountDropdown }));
  };

  handleCloseAccountDropdown = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ openAccountDropdown: false });
  };

  /**
   * Set isToggleOn state depends on the screen width
   */
  componentWillMount() {
    const w = window.innerWidth;

    if (w < 750) {
      this.setState({
        isToggleOn: false
      });
    }
  }

  /**
   * Get user info to set language and then save user object
   */
  componentDidMount() {
    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;

    let emailVerified = authObject.emailVerified;

    this.setState({
      loggedInUserId,
      emailVerified
    });

    db.getUserInfo(loggedInUserId).then(snapshot => {
      this.props.setLanguageProp(snapshot.language);
      this.props.setIsUserAuthenticatedProp(loggedInUserId ? true : false)
      this.setState(() => ({ user: snapshot }))
    });
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(() => ({ emailVerified: nextProps.authUser.emailVerified }))
  }

  /**
   * Render function
   */
  render() {
    const { classes, authUser } = this.props;
    const { openAccountDropdown } = this.state;
    const { username, profilePicUrl } = this.state.user;

    const { languageObjectProp } = this.props;

    return (
      <div className={classes.root}>
        {
          this.state.emailVerified ?
            <div>
              <AppBar className={classes.appbar + ' app-bar-nav'} position="static">
                <Toolbar>
                  <IconButton onClick={this.toggleLeftMenu} className={classes.menuButton} color="inherit" aria-label="Menu">
                    <MenuIcon />
                  </IconButton>

                  <Typography component={Link} to={ROUTES.LANDING} variant="h6" color="inherit" className={classes.grow + ' app-bar-title'}>
                    TRECAPP
                  </Typography>
                  <div className="navigation-right-side">
                    <Button component={Link} to={ROUTES.WALL} variant="contained" size="small" aria-label="Add" className={classes.button + ' btn-my'}>
                      <Home />
                    </Button>
                    {authUser.roles.includes(ROLES.ADMIN) && (
                      <Button component={Link} to={ROUTES.ADMIN} variant="contained" size="small" aria-label="Add" className={classes.button + ' btn-my'}>
                        <Security />
                      </Button>
                    )}

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
                      {username}
                      {
                        profilePicUrl ?
                          <div className={classes.rightIcon + ' prof-pic-nav'} style={{ backgroundImage: `url(${profilePicUrl})` }} />
                          :
                          <Face className={classes.rightIcon} />
                      }
                    </Button>
                  </div>
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
                              <MenuItem component={Link} to={`/user/${this.state.loggedInUserId}`} onClick={this.handleCloseAccountDropdown}>
                                {languageObjectProp.data.Navigation.dropdownValues[0]}
                              </MenuItem>
                              <MenuItem component={Link} to={ROUTES.ACCOUNT} onClick={this.handleCloseAccountDropdown}>
                                {languageObjectProp.data.Navigation.dropdownValues[1]}
                              </MenuItem>
                              <MenuItem onClick={auth.doSignOut}>
                                {languageObjectProp.data.Navigation.dropdownValues[2]}
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>

                </Toolbar>
              </AppBar>
              <LeftMenu isToggleProp={this.state.isToggleOn} toggleLeftMenuProp={this.toggleLeftMenu} languageObjectProp={languageObjectProp} />
            </div> :
            <div>
              <AppBar className={classes.appbar + ' app-bar-nav-non-auth'} position="static">
                <Toolbar>
                  <Typography component={Link} to={ROUTES.WALL} variant="h6" color="inherit" className={classes.grow}>
                    {/* My Recipes */}
                  </Typography>
                </Toolbar>
              </AppBar>
            </div>
        }

      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

NavigationAuth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(NavigationAuth);