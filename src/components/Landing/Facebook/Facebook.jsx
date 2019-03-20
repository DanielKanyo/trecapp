import React, { Component } from 'react';
import AuthUserContext from '../../Session/AuthUserContext';

import FacebookAuth from './FacebookAuth';
import FacebookNonAuth from './FacebookNonAuth';

class Facebook extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => authUser ? <FacebookAuth renderFbProp={this.props.renderFbProp} /> : <FacebookNonAuth />}
      </AuthUserContext.Consumer>
    )
  }
}

export default Facebook;
