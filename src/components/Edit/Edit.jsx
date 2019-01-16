import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import { db } from '../../firebase';
import { isoCurrencies } from '../../constants/iso-4217';

const styles = theme => ({
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
  textField: {
    width: '100%',
    marginTop: 12,
    marginBottom: 6
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
      currencies: [],
      title: '',
      story: '',
      dose: '',
      cost: '',
      currency: ''
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

          let previousCurrencies = this.state.currencies;

          for (let key in isoCurrencies) {
            let code = isoCurrencies[key].code;

            previousCurrencies.push(
              <MenuItem key={key} value={code}>{code}</MenuItem>
            )
          }

          this.setState({
            currencies: previousCurrencies,
            title: recipeData.title,
            story: recipeData.story,
            dose: recipeData.dose,
            cost: recipeData.cost,
            currency: recipeData.currency
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

  handleInputChange = name => event => {
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
                    onChange={this.handleInputChange('title')}
                    margin="normal"
                  />

                  <TextField
                    id="standard-story"
                    label={languageObjectProp.data.myRecipes.newRecipe.form.story}
                    className={classes.textField}
                    value={this.state.story}
                    onChange={this.handleInputChange('story')}
                    margin="normal"
                    multiline
                    rows="4"
                  />


                  <div className="dose-cost-container">
                    <TextField
                      id="textfield-recipe-dose"
                      label={languageObjectProp.data.myRecipes.newRecipe.form.dose}
                      onChange={this.handleInputChange('dose')}
                      className={classes.textField}
                      placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.dosePlaceholder}
                      value={this.state.dose}
                      margin="normal"
                      type="number"
                    />
                    <div className="space-between"></div>
                    <div className="cost-and-currency-container">
                      <div>
                        <TextField
                          id="textfield-recipe-cost"
                          label={`${languageObjectProp.data.myRecipes.newRecipe.form.cost}`}
                          onChange={this.handleInputChange('cost')}
                          className={classes.textField}
                          placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.costPlaceholder}
                          value={this.state.cost}
                          margin="normal"
                          type="number"
                        />
                      </div>
                      <div className="space-between-cost-and-currency"></div>
                      <div>
                        <FormControl className={classes.formControl + ' currency-dropdown-container'}>
                          <InputLabel htmlFor="account-currency-dropdown-label">{languageObjectProp.data.Account.currency}</InputLabel>
                          <Select
                            value={this.state.currency ? this.state.currency : 'USD'}
                            onChange={this.handleChangeCurrency}
                            inputProps={{
                              name: 'currency',
                              id: 'currency-dropdown',
                            }}
                          >
                            {this.state.currencies.map(item => {
                              return item;
                            })}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>

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