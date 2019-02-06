import React, { Component } from 'react';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  avatar: {
    marginRight: 20
  },
  paper: {
    padding: 10
  },
  chip: {
    fontSize: 11
  }
});

class BugListItem extends Component {

  state = {
    anchorEl: null,
    open: false
  };

  /**
  * Capitalize string
  */
  titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  render() {
    const { classes, dataProp, userData, languageObjectProp } = this.props;

    let year = new Date(dataProp.timestamp).getFullYear();
    let month = languageObjectProp.data.months[new Date(dataProp.timestamp).getMonth()];
    let day = new Date(dataProp.timestamp).getDate();
    let creationTime = `${month} ${day}, ${year}`;

    return (
      <div className="bug-item">
        <Paper className={classes.paper} elevation={2}>
          <div className="bug-header">
            <div>
              <Avatar
                alt={this.titleCase(userData.username)}
                src={userData.profilePicUrl}
                className={classes.avatar}
              />
              <div className="reporter-name">{this.titleCase(userData.username)}</div>
            </div>
          </div>
          <Divider />
          <div className="bug-body">
            {dataProp.text}
          </div>
          <Divider />
          <div className="bug-actions">
            <div className="bug-date">
              <Chip label={creationTime} className={classes.chip} />
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

BugListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(BugListItem);