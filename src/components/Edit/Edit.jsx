import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import { db } from '../../firebase';

const styles = theme => ({
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
  textField: {
    width: '100%',
  },
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#d33061',
      main: '#d33061',
      dark: '#d33061',
      contrastText: '#fff',
    }
  }
});

class Edit extends Component {

  /**
   * Constructor
   * 
   * @param {Object} props 
   */
  constructor(props) {
    super(props);
    this.state = {
      recipeId: this.props.match.params.id,
      title: '',
      story: ''
    };
  }

  componentDidMount = () => {
    this.mounted = true;

    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;


    db.getUserInfo(loggedInUserId).then(resUserInfo => {
      const { recipeId } = this.state;

      db.getRecipeById(recipeId).then(resRecipe => {
        const recipeData = resRecipe.val();

        if (this.mounted) {
          this.setState({
            title: recipeData.title,
            story: recipeData.story
          });
          console.log(recipeData);
        }
      });

    });
  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes, languageObjectProp } = this.props;

    return (
      <div className="ComponentContent">
        <Grid className="main-grid" container spacing={16}>

          <Grid item className="grid-component" xs={12}>
            <Paper className={classes.paper + ' paper-title paper-title-editrecipe'}>
              <div className="paper-title-icon">
                <EditIcon />
              </div>
              <div className="paper-title-text">
                {languageObjectProp.data.myRecipes.editRecipe.title}
              </div>
            </Paper>

            <Grid item className="grid-component" xs={12}>
              <MuiThemeProvider theme={theme}>
                <Paper className="paper-recipe-edit">
                  <TextField
                    id="standard-title"
                    label={languageObjectProp.data.myRecipes.newRecipe.form.title}
                    className={classes.textField}
                    value={this.state.title}
                    onChange={this.handleChange('title')}
                    margin="normal"
                  />

                  <TextField
                    id="standard-story"
                    label={languageObjectProp.data.myRecipes.newRecipe.form.story}
                    className={classes.textField}
                    value={this.state.story}
                    onChange={this.handleChange('story')}
                    margin="normal"
                    multiline
                    rows="4"
                  />
                </Paper>
              </MuiThemeProvider>
            </Grid>

          </Grid>

        </Grid>
      </div>
    )
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Edit);