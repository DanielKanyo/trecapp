import React from 'react';
import { auth } from '../../firebase';

import AuthUserContext from './AuthUserContext';
import { withFirebase } from './index';
import { language } from '../../constants/languages/email-verification';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isSent: true,
        selectedLanguage: 'en',
      };
    }

    onSendEmailVerification = () => {
      auth
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    componentDidMount = () => {
      let userLang = navigator.language || navigator.userLanguage;

      if (userLang === 'hu' || userLang.includes('hu')) {
        this.setState({
          selectedLanguage: 'hu'
        });
      }

      this.timer = setInterval(
        () => this.setState(prevState => ({ isSent: false })),
        15000,
      );
    }

    /**
     * Sets 'mounted' property to false to ignore warning 
     */
    componentWillUnmount() {
      clearInterval(this.timer);
    }

    render() {
      let languageData = language[this.state.selectedLanguage];

      return (
        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <div className="ComponentContent">
                <div className="email-verification-sent-container">
                  <div className="email-verification-sent-paper">
                    <div className="email-verification-sent-title">
                      {languageData.title}
                    </div>
                    <div className="email-verification-sent-text">
                      {languageData.description}
                    </div>
                    <div className="email-verification-sent-refresh">
                      {languageData.afterClick}
                    </div>
                    <div className="email-verification-not-sent">
                      {languageData.notSent}
                    </div>
                    <div className="email-verification-btn">
                      <button
                        type="button"
                        onClick={this.onSendEmailVerification}
                        disabled={this.state.isSent}
                      >
                        {languageData.resend}
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
