import React, { Component } from 'react';
import './index.css';
import * as routes from '../../constants/routes';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Favorite from '@material-ui/icons/Favorite';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import Public from '@material-ui/icons/Public';
import Receipt from '@material-ui/icons/Receipt';
import Fastfood from '@material-ui/icons/Fastfood';
import Face from '@material-ui/icons/Face';
import Lock from '@material-ui/icons/Lock';

const styles = theme => ({});

class LeftMenu extends Component {

  /**
   * Constructor
   * 
   * @param {Object} props - props object
   */
  constructor(props) {
    super(props);
    this.state = {
      isMinimized: true
    };

    // This binding is necessary to make `this` work in the callback
    this.minimizeLeftMenu = this.minimizeLeftMenu.bind(this);
    this.handleLeftMenuItemClicked = this.handleLeftMenuItemClicked.bind(this);
  }

  /**
   * Minimize the left menu, show only the icons
   */
  minimizeLeftMenu() {
    this.setState(state => ({
      isMinimized: !state.isMinimized
    }));
  }

  /**
   * Add class to the menu item, close menu if screen bigger than 750px, change isToggleOn value via toggleLeftMenuProp
   * 
   * @param e - event
   */
  handleLeftMenuItemClicked(e) {
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

    return (
      <div className={"LeftMenu " + isOpen + ' ' + isMinimized}>
        <div className="left-menu-content">
          <div className="left-menu-background-image"></div>
          <List component="nav">

            <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.MYRECIPES}>
              <ListItemIcon>
                <Receipt />
              </ListItemIcon>
              <ListItemText primary="My Recipes" />
            </ListItem>

            <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.WALL}>
              <ListItemIcon>
                <Public />
              </ListItemIcon>
              <ListItemText primary="Recipes Wall" />
            </ListItem>

            <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.MYRECIPES}>
              <ListItemIcon>
                <Favorite />
              </ListItemIcon>
              <ListItemText primary="Favourites" />
            </ListItem>

            <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.MYRECIPES}>
              <ListItemIcon>
                <Fastfood />
              </ListItemIcon>
              <ListItemText primary="Food Porn" />
            </ListItem>
          </List>

          <Divider className="left-menu-divider divider-toggle" />

          <List component="nav" className="nav-toggle">

            <ListItem className="menuItem" button onClick={this.handleLeftMenuItemClicked} component={Link} to={routes.ACCOUNT}>
              <ListItemIcon>
                <Face />
              </ListItemIcon>
              <ListItemText primary="My Acoount" />
            </ListItem>

            <ListItem className="menuItem" button onClick={auth.doSignOut}>
              <ListItemIcon>
                <Lock />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>

          </List>

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
    );
  }
}

LeftMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LeftMenu);