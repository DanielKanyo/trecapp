import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as ROLES from '../../constants/roles';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import compose from 'recompose/compose';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { SignUpLink } from '../SignUp/SignUp';
import { PasswordForgetLink } from '../PasswordForget/PasswordForget';
import { auth, db } from '../../firebase';
import * as ROUTES from '../../constants/routes';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

const SignInPage = ({ history }) => (
  <div className="sign-form">
    <Paper className="sign-paper" elevation={1}>
      <div className="sign-title">Sign in</div>
      <SignInForm history={history} />
      <PasswordForgetLink />
      <SignUpLink />
    </Paper>
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  showPassword: false,
  profilePicUrl: '',
  isAdmin: false,
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    this.mounted = true;

    const { email, password } = this.state;
    const { history } = this.props;

    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        if (this.mounted) {
          this.setState(() => ({ ...INITIAL_STATE }));
        }
        history.push(ROUTES.WALL);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changeInputType = () => {
    let temp = this.state.showPassword;

    this.setState({
      showPassword: !temp
    });
  }

  /**
   * Sign in with Google
   */
  singInWithGoogle = () => {
    this.mounted = true;

    const { history } = this.props;
    const { isAdmin } = this.state;
    const roles = [];

    if (isAdmin) {
      roles.push(ROLES.ADMIN);
    }

    auth.doSignInWithGoogle()
      .then((authUser) => {
        // Create a user in your own accessible Firebase Database too
        db.user(authUser.uid, authUser.displayName, authUser.email, authUser.photoURL, roles)
          .update({
            username: authUser.displayName,
            email: authUser.email,
            profilePicUrl: authUser.photoURL,
          })
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
  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          name="email"
          id="outlined-email-input"
          label="Email"
          className="sign-input"
          type="email"
          autoComplete="email"
          margin="normal"
          value={email}
          placeholder="Email Address"
          onChange={this.onChange}
        />
        <div className="password-input-container">
          <TextField
            name="password"
            id="outlined-password-input"
            label="Password"
            className="sign-input"
            type={this.state.showPassword ? 'text' : 'password'}
            autoComplete="password"
            margin="normal"
            value={password}
            placeholder="Password"
            onChange={this.onChange}
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
        <Button variant="contained" onClick={this.singInWithGoogle} className="reset-passwd-btn google-btn">
          Google
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

export { SignInForm };
