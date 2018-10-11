import React, { Component } from 'react';
import '../App/index.css';
import { auth, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ListItem from './ListItem';
import Paper from '@material-ui/core/Paper';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import HistoryIcon from '@material-ui/icons/History';

import Notifications, { notify } from 'react-notify-toast';

const styles = theme => ({
  textField: {
    width: '100%',
    marginTop: 8
  },
  paper: {
    padding: '8px 16px',
    position: 'relative',
    marginBottom: 14
  },
  button: {
    margin: '8px 4px'
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#03c457',
      main: '#03c457',
      dark: '#03c457',
      contrastText: '#fff',
    }
  }
});

class ShoppingList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedInUserId: '',
      product: '',
      items: []
    }

    this.saveItem = this.saveItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount() {
    this.mounted = true;

    let loggedInUserId = auth.getCurrentUserId();
    let previousItems = this.state.items;

    this.setState({
      loggedInUserId
    });

    db.getShoppingListItems(loggedInUserId).then(resItem => {

      for (var key in resItem) {
        if (resItem.hasOwnProperty(key)) {
          let data = resItem[key];

          data.itemId = key;

          previousItems.push(
            <ListItem
              key={key}
              dataProp={data}
              languageObjectProp={this.props.languageObjectProp}
              loggedInUserIdProp={loggedInUserId}
              deleteItemProp={this.deleteItem}
            />
          )
        }
      }

      this.setState({
        items: previousItems
      });

    });
  }

  changeProductValue = name => event => {
    this.setState({ [name]: event.target.value });
  };

  /**
   * Save shopping list item
   */
  saveItem() {
    let items = this.state.items;

    if (this.state.product !== '') {
      let item = {
        value: this.state.product,
        creationTime: new Date().getTime(),
        inBasket: false
      };

      let data = item;

      db.addItem(this.state.loggedInUserId, item).then(snap => {
        data.itemId = snap.key;

        let temp = items.concat(
          <ListItem
            key={snap.key}
            dataProp={data}
            languageObjectProp={this.props.languageObjectProp}
            loggedInUserIdProp={this.state.loggedInUserId}
            deleteItemProp={this.deleteItem}
          />
        );

        this.setState({
          items: temp
        });
      });

      this.setState({
        product: ''
      });
    } else {
      this.toastr('Fill the input field!', '#ffc107');
    }
  }

  /**
   * Delete item from database and from array
   * 
   * @param {string} itemId 
   */
  deleteItem(itemId) {
    let previousItems = this.state.items;

    db.removeShoppingListItem(this.state.loggedInUserId, itemId);

    for (let i = 0; i < previousItems.length; i++) {
      if (previousItems[i].key === itemId) {
        previousItems.splice(i, 1);
      }
    }

    this.setState({
      items: previousItems
    });

    this.toastr('Item deleted!', '#4BB543');
  }

  /**
   * Show notification
   * 
   * @param {string} msg 
   * @param {string} bgColor 
   */
  toastr(msg, bgColor) {
    let style = { background: bgColor, text: "#FFFFFF" };

    notify.show(msg, 'custom', 3000, style);
  }

  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;
    let { items } = this.state;

    return (
      <div className="ComponentContent ShoppingList">
        <MuiThemeProvider theme={theme}>
          <Grid className="main-grid" container spacing={16}>


            <Grid item className="grid-component" xs={6}>
              <Paper className={classes.paper + ' paper-title paper-title-shoppinglist'}>
                <div className="paper-title-icon">
                  <PlaylistAdd />
                </div>
                <div className="paper-title-text">
                  {languageObjectProp.data.menuItems[4]}
                </div>
              </Paper>

              <Paper className={classes.paper}>
                <div className="shoppinglist-input-container">
                  <TextField
                    id="standard-bare"
                    className={classes.textField}
                    placeholder={languageObjectProp.data.ShoppingList.input}
                    value={this.state.product}
                    margin="normal"
                    onChange={this.changeProductValue('product')}
                  />
                </div>
                <IconButton onClick={this.saveItem} className={classes.button + ' add-item-btn'} aria-label="addItem">
                  <AddIcon />
                </IconButton>
              </Paper>

              {items.length === 0 ? <EmptyList /> : ''}

              {items.map((item, index) => {
                return item;
              })}

            </Grid>

            <Grid item className="grid-component" xs={6}>
              <Paper className={classes.paper + ' paper-title paper-title-recent-product'}>
                <div className="paper-title-icon">
                  <HistoryIcon />
                </div>
                <div className="paper-title-text">
                  {languageObjectProp.data.ShoppingList.recentProduct}
                </div>
              </Paper>

              <EmptyList />
            </Grid>

          </Grid>

        </MuiThemeProvider>

        <Notifications options={{ zIndex: 5000 }} />
      </div>
    );
  }
}

const EmptyList = () =>
  <div className="empty-container">
    Empty
  </div>

const authCondition = (authUser) => !!authUser;

ShoppingList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(ShoppingList);