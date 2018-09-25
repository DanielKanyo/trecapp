import React, { Component } from 'react';

import withAuthorization from '../Session/withAuthorization';
import { db } from '../../firebase';
import compose from 'recompose/compose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Public from '@material-ui/icons/Public';
import EventNote from '@material-ui/icons/EventNote';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class RecipesWall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {}
    };
  }

  componentDidMount() {
    db.onceGetUsers().then(snapshot =>
      this.setState(() => ({ users: snapshot.val() }))
    );
  }

  render() {
    const { users } = this.state;
    const { classes } = this.props;

    return (
      <div className="ComponentContent">

        <Grid className="main-grid" container spacing={16}>

          <Grid item xs={6}>

            <Paper className={classes.paper + ' paper-title paper-title-world'}>
              <div className="paper-title-icon">
                <Public />
              </div>
              <div className="paper-title-text">
                Recipes World
              </div>
            </Paper>
            <Paper className={classes.paper + ' paper-recipe'}>
              <div>
                <p>The Recipes World Page is accessible by every signed in user.</p>

                {!!users && <UserList users={users} />}
              </div>
            </Paper>

          </Grid>

          <Grid item xs={6}>

            <Paper className={classes.paper + ' paper-title paper-title-events'}>
              <div className="paper-title-icon">
                <EventNote />
              </div>
              <div className="paper-title-text">
                Events
              </div>
            </Paper>
            <Paper className={classes.paper + ' paper-events'}>
              <p>Events</p>
            </Paper>

          </Grid>

        </Grid>

      </div>
    );
  }
}

const UserList = ({ users }) =>
  <div>
    <h2>List of Usernames of Users</h2>
    <p>(Saved on Sign Up in Firebase Database)</p>

    {Object.keys(users).map(key =>
      <div key={key}>{users[key].username}</div>
    )}
  </div>

const authCondition = (authUser) => !!authUser;

RecipesWall.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(RecipesWall);