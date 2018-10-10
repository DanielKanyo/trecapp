import React, { Component } from 'react';
import '../App/index.css';
// import { auth, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';

const styles = theme => ({
  textField: {
    width: '100%',
  },
});

class ShoppingList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product: ''
    }
  }

  componentDidMount() { }

  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;
    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component" xs={12}>
            <Paper className={classes.paper + ' paper-title paper-title-shoppinglist'}>
              <div className="paper-title-icon">
                <PlaylistAdd />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.menuItems[4]}
              </div>
            </Paper>

          </Grid>

        </Grid>

      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

ShoppingList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(ShoppingList);