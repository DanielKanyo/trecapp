import React, { Component } from 'react';
import '../App/index.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  
});

class MyRecipes extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  render() {
    return (
      <div className="ComponentContent">
        MyRecipes
      </div>
    );
  }
}

MyRecipes.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(MyRecipes);