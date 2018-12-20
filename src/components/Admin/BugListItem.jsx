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

  render() {
    const { classes } = this.props;
    return (
      <div className="bug-item">
        <Paper className={classes.paper} elevation={2}>
          <div className="bug-header">
            <div>
              <Avatar
                alt="Kanyó Dániel"
                src="https://lh4.googleusercontent.com/-Avc-81-4QXE/AAAAAAAAAAI/AAAAAAAAIas/6UqJ-ZXYMsM/photo.jpg"
                className={classes.avatar}
              />
              <div className="reporter-name">Kanyó Dániel</div>
            </div>
          </div>
          <Divider />
          <div className="bug-body">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
          </div>
          <Divider />
          <div className="bug-actions">
            <div className="bug-date">
              <Chip label="December 28, 2018" className={classes.chip} />
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