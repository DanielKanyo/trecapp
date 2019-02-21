import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({})

class CommentItem extends Component {
  /**
   * Constructor
   * 
   * @param {Object} props 
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>Comment</div>
    )
  }
}

CommentItem.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommentItem);