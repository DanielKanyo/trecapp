import React, { Component } from 'react';

import AuthUserContext from '../Session/AuthUserContext';
import { PasswordForgetForm } from '../PasswordForget/PasswordForget';
import PasswordChangeForm from '../PasswordChange/PasswordChange';
import withAuthorization from '../Session/withAuthorization';

class AccountPage extends Component {
  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <div className="ComponentContent">
            <div>
              <h1>Account: {authUser.email}</h1>
              <PasswordForgetForm />
              <PasswordChangeForm />
            </div>
          </div>
        }
      </AuthUserContext.Consumer>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);