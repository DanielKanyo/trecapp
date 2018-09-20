import React, { Component } from 'react';
import './index.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Favorite from '@material-ui/icons/Favorite';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import Style from '@material-ui/icons/Style';
import Restaurant from '@material-ui/icons/Restaurant';
import Fastfood from '@material-ui/icons/Fastfood';

const styles = theme => ({
  
});

class LeftMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMinimized: true
    };

    // This binding is necessary to make `this` work in the callback
    this.minimizeLeftMenu = this.minimizeLeftMenu.bind(this);
  }

  minimizeLeftMenu() {
    this.setState(state => ({
      isMinimized: !state.isMinimized
    }));
  }

  render() {

    const isOpen = this.props.toggleLeftMenuProp ? 'open' : 'closed';
    const isMinimized = this.state.isMinimized ? 'big' : 'small'; 

    return (
      <div className={"LeftMenu " + isOpen + ' ' + isMinimized}>
        <div className="left-menu-content">
          <List component="nav">

            <ListItem button>
              <ListItemIcon>
                <Restaurant />
              </ListItemIcon>
              <ListItemText primary="My Recipes" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <Style />
              </ListItemIcon>
              <ListItemText primary="Recipes Wall" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <Favorite />
              </ListItemIcon>
              <ListItemText primary="Favourites" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <Fastfood />
              </ListItemIcon>
              <ListItemText primary="Food Porn" />
            </ListItem>

          </List>
          <div className="bottom">
          <Divider />
          <List component="nav">
            <ListItem button onClick={this.minimizeLeftMenu}>
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