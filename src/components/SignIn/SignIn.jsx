import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import compose from 'recompose/compose';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { SignUpLink } from '../SignUp/SignUp';
import { PasswordForgetLink } from '../PasswordForget/PasswordForget';
import { auth } from '../../firebase';
import * as routes from '../../constants/routes';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

const SignInPage = ({ history }) =>
  <div className="sign-form">
    <Paper className="sign-paper" elevation={1}>
      <div className="sign-title">Sign in</div>
      <SignInForm history={history} />
      <PasswordForgetLink />
      <SignUpLink />
    </Paper>
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  showPassword: false
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

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

  changeInputType = () => {
    let temp = this.state.showPassword;

    this.setState({
      showPassword: !temp
    });
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
          value={email}
          placeholder="Email Address"
          onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
        />
        <div className="password-input-container">
          <TextField
            id="outlined-password-input"
            label="Password"
            className="sign-input"
            type={this.state.showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="password"
            margin="normal"
            value={password}
            placeholder="Password"
            onChange={event => this.setState(updateByPropertyName('password', event.target.value))}
          />
          {
            this.state.showPassword ?
              <IconButton onClick={this.changeInputType} className="show-password-btn" aria-label="visibility">
                <VisibilityOff />
              </IconButton>
              :
              <IconButton onClick={this.changeInputType} className="show-password-btn" aria-label="visibility">
                <Visibility />
              </IconButton>
          }
        </div>

        <Button variant="contained" color="primary" disabled={isInvalid} type="submit" className="sign-btn">
          SIGN IN
        </Button>

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
