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
import Language from '@material-ui/icons/Language';
import MoreVert from '@material-ui/icons/MoreVert';
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
      openLanguageDropdown: false,
      openLanguageSecDropdown: false,
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
    if (this.account.contains(event.target)) {
      return;
    }

    this.setState({ openAccountDropdown: false });
  };

  /**
   * Open or close the language dropdown menu
   */
  handleToggleLanguageDropdown = () => {
    this.setState(state => ({ openLanguageDropdown: !state.openLanguageDropdown }));
  };

  handleCloseLanguageDropdown = event => {
    if (this.language.contains(event.target)) {
      return;
    }

    this.setState({ openLanguageDropdown: false });
  };

  /**
   * Open or close the language dropdown menu
   */
  handleToggleLanguageSecDropdown = () => {
    this.setState(state => ({ openLanguageSecDropdown: !state.openLanguageSecDropdown }));
  };

  handleCloseLanguageSecDropdown = event => {
    if (this.languageSec.contains(event.target)) {
      return;
    }

    this.setState({ openLanguageSecDropdown: false });
  };

  /**
   * Set isToggleOn state depends on the screen width
   */
  componentWillMount() {
    this.windowWidth = window.innerWidth;

    if (this.windowWidth < 750) {
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

  changeLanguage = (language) => {
    this.props.setLanguageProp(language);

    db.updateUserLanguage(this.state.loggedInUserId, language);
  }

  /**
   * Render function
   */
  render() {
    const { classes, authUser } = this.props;
    const { openAccountDropdown, openLanguageDropdown, openLanguageSecDropdown } = this.state;
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

                    <Button
                      variant="contained"
                      size="small"
                      aria-label="Add"
                      className={classes.button + ' btn-my'}
                      buttonRef={node => {
                        this.language = node;
                      }}
                      aria-owns={openLanguageDropdown ? 'menu-list-grow' : null}
                      aria-haspopup="true"
                      onClick={this.handleToggleLanguageDropdown}
                    >
                      <Language />
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      className={classes.button + ' btn-my'}
                      buttonRef={node => {
                        this.account = node;
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

                    {
                      authUser.roles.includes(ROLES.ADMIN) && (
                        <Button component={Link} to={ROUTES.ADMIN} variant="contained" size="small" aria-label="Add" className={classes.button + ' btn-my'}>
                          <Security />
                        </Button>
                      )
                    }
                  </div>
                  <div className="language-selector-container-for-mobile">
                    <IconButton
                      color="inherit"
                      aria-label="Menu"
                      buttonRef={node => {
                        this.languageSec = node;
                      }}
                      aria-owns={openLanguageSecDropdown ? 'menu-list-grow' : null}
                      aria-haspopup="true"
                      onClick={this.handleToggleLanguageSecDropdown}
                    >
                      <MoreVert />
                    </IconButton>
                  </div>
                  <Popper open={openAccountDropdown} anchorEl={this.account} transition disablePortal>
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

                  <Popper open={openLanguageDropdown} anchorEl={this.language} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: placement === 'bottom' ? 'right top' : 'right bottom' }}
                      >
                        <Paper className="language-dropdown">
                          <ClickAwayListener onClickAway={this.handleCloseLanguageDropdown}>
                            <MenuList>
                              <MenuItem onClick={(e) => { this.handleCloseLanguageDropdown(e); this.changeLanguage('eng') }}>
                                English
                              </MenuItem>
                              <MenuItem onClick={(e) => { this.handleCloseLanguageDropdown(e); this.changeLanguage('hun') }}>
                                Magyar
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>

                  <Popper open={openLanguageSecDropdown} anchorEl={this.languageSec} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: placement === 'bottom' ? 'right top' : 'right bottom' }}
                      >
                        <Paper className="language-dropdown">
                          <ClickAwayListener onClickAway={this.handleCloseLanguageSecDropdown}>
                            <MenuList>
                              <MenuItem onClick={(e) => { this.handleCloseLanguageSecDropdown(e); this.changeLanguage('eng') }}>
                                English
                              </MenuItem>
                              <MenuItem onClick={(e) => { this.handleCloseLanguageSecDropdown(e); this.changeLanguage('hun') }}>
                                Magyar
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