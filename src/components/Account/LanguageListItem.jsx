import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import { isoLanguages } from '../../constants/languages/iso-639';

const styles = theme => ({});

class LanguageListItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checkboxValue: this.props.dataProp.checked
    }
  }

  handleChangeCheckboxValue = (event, lang) => {
    if (event.target.checked) {
      this.props.handleAddLanguageProp(event, lang);
    } else {
      this.props.handleDeleteLanguageProp(lang);
    }
    this.setState({ checkboxValue: event.target.checked });
  }

  render() {
    return (
      <div>
        <div className="language-list-item-container">
          <div>
            <ListItem
              className='language-item'
            >
              <ListItemText primary={this.props.dataProp.nativeName} secondary={this.props.dataProp.name} />
            </ListItem>
          </div>
          <div className="language-list-item-checkbox-container">
            <Checkbox
              checked={this.state.checkboxValue}
              onChange={(e) => {this.handleChangeCheckboxValue(e, isoLanguages[this.props.dataProp.key]['639-1'])}}
              color="primary"
            />
          </div>
        </div>

        <Divider />
      </div>
    )
  }
}

LanguageListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LanguageListItem);