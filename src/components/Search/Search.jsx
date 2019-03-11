import React, { Component } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import TuneIcon from '@material-ui/icons/Tune';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  root: {
    padding: '6px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 8px)',
    marginBottom: 14,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
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
    this.state = {
      value: '',
      searchResults: []
    };
  }

  /**
   * Input changed
   */
  handleInputChanged = (e) => {
    this.setState({
      value: e.target.value
    });
  }

  handleSearch = () => {
    console.log('search', this.state.value);
  }

  handleToggleTune = () => {
    console.log('tune');
  }

  render() {
    const { classes, languageObjectProp } = this.props;
    const { searchResults, value } = this.state;
    const searchButtonAvailable = value.length ? false : true;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>
          <Grid item className="grid-component" xs={12}>
            <Paper className={classes.root} elevation={1}>
              <IconButton 
                className={classes.iconButton} 
                aria-label="Tune"
                onClick={this.handleToggleTune}
              >
                <TuneIcon />
              </IconButton>
              <InputBase
                className={classes.input}
                placeholder={languageObjectProp.data.Search.title}
                onChange={(e) => { this.handleInputChanged(e) }}
                value={value}
              />
              <IconButton
                className={classes.iconButton}
                aria-label="Search"
                onClick={this.handleSearch}
                disabled={searchButtonAvailable}
              >
                <SearchIcon />
              </IconButton>
              <Divider className={classes.divider} />
              <IconButton className={classes.iconButton} aria-label="Directions">
                <ClearIcon />
              </IconButton>
            </Paper>

            <div>
              {searchResults.length === 0 ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const EmptyList = (props) =>
  <div className="empty-container">
    {props.languageObjectProp.data.emptyList}
  </div>

const authCondition = (authUser) => !!authUser;

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(Search);