import React, { Component } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  search: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 16,
    width: 400
  },
  searchInput: {
    padding: '10px 16px',
    borderRadius: 4,
    border: 'none',
    background: '#1092ce',
    color: 'white',
    fontSize: 14,
    outline: 'none'
  },
  button: {
    color: 'white',
    marginRight: 10,
    background: '#1092ce',
    minWidth: 60
  },
  searchButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

class Search extends Component {

	/**
	 * Constructor
	 * 
	 * @param {Object} props 
	 */
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, languageObjectProp } = this.props;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>
          <Grid item className="grid-component" xs={12}>
            <Paper className={classes.paper + ' paper-title paper-title-search'}>
              <div className={classes.search + " search-container"}>
                <input
                  className={classes.searchInput + ' search-input'}
                  type="text"
                  placeholder={languageObjectProp.data.Search.title}
                />
              </div>
              <div className={classes.searchButton}>
                <Button variant="contained" className={classes.button + ' search-button'}>
                  <SearchIcon />
                </Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(Search);