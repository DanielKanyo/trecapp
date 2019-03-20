import React, { Component } from 'react';
import { FacebookProvider, Like } from 'react-facebook';
import withAuthorization from '../../Session/withAuthorization';

class FacebookAuth extends Component {
  render() {
    return (
      <div>
        {this.props.renderFbProp &&
          <FacebookProvider appId="">
            <Like href="https://www.facebook.com/Trecapp-415056679268737/" layout="button_count" action="recommend" share />
          </FacebookProvider>
        }
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(FacebookAuth);