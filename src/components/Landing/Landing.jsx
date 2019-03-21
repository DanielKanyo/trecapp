import React, { Component } from 'react';
import AuthUserContext from '../Session/AuthUserContext';

import LandingAuth from './LandingAuth';
import LandingNonAuth from './LandingNonAuth';

class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      facebookAppId: ''
    };
  }

  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => authUser
          ? <LandingAuth
            authUser={authUser}
            languageObjectProp={this.props.languageObjectProp}
            renderFbProp={this.props.renderFbProp}
            appIdProp={this.state.facebookAppId}
          />
          : <LandingNonAuth
            languageObjectProp={this.props.languageObjectProp}
            appIdProp={this.state.facebookAppId}
          />
        }
      </AuthUserContext.Consumer>
    )
  }
}

export default Navigation
