import React, { Component } from 'react';
import '../App/index.css';
// import { db, storage } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  
});

class CategoryRecipes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categoryName: this.props.match.params.category,
    };
  }

  render() {
    // const { classes } = this.props;
    
    return (
      <div className="ComponentContent">
        {this.props.match.params.category}
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;

CategoryRecipes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(CategoryRecipes);