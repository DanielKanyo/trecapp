import React, { Component } from 'react';

import { auth } from '../../firebase';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    let languageObjectProp;

    if (this.props.languageObjectProp) {
      languageObjectProp = this.props.languageObjectProp;
    }

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          name="passwordOne"
          id="forget-page-password-1"
          label={languageObjectProp ? languageObjectProp.data.PasswordResetAndForget.newPassword : "New password"}
          className="password-forget-input"
          value={passwordOne}
          onChange={this.onChange}
          margin="normal"
          type="password"
          placeholder={languageObjectProp ? languageObjectProp.data.PasswordResetAndForget.newPasswordPlaceholder : "New password..."}
        />
        <TextField
          name="passwordTwo"
          id="forget-page-password-2"
          label={languageObjectProp ? languageObjectProp.data.PasswordResetAndForget.newPasswordConfirm : "New password confirm"}
          className="password-forget-input"
          value={passwordTwo}
          onChange={this.onChange}
          margin="normal"
          type="password"
          placeholder={languageObjectProp ? languageObjectProp.data.PasswordResetAndForget.newPasswordConfirmPlaceholder : "Confirm new password..."}
        />
        <Button disabled={isInvalid} color="primary" variant="contained" type="submit" className="reset-passwd-btn last-reset-btn">
          {languageObjectProp ? languageObjectProp.data.PasswordResetAndForget.resetBtn : "Reset password"}
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

PasswordChangeForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PasswordChangeForm);