import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({});

class Edit extends Component {

  /**
   * Constructor
   * 
   * @param {Object} props 
   */
	constructor(props) {
		super(props);
		this.state = {
			recipeId: this.props.match.params.id,
		};
	}

  render() {
    return (
      <div className="ComponentContent">
        Edit page ({this.state.recipeId})
      </div>
    )
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Edit);