import React from 'react';

const LandingPage = (props) =>
  <div className={props.isAuthenticatedProp ? "ComponentContent" : ''}>
    <div>
      <div>{props.isAuthenticatedProp}Landing</div>
      <p>The Landing Page is open to everyone, even though the user isn't signed in.</p>
    </div>

  </div>
  
export default LandingPage;