import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from '../Navigation/Navigation';
import SignUpPage from '../SignUp/SignUp';
import LandingPage from '../Landing/Landing';
import SignInPage from '../SignIn/SignIn';
import PasswordForgetPage from '../PasswordForget/PasswordForget';
import World from '../World/World';
import AccountPage from '../Account/Account';
import withAuthentication from '../Session/withAuthentication';
import * as routes from '../../constants/routes';

import './index.css';

const App = () =>
  <Router>
    <div className="app">
      <Navigation />

      <Route exact path={routes.LANDING} component={() => <LandingPage />} />
      <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
      <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
      <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
      <Route exact path={routes.WORLD} component={() => <World />} />
      <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
    </div>
  </Router>

export default withAuthentication(App);