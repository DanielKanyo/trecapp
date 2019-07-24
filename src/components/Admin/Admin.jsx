import React, { Component } from 'react';

import { db } from '../../firebase';
import * as ROLES from '../../constants/roles';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Security from '@material-ui/icons/Security';
import LinearProgress from '@material-ui/core/LinearProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MyPagination from '../Pagination/MyPagination';

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
    display: 'block',
    paddingBottom: 0
  },
  progressLine: {
    borderRadius: '4px'
  }
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#3f51b5',
      main: '#3f51b5',
      dark: '#3f51b5',
      contrastText: '#fff',
    }
  }
});

const constants = {
  DEFAULT_NUMBER_OF_USERS: 10
}

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      users: [],
      usersTotal: [],
      bugs: [],
      pageId: 1,
      numberOfPages: null,
    };
  }

  componentDidMount() {
    this.mounted = true;
    let previousUsers = this.state.users;
    let previousBugs = this.state.bugs;
    let lengthCounter = 0;

    this.setState({ loading: true });

    db.users().once('value')
      .then(users => {
        if (this.mounted) {
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
              lengthCounter++;
            }
          }

          previousUsers.sort((a, b) => (this.normalizeString(a.props.dataProp.username) > this.normalizeString(b.props.dataProp.username)) ? 1 : -1);

          let counter = 0;
          let usersPerPage = [];
          let usersTotal = [];

          for (let i = 0; i < previousUsers.length; i++) {
            usersPerPage.push(previousUsers[i]);
            counter++;

            if (counter === constants.DEFAULT_NUMBER_OF_USERS) {
              usersTotal.push(usersPerPage);
              usersPerPage = [];
              counter = 0;
            }
          }

          if (usersPerPage.length > 0) {
            usersTotal.push(usersPerPage);
          }

          let numberOfPages = Math.ceil(lengthCounter / constants.DEFAULT_NUMBER_OF_USERS);

          db.getBugReports().once('value').then(bugsRes => {
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
                numberOfPages,
                usersTotal,
                bugs: previousBugs,
                loading: false,
              });
            }
          });
        }
      })
      .catch(error => {
        this.setState({ error: true, loading: false });
      });
  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Normalize string
   */
  normalizeString = (string) => {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  /**
  * Pagination button clicked
  */
  pagBtnClicked = (pageId) => {
    this.setState({
      pageId
    });
  }

  render() {
    const { classes, languageObjectProp } = this.props;
    const { users, bugs, loading, error, usersTotal, numberOfPages, pageId } = this.state;

    let usersPanelDisabled = users.length ? false : true;
    let bugsPanelDisabled = bugs.length ? false : true;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={2}>
          <Grid item className="grid-component admin-grid-component" xs={12}>
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
                <ExpansionPanel className="expansion-panel" disabled={usersPanelDisabled}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{languageObjectProp.data.Admin.usersListTitle} ({users.length})</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.panelDetails + ' panel-details-container'}>
                    {usersTotal[pageId - 1] && usersTotal[pageId - 1].map(user => user)}
                    <div>
                      <MuiThemeProvider theme={theme}>
                        {
                          !loading && numberOfPages > 1 &&
                          <MyPagination
                            pagBtnClickedProp={this.pagBtnClicked}
                            totalProp={numberOfPages}
                            activePageProp={pageId}
                          />
                        }
                      </MuiThemeProvider>
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel className="expansion-panel" disabled={bugsPanelDisabled}>
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

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(AdminPage);