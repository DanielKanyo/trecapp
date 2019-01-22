import React, { Component } from 'react';
import './index.css';
import * as routes from '../../constants/routes';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import * as ROLES from '../../constants/roles';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Favorite from '@material-ui/icons/Favorite';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import Home from '@material-ui/icons/Home';
import Create from '@material-ui/icons/Create';
import Dashboard from '@material-ui/icons/Dashboard';
import Settings from '@material-ui/icons/Settings';
import Lock from '@material-ui/icons/Lock';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import Security from '@material-ui/icons/Security';
import AccountCircle from '@material-ui/icons/AccountCircle';
import BugReport from '@material-ui/icons/BugReport';
import Close from '@material-ui/icons/Close';
import AttachFile from '@material-ui/icons/AttachFile';

const styles = theme => ({});

class LeftMenu extends Component {

  /**
   * Constructor
   * 
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      isMinimized: true,
      isAdmin: false,
      loggedInUserId: '',
      user: ''
    };
  }

  componentDidMount = () => {
    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;

    let isAdmin = authObject.roles.includes(ROLES.ADMIN) ? true : false;
    let user = authObject;

    this.setState({
      loggedInUserId,
      isAdmin,
      user
    });
  }

  /**
   * Minimize the left menu, show only the icons
   */
  minimizeLeftMenu = () => {
    this.setState(state => ({
      isMinimized: !state.isMinimized
    }));
  }

  closeMenu = () => {
    let leftMenu = document.getElementsByClassName('LeftMenu');
    let blackBg = document.getElementsByClassName('black-background');

    if (leftMenu[0] && leftMenu[0].classList.contains('open')) {
      leftMenu[0].classList.remove('open');
      leftMenu[0].classList.add('closed');

      blackBg[0].classList.add('closed');
      blackBg[0].classList.remove('open');

      this.props.toggleLeftMenuProp(false);
    }
  }

  /**
   * Add class to the menu item, close menu if screen bigger than 750px, change isToggleOn value via toggleLeftMenuProp
   * 
   * @param {Object} e 
   */
  handleLeftMenuItemClicked = (e) => {
    const w = window.innerWidth;
    let menuItems = document.getElementsByClassName('menuItem');
    let leftMenu = document.getElementsByClassName('LeftMenu');

    let targetElement = e.target;

    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].classList.contains('activeMenuItem')) {
        menuItems[i].classList.remove('activeMenuItem');
      }
    }

    if (w < 750) {
      if (leftMenu[0] && leftMenu[0].classList.contains('open')) {

        leftMenu[0].classList.remove('open');
        leftMenu[0].classList.add('closed');

        this.props.toggleLeftMenuProp(false);
      }
    }

    targetElement.classList.add('activeMenuItem');
  }

  /**
   * Render function
   */
  render() {
    const isOpen = this.props.isToggleProp ? 'open' : 'closed';
    const isMinimized = this.state.isMinimized ? 'big' : 'small';
    const { languageObjectProp } = this.props;
    const { username, profilePicUrl } = this.state.user;

    return (
      <div>
        <div className={"black-background " + isOpen} onClick={this.closeMenu}></div>
        <div className={"LeftMenu " + isOpen + ' ' + isMinimized}>
          <div className="left-menu-content">
            <div className="left-menu-header">
              <div className="user-pic-in-leftmenu" style={{ backgroundImage: `url(${profilePicUrl})`}}></div>
              <div className="username-in-leftmenu">{username}</div>
            </div>
            <div className="close-container" onClick={this.closeMenu}><Close /></div>
            <List component="nav">

              <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.WALL}>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary={languageObjectProp.data.menuItems[0]} />
              </ListItem>

              <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.MYRECIPES}>
                <ListItemIcon>
                  <Create />
                </ListItemIcon>
                <ListItemText primary={languageObjectProp.data.menuItems[1]} />
              </ListItem>

              <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.FAVOURITES}>
                <ListItemIcon>
                  <Favorite />
                </ListItemIcon>
                <ListItemText primary={languageObjectProp.data.menuItems[2]} />
              </ListItem>

              <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.SHOPPINGLIST}>
                <ListItemIcon>
                  <PlaylistAdd />
                </ListItemIcon>
                <ListItemText primary={languageObjectProp.data.menuItems[3]} />
              </ListItem>

              <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.CATEGORIES}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary={languageObjectProp.data.menuItems[4]} />
              </ListItem>

              <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.BUGREPORT}>
                <ListItemIcon>
                  <BugReport />
                </ListItemIcon>
                <ListItemText primary={languageObjectProp.data.menuItems[9]} />
              </ListItem>
              <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.IMPRESSUM}>
                <ListItemIcon>
                  <AttachFile />
                </ListItemIcon>
                <ListItemText primary={languageObjectProp.data.menuItems[10]} />
              </ListItem>
            </List>

            <Divider className="left-menu-divider divider-toggle" />

            <List component="nav" className="nav-toggle">

              <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={`/user/${this.state.loggedInUserId}`}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary={languageObjectProp.data.menuItems[5]} />
              </ListItem>

              <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.ACCOUNT}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary={languageObjectProp.data.menuItems[6]} />
              </ListItem>

              <ListItem className="menuItem" button onClick={auth.doSignOut}>
                <ListItemIcon>
                  <Lock />
                </ListItemIcon>
                <ListItemText primary={languageObjectProp.data.menuItems[7]} />
              </ListItem>

            </List>

            {
              this.state.isAdmin ?
                <div>
                  <Divider className="left-menu-divider divider-toggle" />

                  <List component="nav" className="nav-toggle">

                    <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.ADMIN}>
                      <ListItemIcon>
                        <Security />
                      </ListItemIcon>
                      <ListItemText primary={languageObjectProp.data.menuItems[8]} />
                    </ListItem>

                  </List>
                </div> : ''
            }


            <div className="bottom">
              <Divider className="left-menu-divider" />
              <List component="nav">
                <ListItem className="minimize-btn" button onClick={this.minimizeLeftMenu}>
                  <ListItemIcon>
                    <SwapHoriz />
                  </ListItemIcon>
                </ListItem>
              </List>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

LeftMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LeftMenu);