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
import Face from '@material-ui/icons/Face';

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
      loggedInUserId: '',
      accountCurrency: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
    this.setLanguageProp = this.props.setLanguageProp.bind(this);
    this.handleSaveNewAccountData = this.handleSaveNewAccountData.bind(this);
  }

  handleInputChange(name, event) {
    this.setState({ [name]: event.target.value });
  }

  handleChangeLanguage(event) {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeCurrency(event) {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSaveNewAccountData(name, language, currency) {
    this.setState({
      accountName: name,
      accountLanguage: language,
      accountCurrency: currency
    });

    db.updateUserInfo(this.state.loggedInUserId, name, language, currency);
  }

  componentDidMount() {
    let loggedInUserId = auth.getCurrentUserId();

    db.getUserInfo(loggedInUserId).then(snapshot => {
      this.setState(() => ({
        accountName: snapshot.username,
        accountEmail: snapshot.email,
        accountCurrency: snapshot.currency,
        accountLanguage: snapshot.language,
        loggedInUserId: loggedInUserId
      }));
    });
  }

  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <div className="ComponentContent Account">
            <Grid className="main-grid" container spacing={16}>

              <Grid item className="grid-component" xs={12}>

                <Paper className={classes.paper + ' paper-title paper-title-profile'}>
                  <div className="paper-title-icon">
                    <Face />
                  </div>
                  <div className="paper-title-text">
                    Account Details
                  </div>
                </Paper>

                <Grid item className="grid-component" xs={12}>
                  <Grid className="sub-grid" container spacing={16}>

                    <Grid item className="grid-component" xs={6}>
                      <AccountDetails
                        handleInputChangeProp={this.handleInputChange}
                        handleChangeLanguageProp={this.handleChangeLanguage}
                        handleChangeCurrencyProp={this.handleChangeCurrency}
                        setLanguageProp={this.props.setLanguageProp}
                        handleSaveNewAccountDataProp={this.handleSaveNewAccountData}
                        accountNameProp={this.state.accountName}
                        accountEmailProp={this.state.accountEmail}
                        accountLanguageProp={this.state.accountLanguage}
                        accountCurrencyProp={this.state.accountCurrency}
                        languageObjectProp={languageObjectProp}
                      />
                    </Grid>

                    <Grid item className="grid-component" xs={6}>
                      <Paper className={classes.paper}>
                        <PasswordForgetForm />
                        <PasswordChangeForm />
                      </Paper>
                    </Grid>

                  </Grid>
                </Grid>

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