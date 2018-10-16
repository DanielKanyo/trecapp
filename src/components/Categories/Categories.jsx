import React, { Component } from 'react';
import '../App/index.css';
// import { auth, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import DashboardIcon from '@material-ui/icons/Dashboard';

const styles = theme => ({});

class Categories extends Component {

  /**
    * Constructor
    * 
    * @param {Object} props 
    */
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;
  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;
    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component" xs={12}>
            <Paper className={classes.paper + ' paper-title paper-title-categories'}>
              <div className="paper-title-icon">
                <DashboardIcon />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.menuItems[3]}
              </div>
            </Paper>
          </Grid>

        </Grid>
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(Categories);