import React from 'react';
import { FacebookProvider, Like } from 'react-facebook';

const FacebookNonAuth = (props) => {
  return (
    <FacebookProvider appId="">
      <Like href="https://www.facebook.com/Trecapp-415056679268737/" layout="button_count" action="recommend" share />
    </FacebookProvider>
  );
}

export default FacebookNonAuth;