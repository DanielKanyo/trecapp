import React from 'react';
import { auth } from '../../firebase';

import AuthUserContext from './AuthUserContext';
import { withFirebase } from './index';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: true };
    }

    onSendEmailVerification = () => {
      auth
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    componentDidMount = () => {
      setTimeout(() => {
        this.setState({ isSent: false });
      }, 10000);
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <div className="ComponentContent">
                <div className="email-verification-sent-container">
                  <div className="email-verification-sent-paper">
                    <div className="email-verification-sent-title">
                      E-mail verification sent!
                    </div>
                    <div className="email-verification-sent-text">
                      <div>
                        The verification link has been sent to your email address!
                      </div>
                      Please check you e-mails (spam folder included) for a confirmation e-mail or send another confirmation e-mail.
                    </div>
                    <div className="email-verification-sent-refresh">
                      After you clicked on the link, refresh this page!
                    </div>
                    <div className="email-verification-btn">
                      <button
                        type="button"
                        onClick={this.onSendEmailVerification}
                        disabled={this.state.isSent}
                      >
                        Resend confirmation E-Mail
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
                <Component {...this.props} />
              )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
