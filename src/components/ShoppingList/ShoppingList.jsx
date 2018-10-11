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
import ClearIcon from '@material-ui/icons/Clear';
import HistoryIcon from '@material-ui/icons/History';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Chip from '@material-ui/core/Chip';
import AddCircleIcon from '@material-ui/icons/AddCircle';

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
  buttonDelete: {
    width: 'auto',
    color: 'white',
    marginLeft: 'auto',
    background: '#03c457',
    padding: '7px 8px 7px 12px'
  },
  buttonClear: {
    width: 'auto',
    color: 'white',
    marginLeft: 'auto',
    background: '#01c1c4',
    padding: '7px 0px 7px 0px',
    minWidth: 50
  },
  rightIcon: {
    marginLeft: 8,
  },
  chip: {
    margin: theme.spacing.unit,
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
      items: [],
      recentProducts: [],
      dialogOpen: false,
    }

    this.saveItem = this.saveItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deleteAllItem = this.deleteAllItem.bind(this);
    this.handleClearResentProducts = this.handleClearResentProducts.bind(this);
    this.handleAddItemFromRecentProduct = this.handleAddItemFromRecentProduct.bind(this);
  }

  componentDidMount() {
    this.mounted = true;

    let loggedInUserId = auth.getCurrentUserId();
    let previousItems = this.state.items;
    let previousResentProducts = this.state.recentProducts;

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

    db.getResentProducts(loggedInUserId).then(resResProd => {
      if (this.mounted) {
        for (var key in resResProd) {
          let rp = resResProd[key];

          if (resResProd.hasOwnProperty(key)) {
            previousResentProducts.push(
              <Chip
                key={key}
                label={rp.value}
                className="res-prod-chip-item"
                onDelete={(e) => { this.handleAddItemFromRecentProduct(e, rp.value) }}
                deleteIcon={<AddCircleIcon />}
              />
            );

            this.setState({
              recentProducts: previousResentProducts
            });
          }
        }
      }
    });
  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  changeProductValue = name => event => {
    this.setState({ [name]: event.target.value });
  };

  /**
   * Open dialog
   */
  handleClickOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  /**
   * Close dialog
   */
  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };

  /**
   * Save shopping list item
   */
  saveItem(e, newValue) {
    let items = this.state.items;
    let recentProducts = this.state.recentProducts;

    if (this.state.product !== '' || newValue) {
      let item = {
        value: newValue ? newValue : this.state.product,
        creationTime: new Date().getTime(),
        inBasket: false
      };

      let data = item;

      db.addItem(this.state.loggedInUserId, item).then(resItem => {
        data.itemId = resItem.key;

        let temp = items.concat(
          <ListItem
            key={resItem.key}
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

      this.toastr(this.props.languageObjectProp.data.ShoppingList.toaster.itemAdded, '#4BB543')

      if (!newValue) {
        db.saveProductForRecent(this.state.loggedInUserId, item.value).then(resResProd => {
          let temp = recentProducts.concat(
            <Chip
              key={resResProd.key}
              label={item.value}
              className="res-prod-chip-item"
              onDelete={(e) => { this.handleAddItemFromRecentProduct(e, item.value) }}
              deleteIcon={<AddCircleIcon />}
            />
          );

          this.setState({
            recentProducts: temp
          });
        });
      }

      this.setState({
        product: ''
      });
    } else {
      this.toastr(this.props.languageObjectProp.data.ShoppingList.toaster.inputWarning, '#ffc107');
    }
  }

  /**
   * If user press enter, call saveItem function
   */
  handleKeyPressAddItem = event => {
    if (event.key === 'Enter') {
      this.saveItem();
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

    this.toastr(this.props.languageObjectProp.data.ShoppingList.toaster.productDel, '#4BB543');
  }

  /**
   * Delete all shopping list item
   */
  deleteAllItem() {
    if (this.state.items.length === 0) {
      this.toastr(this.props.languageObjectProp.data.ShoppingList.toaster.noItemInList, '#ffc107');
    } else {
      db.deleteAllShoppingListItem(this.state.loggedInUserId);

      this.toastr(this.props.languageObjectProp.data.ShoppingList.toaster.allItemDeleted, '#4BB543');

      this.setState({
        items: []
      });
    }
  }

  /**
   * Clear all recent products
   */
  handleClearResentProducts() {
    db.clearRecentProducts(this.state.loggedInUserId);

    this.setState({
      recentProducts: []
    });
  }

  handleAddItemFromRecentProduct(e, value) {
    this.saveItem(e, value);
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
    let { recentProducts } = this.state;

    return (
      <div className="ComponentContent ShoppingList">
        <MuiThemeProvider theme={theme}>
          <Grid className="main-grid" container spacing={16}>

            <Grid item className="grid-component new-shopping-list-grid" xs={6}>
              <Paper className={classes.paper + ' paper-title paper-title-shoppinglist'}>
                <div className="paper-title-icon">
                  <PlaylistAdd />
                </div>
                <div className="paper-title-text">
                  {languageObjectProp.data.menuItems[4]}
                </div>
                <div className="delete-items-container">
                  <Button
                    variant="contained"
                    size="small"
                    aria-label="Delete"
                    className={classes.buttonDelete + ' btn-delete-item'}
                    onClick={this.handleClickOpenDialog}
                  >
                    {languageObjectProp.data.ShoppingList.deleteAllBtn}
                    <DeleteForeverIcon className={classes.rightIcon} />
                  </Button>
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
                    onKeyPress={this.handleKeyPressAddItem}
                  />
                </div>
                <IconButton
                  onClick={this.saveItem}
                  className={classes.button + ' add-item-btn'}
                  aria-label="addItem">
                  <AddIcon />
                </IconButton>
              </Paper>

              {items.length === 0 ? <EmptyList /> : ''}

              {items.map((item, index) => {
                return item;
              })}

            </Grid>

            <Grid item className="grid-component recent-product-grid" xs={6}>
              <Paper className={classes.paper + ' paper-title paper-title-recent-product'}>
                <div className="paper-title-icon">
                  <HistoryIcon />
                </div>
                <div className="paper-title-text">
                  {languageObjectProp.data.ShoppingList.recentProduct}
                </div>
                <div className="delete-res-prod-container">
                  <Button
                    variant="contained"
                    size="small"
                    aria-label="Clear Products"
                    className={classes.buttonClear + ' clear-all-resent-products'}
                    onClick={this.handleClearResentProducts}
                  >
                    <ClearIcon />
                  </Button>
                </div>
              </Paper>

              {recentProducts.length === 0 ? <EmptyList /> : ''}

              <div className="recent-products-chips-container">
                {recentProducts.map((product, index) => {
                  return product;
                })}
              </div>

            </Grid>

          </Grid>

        </MuiThemeProvider>

        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          id='delete-all-item-dialog'
        >
          <DialogTitle id="alert-dialog-title">{languageObjectProp.data.ShoppingList.modal.title}</DialogTitle>
          <DialogContent id="alert-dialog-content">
            <DialogContentText id="alert-dialog-description">
              {languageObjectProp.data.ShoppingList.modal.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              {languageObjectProp.data.ShoppingList.modal.cancel}
            </Button>
            <Button onClick={() => { this.handleCloseDialog(); this.deleteAllItem() }} color="primary" autoFocus>
              {languageObjectProp.data.ShoppingList.modal.do}
            </Button>
          </DialogActions>
        </Dialog>

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