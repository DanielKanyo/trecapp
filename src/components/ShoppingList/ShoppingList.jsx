import React, { Component } from 'react';
import '../App/index.css';
import { db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
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
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import MenuItem from '@material-ui/core/MenuItem';

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => { }, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            );
        })}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value, suggestionsObjectProp) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestionsObjectProp.filter(suggestion => {
      const keep =
        count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

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
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
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
      suggestions: [],
    }
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.suggestionsObjectProp),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  /**
   * Change product value
   */
  changeProductValue = name => (event, { newValue }) => {
    this.setState({
      [name]: newValue,
    });
  };

  componentDidMount() {
    this.mounted = true;

    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;
    let previousItems = this.state.items;
    let previousResentProducts = this.state.recentProducts;

    this.setState({
      loggedInUserId
    });

    db.getShoppingListItems(loggedInUserId).then(resItem => {
      if (this.mounted) {
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
      }
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
  saveItem = (e, newValue) => {
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

      toast.success(this.props.languageObjectProp.data.ShoppingList.toaster.itemAdded);

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
      toast.warn(this.props.languageObjectProp.data.ShoppingList.toaster.inputWarning);
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
   * @param {String} itemId 
   */
  deleteItem = (itemId) => {
    let previousItems = this.state.items;

    db.removeShoppingListItem(this.state.loggedInUserId, itemId);

    for (let i = 0; i < previousItems.length; i++) {
      if (previousItems[i].key === itemId) {
        previousItems.splice(i, 1);
      }
    }

    if (this.mounted) {
      this.setState({
        items: previousItems
      });
    }

    toast.success(this.props.languageObjectProp.data.ShoppingList.toaster.productDel);
  }

  /**
   * Delete all shopping list item
   */
  deleteAllItem = () => {
    if (this.state.items.length === 0) {
      toast.warn(this.props.languageObjectProp.data.ShoppingList.toaster.noItemInList);
    } else {
      db.deleteAllShoppingListItem(this.state.loggedInUserId);

      toast.success(this.props.languageObjectProp.data.ShoppingList.toaster.allItemDeleted);

      this.setState({
        items: []
      });
    }
  }

  /**
   * Clear all recent products
   */
  handleClearResentProducts = () => {
    db.clearRecentProducts(this.state.loggedInUserId);

    this.setState({
      recentProducts: []
    });
  }

  /**
   * add item from recent products
   * 
   * @param {Object} e 
   * @param {String} value 
   */
  handleAddItemFromRecentProduct = (e, value) => {
    this.saveItem(e, value);
  }

  render() {
    const { classes, languageObjectProp } = this.props;
    let { items, recentProducts } = this.state;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

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
                  {languageObjectProp.data.menuItems[3]}
                </div>
                <div className="delete-items-container">
                  <Button
                    variant="contained"
                    size="small"
                    aria-label="Delete"
                    className={classes.buttonDelete + ' btn-delete-item'}
                    onClick={this.handleClickOpenDialog}
                    disabled={items.length === 0 ? true : false}
                  >
                    {languageObjectProp.data.ShoppingList.deleteAllBtn}
                    <DeleteForeverIcon className={classes.rightIcon} />
                  </Button>
                </div>
              </Paper>

              <Paper className={classes.paper}>
                <div className="shoppinglist-input-container">
                  <Autosuggest
                    className={classes.textField}
                    id="product-autocomplete"
                    {...autosuggestProps}
                    inputProps={{
                      classes,
                      placeholder: languageObjectProp.data.ShoppingList.input,
                      value: this.state.product,
                      onChange: this.changeProductValue('product'),
                      onKeyPress: this.handleKeyPressAddItem
                    }}
                    theme={{
                      container: classes.container,
                      suggestionsContainerOpen: classes.suggestionsContainerOpen,
                      suggestionsList: classes.suggestionsList,
                      suggestion: classes.suggestion,
                    }}
                    renderSuggestionsContainer={options => (
                      <Paper {...options.containerProps} square>
                        {options.children}
                      </Paper>
                    )}
                  />
                </div>
                <IconButton
                  onClick={this.saveItem}
                  className={classes.button + ' add-item-btn'}
                  aria-label="addItem">
                  <AddIcon />
                </IconButton>
              </Paper>

              {items.length === 0 ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

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
                    disabled={recentProducts.length === 0 ? true : false}
                  >
                    <ClearIcon />
                  </Button>
                </div>
              </Paper>

              {recentProducts.length === 0 ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

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

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          pauseOnHover
        />
      </div>
    );
  }
}

const EmptyList = (props) =>
  <div className="empty-container">
    {props.languageObjectProp.data.emptyList}
  </div>

const authCondition = (authUser) => !!authUser;

ShoppingList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(ShoppingList);