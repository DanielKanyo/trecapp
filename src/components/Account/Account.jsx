import React, { Component } from 'react';
import AccountDetails from './AccountDetails';

import AuthUserContext from '../Session/AuthUserContext';
import { PasswordForgetForm } from '../PasswordForget/PasswordForget';
import PasswordChangeForm from '../PasswordChange/PasswordChange';
import { auth, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Warning from '@material-ui/icons/Warning';

const styles = theme => ({
  textField: {
    width: '100%',
    marginTop: 12,
    marginBottom: 6
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
});

class AccountPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      accountName: '',
      accountEmail: '',
      accountLanguage: '',
      loggedInUserId: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
    this.setLanguageProp = this.props.setLanguageProp.bind(this);
    this.handleSaveNewAccountData = this.handleSaveNewAccountData.bind(this);
  }

  handleInputChange(name, event) {
    this.setState({ [name]: event.target.value });
  }

  handleChangeLanguage(event) {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSaveNewAccountData(name, language) {
    this.setState({ 
      accountName: name,
      accountLanguage: language 
    });
    
    db.updateUserInfo(this.state.loggedInUserId, name, language);
  }

  componentDidMount() {
    let loggedInUserId = auth.getCurrentUserId();

    db.getUserInfo(loggedInUserId).then(snapshot => {
      this.setState(() => ({
        accountName: snapshot.username,
        accountEmail: snapshot.email,
        accountLanguage: snapshot.language,
        loggedInUserId: loggedInUserId
      }));
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <div className="ComponentContent">
            <Grid className="main-grid" container spacing={16}>

              <Grid item className="grid-component" xs={6}>
                <AccountDetails
                  handleInputChangeProp={this.handleInputChange}
                  handleChangeLanguageProp={this.handleChangeLanguage}
                  setLanguageProp={this.props.setLanguageProp}
                  handleSaveNewAccountDataProp={this.handleSaveNewAccountData}
                  accountNameProp={this.state.accountName}
                  accountEmailProp={this.state.accountEmail}
                  accountLanguageProp={this.state.accountLanguage}
                />
              </Grid>
              <Grid item className="grid-component" xs={6}>
                <Paper className={classes.paper + ' paper-title paper-title-danger'}>
                  <div className="paper-title-icon">
                    <Warning />
                  </div>
                  <div className="paper-title-text">
                    Danger
                  </div>
                </Paper>
                <Paper className={classes.paper}>
                  <PasswordForgetForm />
                  <PasswordChangeForm />
                </Paper>
              </Grid>
            </Grid>
          </div>
        }
      </AuthUserContext.Consumer>
    );
  }
}

const authCondition = (authUser) => !!authUser;

AccountPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(AccountPage);