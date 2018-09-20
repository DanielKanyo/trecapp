import React from 'react';
import AuthUserContext from '../Session/AuthUserContext';

import NavigationAuth from './NavigationAuth';
import NavigationNonAuth from './NavigationNonAuth';

const Navigation = () =>
  <AuthUserContext.Consumer>
    { authUser => authUser
      ? <NavigationAuth />
      : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>

export default Navigation
