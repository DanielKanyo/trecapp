import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';

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
    this.state = {};

    // this.handleDeleteItem = this.handleDeleteItem.bind(this);
  }

  /**
   * pass id to parent component to delete item
   * 
   * @param {string} id 
   */
  handleDeleteItem(id) {
    this.props.deleteItemProp(id);
  }

  render() {
    const { classes } = this.props;
    let { inBasket } = this.props.dataProp;
    console.log(inBasket);

    return (
      <Paper className={classes.paper}>
        <div className="ListItem">
          <div className="list-value-container">
            {this.props.dataProp.value}
          </div>
          <div className="list-inBasket-btn-container">
            <IconButton
              onClick={() => { this.handleToggleInBasket(this.props.dataProp.itemId) }}
              className={classes.button}
              aria-label="inBasket"
            >
              {inBasket ? <DoneAllIcon /> : <DoneIcon className="done-icon" />}
            </IconButton>
          </div>
          <div className="list-delete-btn-container">
            <IconButton
              onClick={() => { this.handleDeleteItem(this.props.dataProp.itemId) }}
              className={classes.button}
              aria-label="delete"
            >
              <ClearIcon />
            </IconButton>
          </div>
        </div>
      </Paper>
    );
  }
}

ListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListItem);