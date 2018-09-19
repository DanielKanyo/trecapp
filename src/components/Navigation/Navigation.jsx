import React from 'react';
import AuthUserContext from '../Session/AuthUserContext';

import NavigationAuth from './NavigationAuth';

const Navigation = () =>
  <AuthUserContext.Consumer>
    { authUser => authUser
      ? <NavigationAuth />
      : null
    }
  </AuthUserContext.Consumer>

export default Navigation
