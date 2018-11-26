import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';

import { auth, db } from '../../firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const SignUpPage = ({ history }) => (
  <div className="sign-form">
    <Paper className="sign-paper" elevation={1}>
      <div className="sign-title">Sign up</div>
      <SignUpForm history={history} />
    </Paper>
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    this.mounted = true;

    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = [];

    if (isAdmin) {
      roles.push(ROLES.ADMIN);
    }

    const { history } = this.props;

    const language = 'eng';
    const currency = 'USD';
    const profilePicUrl = '';

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.user.uid, username, email, language, currency, profilePicUrl, roles)
          .then(() => {
            if (this.mounted) {
              this.setState(() => ({ ...INITIAL_STATE }));
            }
            history.push(ROUTES.WALL);
          })
          .catch(error => {
            this.setState({ error });
          });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
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
          name="username"
          id="sign-up-username"
          label={"Full name"}
          className="password-forget-input"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Your name..."
        />
        <TextField
          name="email"
          id="sign-up-email"
          label={"Email address"}
          className="password-forget-input"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Your e-mail address..."
        />
        <TextField
          name="passwordOne"
          id="sign-up-password1"
          label={"Password"}
          className="password-forget-input"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password..."
        />
        <TextField
          name="passwordTwo"
          id="sign-up-password2"
          label={"Password"}
          className="password-forget-input"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm password..."
        />
        <Button disabled={isInvalid} color="primary" variant="contained" type="submit" className="reset-passwd-btn last-reset-btn">
          Sign Up
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <div className="sign-up-link-container">
    Don't have an account?
    {' '}
    <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </div>
);

export default withRouter(SignUpPage);

export { SignUpForm, SignUpLink };