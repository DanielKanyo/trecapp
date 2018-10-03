import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Face from '@material-ui/icons/Face';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import SaveIcon from '@material-ui/icons/Save';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Notifications, { notify } from 'react-notify-toast';

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
  formControl: {
    margin: '8px 0px',
    minWidth: 120,
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    marginBottom: 6,
    marginTop: 4,
    width: 100,
    color: 'white',
    marginLeft: 'auto'
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class AccountDetails extends Component {

  /**
   * 
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {};
    
    this.setLanguageProp = this.props.setLanguageProp.bind(this);
    this.handleSaveNewAccountDataProp = this.props.handleSaveNewAccountDataProp.bind(this);
  }

  /**
   * Change input value
   * 
   * @param {string} name
   * @param {Object} event
   */
  handleInputChange = name => event => {
    this.props.handleInputChangeProp(name, event);
  }

  /**
   * Change dropdown value
   * 
   * @param {Object} event
   */
  handleChangeLanguage = event => {
    this.props.handleChangeLanguageProp(event);
  }

  /**
   * Save new data
   * 
   * @param {Object} event
   */
  handleSaveAccount = (event) => {
    if (this.props.accountNameProp === '' || this.props.accountEmailProp === '' || this.props.accountLanguageProp === '') {
      this.toastr('Warning! Fill the required fields...', '#ffc107');
    } else {
      this.props.handleSaveNewAccountDataProp(this.props.accountNameProp, this.props.accountLanguageProp);
      this.props.setLanguageProp(this.props.accountLanguageProp);
      this.toastr('Recipe saved!', '#4BB543');
    }
  }

  /**
   * Show notification
   * 
   * @param {string} msg 
   * @param {string} bgColor 
   */
  toastr(msg, bgColor) {
    let style = { background: bgColor, text: "#FFFFFF" };

    notify.show(msg, 'custom', 4000, style);
  }

  /**
   * Render function
   */
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Paper className={classes.paper + ' paper-title paper-title-profile'}>
          <div className="paper-title-icon">
            <Face />
          </div>
          <div className="paper-title-text">
            Account Details
          </div>
        </Paper>
        <Paper>
          <div className="account-details-container">
            <TextField
              id="account-name"
              label="Name"
              onChange={this.handleInputChange('accountName')}
              className={classes.textField}
              value={this.props.accountNameProp}
              margin="normal"
              placeholder="Your name..."
              variant="outlined"
            />
            <TextField
              id="account-email"
              label="E-mail"
              onChange={this.handleInputChange('email')}
              className={classes.textField}
              value={this.props.accountEmailProp}
              margin="normal"
              variant="outlined"
              disabled
            />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="account-langu-dropdown-label">Language</InputLabel>
              <Select
                value={this.props.accountLanguageProp ? this.props.accountLanguageProp : ''}
                onChange={this.handleChangeLanguage}
                inputProps={{
                  name: 'accountLanguage',
                  id: 'language-dropdown',
                }}
              >
                <MenuItem value={'eng'}>English</MenuItem>
                <MenuItem value={'hun'}>Hungarian</MenuItem>
                {/* <MenuItem value={30}>German</MenuItem> */}
              </Select>
            </FormControl>
            <div className="account-save-container">
              <Button
                variant="contained"
                size="small"
                className={classes.button + ' control-btn save-btn'}
                onClick={this.handleSaveAccount}
              >
                <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Save
              </Button>
            </div>
          </div>
        </Paper>

        <Notifications options={{ zIndex: 5000 }} />
      </div>
    );
  }
}

AccountDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountDetails);