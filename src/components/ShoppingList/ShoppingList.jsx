import React, { Component } from 'react';
import '../App/index.css';
// import { auth, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import HistoryIcon from '@material-ui/icons/History';

const styles = theme => ({
  textField: {
    width: '100%',
    marginTop: 8
  },
  paper: {
    padding: '8px 16px',
    position: 'relative',
    marginBottom: 14
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#03c457',
      main: '#03c457',
      dark: '#03c457',
      contrastText: '#fff',
    }
  }
});

class ShoppingList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product: ''
    }

    this.addItemToList = this.addItemToList.bind(this);
  }

  componentDidMount() { }

  changeProductValue = name => event => {
    this.setState({ [name]: event.target.value });
  };

  addItemToList() {
    console.log(this.state.product);

    this.setState({
      product: ''
    })
  }

  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;
    return (
      <div className="ComponentContent">
        <MuiThemeProvider theme={theme}>
          <Grid className="main-grid" container spacing={16}>


            <Grid item className="grid-component" xs={6}>
              <Paper className={classes.paper + ' paper-title paper-title-shoppinglist'}>
                <div className="paper-title-icon">
                  <PlaylistAdd />
                </div>
                <div className="paper-title-text">
                  {languageObjectProp.data.menuItems[4]}
                </div>
              </Paper>

              <Paper className={classes.paper}>
                <div className="shoppinglist-input-container">
                  <TextField
                    id="standard-bare"
                    className={classes.textField}
                    placeholder="Product..."
                    value={this.state.product}
                    margin="normal"
                    onChange={this.changeProductValue('product')}
                  />
                </div>
                <IconButton onClick={this.addItemToList} className={classes.button + ' add-item-btn'} aria-label="visibility">
                  <AddIcon />
                </IconButton>
              </Paper>

              <EmptyList />
            </Grid>

            <Grid item className="grid-component" xs={6}>
              <Paper className={classes.paper + ' paper-title paper-title-recent-product'}>
                <div className="paper-title-icon">
                  <HistoryIcon />
                </div>
                <div className="paper-title-text">
                  Recent Products
                </div>
              </Paper>
              
              <EmptyList />
            </Grid>

          </Grid>

        </MuiThemeProvider>
      </div>
    );
  }
}

const EmptyList = () =>
  <div className="empty-container">
    Empty
  </div>

const authCondition = (authUser) => !!authUser;

ShoppingList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(ShoppingList);