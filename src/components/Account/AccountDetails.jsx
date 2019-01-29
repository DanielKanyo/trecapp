import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import SaveIcon from '@material-ui/icons/Save';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { isoLanguages } from '../../constants/languages/iso-639';

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
    marginBottom: 2,
    marginTop: 4,
    width: 110,
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
    this.state = {
      languages: []
    };
  }

  componentDidMount() {
    this.mounted = true;

    let previousLanguages = this.state.languages;

    if (this.mounted) {
      for (let key in isoLanguages) {
        let nativeName = isoLanguages[key].nativeName;
        let name = isoLanguages[key].name;

        previousLanguages.push(
          <MenuItem key={key} value={isoLanguages[key]['639-1']}>{nativeName} ({name})</MenuItem>
        )
      }

      this.setState({
        languages: previousLanguages
      });

    }

  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
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
   * Change dropdown value
   * 
   * @param {Object} event
   */
  handleChangeFilterBy = event => {
    this.props.handleChangeFilterByProp(event);
  }

  /**
   * Save new data
   * 
   * @param {Object} event
   */
  handleSaveAccount = (event) => {
    if (this.props.dataProp.accountName === '' || this.props.dataProp.accountEmail === '' || this.props.dataProp.accountLanguage === '') {
      // TODO
      this.toastr('Warning! Fill the required fields...', '#ffc107');
    } else {
      this.props.handleSaveNewAccountDataProp(this.props.dataProp.accountName,
        this.props.dataProp.accountLanguage,
        this.props.dataProp.accountAbout,
        this.props.dataProp.accountFilterRecipes
      );
      this.props.setLanguageProp(this.props.dataProp.accountLanguage);
    }
  }

  /**
   * Render function
   */
  render() {
    const { classes, languageObjectProp } = this.props;

    return (
      <div>
        <Paper>
          <div className="account-details-container">
            <TextField
              id="account-name"
              label={languageObjectProp.data.Account.name}
              onChange={this.handleInputChange('accountName')}
              className={classes.textField}
              value={this.props.dataProp.accountName}
              margin="normal"
              placeholder="Your name..."
            />
            <TextField
              id="account-email"
              label="E-mail"
              onChange={this.handleInputChange('email')}
              className={classes.textField}
              value={this.props.dataProp.accountEmail}
              margin="normal"
              disabled
            />
            <div className="language-container">
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="account-langu-dropdown-label">{languageObjectProp.data.Account.language}</InputLabel>
                <Select
                  value={this.props.dataProp.accountLanguage ? this.props.dataProp.accountLanguage : ''}
                  onChange={this.handleChangeLanguage}
                  inputProps={{
                    name: 'accountLanguage',
                    id: 'language-dropdown',
                  }}
                >
                  <MenuItem value={'eng'}>English</MenuItem>
                  <MenuItem value={'hun'}>Magyar</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="account-currency-dropdown-label">{languageObjectProp.data.Account.filteringByLanguage}</InputLabel>
                <Select
                  className='language-selector'
                  value={this.props.dataProp.accountFilterRecipes ? this.props.dataProp.accountFilterRecipes : 'all'}
                  onChange={this.handleChangeFilterBy}
                  inputProps={{
                    name: 'accountFilterRecipes',
                    id: 'filter-dropdown',
                  }}
                >
                  <MenuItem value={'all'}>{languageObjectProp.data.Account.showAllRecipes}</MenuItem>
                  {this.state.languages.map(item => {
                    return item;
                  })}
                </Select>
              </FormControl>
            </div>
            <TextField
              id="account-about"
              label={languageObjectProp.data.Account.about}
              multiline
              rows="5"
              onChange={this.handleInputChange('accountAbout')}
              className={classes.textField}
              value={this.props.dataProp.accountAbout}
              margin="normal"
              placeholder={languageObjectProp.data.Account.aboutYouPlaceholder}
            />

            <div className="account-save-container">
              <Button
                variant="contained"
                size="small"
                className={classes.button + ' control-btn save-btn'}
                onClick={this.handleSaveAccount}
              >
                <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                {languageObjectProp.data.Account.save}
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

AccountDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountDetails);