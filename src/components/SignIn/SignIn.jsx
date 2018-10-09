import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import compose from 'recompose/compose';

import { SignUpLink } from '../SignUp/SignUp';
import { PasswordForgetLink } from '../PasswordForget/PasswordForget';
import { auth } from '../../firebase';
import * as routes from '../../constants/routes';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({});

const SignInPage = ({ history }) =>
  <div className="sign-form">
    <div className="outer">
      <div className="middle">
        <div className="inner">

          <Paper className="sign-paper" elevation={1}>
            <div>SignIn</div>
            <SignInForm history={history} />
            <PasswordForgetLink />
            <SignUpLink />

          </Paper>
        </div>
      </div>
    </div>
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    console.log(this.props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.WALL);
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="outlined-email-input"
          label="Email"
          className="sign-input"
          type="email"
          name="email"
          autoComplete="email"
          margin="normal"
          variant="outlined"
          value={email}
          placeholder="Email Address"
          onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          className="sign-input"
          type="password"
          name="password"
          autoComplete="password"
          margin="normal"
          variant="outlined"
          value={password}
          placeholder="Password"
          onChange={event => this.setState(updateByPropertyName('password', event.target.value))}
        />

        <button disabled={isInvalid} type="submit">
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

SignInPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withRouter, withStyles(styles))(SignInPage);

export {
  SignInForm,
};
