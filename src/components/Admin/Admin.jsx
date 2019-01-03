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
import BugListItem from './BugListItem';

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
      bugs: []
    };
  }

  componentDidMount() {
    this.mounted = true;
    let previousUsers = this.state.users;
    let previousBugs = this.state.bugs;

    if (this.mounted) {
      this.setState({ loading: true });

      db.users().once('value')
        .then(users => {
          const usersObject = users.val();

          for (var usersKey in usersObject) {
            if (usersObject.hasOwnProperty(usersKey)) {
              previousUsers.push(
                <UserListItem
                  key={usersKey}
                  dataProp={usersObject[usersKey]}
                  languageObjectProp={this.props.languageObjectProp}
                  idProp={usersKey}
                />
              )
            }
          }

          db.getBugReports().once('value')
            .then(bugsRes => {
              const bugsObject = bugsRes.val();

              for (var bugsKey in bugsObject) {
                if (bugsObject.hasOwnProperty(bugsKey)) {
                  previousBugs.push(
                    <BugListItem
                      key={bugsKey}
                      dataProp={bugsObject[bugsKey]}
                      userData={usersObject[bugsObject[bugsKey].userId]}
                      languageObjectProp={this.props.languageObjectProp}
                    />
                  )
                }
              }

              if (this.mounted) {
                this.setState({
                  users: previousUsers,
                  bugs: previousBugs,
                  loading: false,
                });
              }
            });
        })
        .catch(error => {
          this.setState({ error: true, loading: false });
        });
    }
  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { classes, languageObjectProp } = this.props;
    const { users, bugs, loading, error } = this.state;

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
              <div>
                <ExpansionPanel className="expansion-panel">
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{languageObjectProp.data.Admin.usersListTitle}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.panelDetails + ' panel-details-container'}>
                    {
                      users.map(user => {
                        return user;
                      })
                    }
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel className="expansion-panel">
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{languageObjectProp.data.Admin.bugReports}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.panelDetails + ' panel-details-container'}>
                    {
                      bugs.map(bug => {
                        return bug;
                      })
                    }
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div> : ''
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