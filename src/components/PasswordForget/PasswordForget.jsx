import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase';
import * as routes from '../../constants/routes';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({});

const PasswordForgetPage = () =>
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);



    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    let languageObjectProp;

    if (this.props.languageObjectProp) {
      languageObjectProp = this.props.languageObjectProp;
    }

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="forget-page-email"
          label={"E-mail"}
          className="password-forget-input"
          value={this.state.email}
          onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
          margin="normal"
          type="text"
          placeholder={languageObjectProp ? languageObjectProp.data.PasswordResetAndForget.emailPlaceholder : "Your e-mail address..."}
        />
        <Button disabled={isInvalid} color="inherit" variant="contained" type="submit" className="reset-passwd-btn">
          {languageObjectProp ? languageObjectProp.data.PasswordResetAndForget.resetBtn : "Reset password"}
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetLink = () =>
  <div className="forgot-password-container">
    <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </div>

PasswordForgetPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PasswordForgetPage);

export {
  PasswordForgetForm,
  PasswordForgetLink,
};
