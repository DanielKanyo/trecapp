import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';

import { auth, db } from '../../firebase';
import * as routes from '../../constants/routes';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const SignUpPage = ({ history }) =>
  <div className="sign-form">
    <Paper className="sign-paper" elevation={1}>
      <div className="sign-title">Sign up</div>
      <SignUpForm history={history} />
    </Paper>
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
    } = this.props;

    const language = 'eng';
    const currency = 'USD';
    const profilePicUrl = '';

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.user.uid, username, email, language, currency, profilePicUrl)
          .then(() => {
            // this.setState(() => ({ ...INITIAL_STATE }));

            history.push(routes.WALL);
          })
          .catch(error => {
            this.setState(updateByPropertyName('error', error));
          });

      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      username === '' ||
      email === '';

    return (
      <form onSubmit={this.onSubmit} className="sign-up-form">
        <TextField
          id="sign-up-username"
          label={"Full name"}
          className="password-forget-input"
          value={username}
          onChange={event => this.setState(updateByPropertyName('username', event.target.value))}
          type="text"
          placeholder="Your name..."
        />
        <TextField
          id="sign-up-email"
          label={"Email address"}
          className="password-forget-input"
          value={email}
          onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
          type="text"
          placeholder="Your e-mail address..."
        />
        <TextField
          id="sign-up-password1"
          label={"Password"}
          className="password-forget-input"
          value={passwordOne}
          onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
          type="password"
          placeholder="Password..."
        />
        <TextField
          id="sign-up-password2"
          label={"Password"}
          className="password-forget-input"
          value={passwordTwo}
          onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm password..."
        />
        {/* <input
          value={username}
          onChange={event => this.setState(updateByPropertyName('username', event.target.value))}
          type="text"
          placeholder="Full Name"
        /> */}
        {/* <input
          value={email}
          onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        /> */}
        {/* <input
          value={passwordOne}
          onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
          type="password"
          placeholder="Password"
        /> */}
        {/* <input
          value={passwordTwo}
          onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm Password"
        /> */}
        {/* <button disabled={isInvalid} type="submit">
          Sign Up
        </button> */}
        <Button disabled={isInvalid} color="primary" variant="contained" type="submit" className="reset-passwd-btn last-reset-btn">
          Sign Up
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () =>
  <div className="sign-up-link-container">
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </div>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};