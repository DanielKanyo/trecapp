import React, { Component } from 'react';
import '../App/index.css';
// import { auth, db } from '../../firebase';
import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({});

class User extends Component {

 constructor(props) {
  super(props);
  this.state = {
   userId: this.props.match.params.id
  }
 }

 render() {
  return (
   <div className="ComponentContent">
    {this.state.userId}
   </div>
  )
 }
}

const authCondition = (authUser) => !!authUser;

User.propTypes = {
 classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(User);