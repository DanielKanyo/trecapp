import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const styles = theme => ({
  paper: {
    padding: '4px 4px 4px 16px',
    position: 'relative',
    marginBottom: 14
  },
  button: {
    margin: 0,
  },
});

class ListItem extends Component {

  /**
   * Constructor
   * 
   * @param {Object} props 
   */
  constructor(props) {
    super(props);
    this.state = {
      loggedInUserId: this.props.loggedInUserIdProp,
      value: this.props.dataProp.value,
      itemId: this.props.dataProp.itemId,
      inBasket: this.props.dataProp.inBasket
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * pass id to parent component to delete item
   * 
   * @param {string} id 
   */
  handleDeleteItem(id) {
    this.props.deleteItemProp(id);
  }

  /**
   * Toggle inBasket value
   * 
   * @param {string} itemId 
   */
  handleToggleInBasket(itemId) {
    let inBasket = this.state.inBasket;

    db.updateItemInBasketValue(this.state.loggedInUserId, itemId, !inBasket);

    if (this.mounted) {
      this.setState({
        inBasket: !inBasket
      });

      if (inBasket) {
        toast.success(this.props.languageObjectProp.data.ShoppingList.toaster.notInBasket);
      } else {
        toast.success(this.props.languageObjectProp.data.ShoppingList.toaster.inBasket);
      }
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.paper}>
        <div className="ListItem">
          <div className="list-value-container">
            {this.state.value}
          </div>
          <div className="list-inBasket-btn-container">
            <IconButton
              onClick={() => { this.handleToggleInBasket(this.state.itemId) }}
              className={classes.button}
              aria-label="inBasket"
            >
              {this.state.inBasket ? <CheckCircleIcon className="in-basket-icon" /> : <CheckCircleOutlineIcon className="not-in-basket-icon" />}
            </IconButton>
          </div>
          <div className="list-delete-btn-container">
            <IconButton
              onClick={() => { this.handleDeleteItem(this.state.itemId) }}
              className={classes.button}
              aria-label="delete"
            >
              <HighlightOffIcon className="delete-item-btn" />
            </IconButton>
          </div>
        </div>
      </Paper>
    );
  }
}

const authCondition = (authUser) => !!authUser;

ListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(ListItem);