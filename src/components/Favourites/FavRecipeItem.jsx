import React, { Component } from 'react';
// import { auth, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class FavRecipeItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes } = this.props;
    // const { languageObjectProp } = this.props;
    // let data = this.props.dataProp;

    // let year = new Date(data.creationTime).getFullYear();
    // let month = languageObjectProp.data.months[new Date(data.creationTime).getMonth()];
    // let day = new Date(data.creationTime).getDate();
    // let creationTime = `${month} ${day}, ${year}`;

    // let titleCharacters = data.title.split('');

    return (
      <Grid item className="grid-component" xs={6}>
        <Paper className={classes.root} elevation={1}>
          Fav
        </Paper>
      </Grid>
    )
  }
}

const authCondition = (authUser) => !!authUser;

FavRecipeItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(FavRecipeItem);