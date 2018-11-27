import React, { Component } from 'react';

import { db } from '../../firebase';
import * as ROLES from '../../constants/roles';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Security from '@material-ui/icons/Security';
import LinearProgress from '@material-ui/core/LinearProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const styles = theme => ({
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  userTable: {
    width: '100%',
    textAlign: 'left'
  },
  button: {
    margin: 0,
  },
});

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      users: [],
    };
  }

  componentDidMount() {
    this.mounted = true;

    if (this.mounted) {
      this.setState({ loading: true });

      db.users().once('value')
        .then(snapshot => {
          const usersObject = snapshot.val();
          const users = Object.keys(usersObject).map(key => ({
            ...usersObject[key],
            id: key,
          }));

          if (this.mounted) {
            this.setState(state => ({
              users,
              loading: false,
            }));
          }
        })
        .catch(error => {
          this.setState({ error: true, loading: false });
        });

      db.users().on('child_removed', snapshot => {
        this.setState(state => ({
          users: state.users.filter(user => user.id !== snapshot.key),
        }));
      });
    }
  }

  onRemove = userId => {
    db.user(userId).remove();
  };

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { classes } = this.props;
    const { users, loading, error } = this.state;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>
          <Grid item className="grid-component" xs={12}>
            <Paper className={classes.paper + ' paper-title paper-title-profile'}>
              <div className="paper-title-icon">
                <Security />
              </div>
              <div className="paper-title-text">
                Admin
                </div>
            </Paper>

            {loading && <LinearProgress />}
            {error && <div>Something went wrong ...</div>}

            {!loading ? <UserList props={this.props} users={users} onRemove={this.onRemove} /> : ''}

          </Grid>
        </Grid>
      </div>
    );
  }
}

const UserList = ({ users, onRemove, props }) => {
  const { classes } = props;

  return (
    <ExpansionPanel className="expansion-panel">
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>Users List</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <table className={classes.userTable + ' users-table'}>
          <thead>
            <tr>
              <td>ID</td>
              <td>E-Mail</td>
              <td>Username</td>
              <td>Roles</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{(user.roles || []).join('')}</td>
                <td>
                  <IconButton
                    onClick={() => onRemove(user.id)}
                    className={classes.button}
                    aria-label="delete"
                  >
                    <HighlightOffIcon className="delete-item-btn" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
};


AdminPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const authCondition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(withAuthorization(authCondition), withStyles(styles))(AdminPage);