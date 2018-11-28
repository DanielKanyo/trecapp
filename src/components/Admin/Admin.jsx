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

import UserListItem from './UserListItem';

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
  button: {
    margin: 0,
  },
  userPaper: {
    width: '100%',
    marginBottom: 10,
  },
  panelDetails: {
    display: 'block'
  },
  progressLine: {
    borderRadius: '4px'
  }
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
    let previousUsers = this.state.users;

    if (this.mounted) {
      this.setState({ loading: true });

      db.users().once('value')
        .then(snapshot => {
          const usersObject = snapshot.val();

          for (var key in usersObject) {
            if (usersObject.hasOwnProperty(key)) {
              previousUsers.push(
                <UserListItem
                  key={key}
                  dataProp={usersObject[key]}
                  languageObjectProp={this.props.languageObjectProp}
                  idProp={key}
                />
              )
            }
          }

          if (this.mounted) {
            this.setState({
              users: previousUsers,
              loading: false,
            });
          }

        })
        .catch(error => {
          this.setState({ error: true, loading: false });
        });
    }
  }

  // onRemove = userId => {
  //   db.user(userId).remove();
  // };

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

            {loading && <LinearProgress className={classes.progressLine} />}
            {error && <div>Something went wrong ...</div>}

            {!loading ?
              <ExpansionPanel className="expansion-panel">
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>Users List</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.panelDetails + ' panel-details-container'}>
                  {
                    users.map(user => {
                      return user;
                    })
                  }
                </ExpansionPanelDetails>
              </ExpansionPanel> : ''
            }

          </Grid>
        </Grid>
      </div>
    );
  }
}

AdminPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const authCondition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(withAuthorization(authCondition), withStyles(styles))(AdminPage);