import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import IngredientItem from '../Recipes/IngredientItem';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { db } from '../../firebase';
import { isoCurrencies } from '../../constants/iso-4217';
import { isoLanguages } from '../../constants/languages/iso-639';

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

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
  formControl: {
    marginBottom: 12,
    minWidth: '100%',
  },
  buttonSave: {
    marginBottom: 6,
    width: 110,
    color: 'white',
    marginLeft: 'auto'
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
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
      ingredients: [],
      languages: [],
      title: '',
      story: '',
      dose: '',
      cost: '',
      currency: '',
      ingredient: '',
      longDes: '',
      sliderValue: 1,
      hour: '0',
      minute: '30',
      category: '',
      recipeLanguage: '',
      publicChecked: false,
      loggedInUserId: '',
      imageUrl: ''
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
          let previousLanguages = this.state.languages;

          for (let key in isoCurrencies) {
            let code = isoCurrencies[key].code;

            previousCurrencies.push(
              <MenuItem key={key} value={code}>{code}</MenuItem>
            )
          }

          for (let key in isoLanguages) {
            let nativeName = isoLanguages[key].nativeName;
            let name = isoLanguages[key].name;

            previousLanguages.push(
              <MenuItem key={key} value={isoLanguages[key]['639-1']}>{nativeName} ({name})</MenuItem>
            )
          }

          this.setState({
            currencies: previousCurrencies,
            languages: previousLanguages,
            title: recipeData.title,
            story: recipeData.story,
            dose: recipeData.dose,
            cost: recipeData.cost,
            currency: recipeData.currency,
            ingredients: recipeData.ingredients,
            longDes: recipeData.longDes,
            sliderValue: recipeData.sliderValue,
            hour: recipeData.hour,
            minute: recipeData.minute,
            category: recipeData.category,
            recipeLanguage: recipeData.recipeLanguage,
            publicChecked: recipeData.publicChecked,
            imageUrl: recipeData.imageUrl,
            loggedInUserId,
          });
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

  onSubmitIngredients = (event) => {
    let previousIngredients = this.state.ingredients;
    let ingredient = this.state.ingredient;

    if (ingredient) {
      previousIngredients.push(ingredient);

      this.setState({
        ingredients: previousIngredients,
        ingredient: ''
      });
    } else {
      toast.warn(this.props.languageObjectProp.data.myRecipes.newRecipe.toaster.fillTheInput);
    }

    event.preventDefault();
  }

  /**
   * Delete ingredient item
   */
  handleDeleteIngredient = (index) => {
    let previousIngredients = this.state.ingredients;

    previousIngredients.splice(index, 1);

    this.setState({
      ingredients: previousIngredients
    });
  }

  handleChangeSlider = (event, sliderValue) => {
    this.setState({ sliderValue });
  };

  handleChangeCurrency = event => {
    this.setState({ currency: event.target.value });
  }

  handleChangeCategory = (event) => {
    this.setState({ category: event.target.value });
  }

  handleChangeRecipeLanguage = (event) => {
    this.setState({ recipeLanguage: event.target.value });
  }

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  }

  handleChangeHour = (event) => {
    this.setState({ hour: event.target.value });
  }

  handleChangeMinute = (event) => {
    this.setState({ minute: event.target.value });
  }

  handleUpdateRecipe = () => {
    let data = {
      title: this.state.title,
      story: this.state.story,
      ingredients: this.state.ingredients,
      longDes: this.state.longDes,
      sliderValue: this.state.sliderValue,
      publicChecked: this.state.publicChecked,
      hour: this.state.hour,
      minute: this.state.minute,
      dose: this.state.dose,
      category: this.state.category,
      cost: this.state.cost,
      currency: this.state.currency,
      recipeLanguage: this.state.recipeLanguage
    };

    if (data.title === '' || data.story === '' || data.longDes === '' || data.ingredients.length === 0 || data.dose === '' || data.cost === '' || !data.category) {
      toast.warn(this.props.languageObjectProp.data.myRecipes.toaster.warningFillReq);
    } else {
      if (data.dose < 1 || data.cost < 1) {
        toast.warn(this.props.languageObjectProp.data.myRecipes.toaster.warningSmallerThanOne);
      } else {
        db.updateRecipe(this.state.recipeId, data).then(() => {
          toast.success(this.props.languageObjectProp.data.myRecipes.editRecipe.saveSuccess);
        });
      }
    }
  }

  render() {
    const { classes, languageObjectProp } = this.props;

    return (
      <div className="ComponentContent EditComponent">
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
                    placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.titlePlaceholder}
                  />

                  {this.state.imageUrl ? <div className="recipe-image-on-edit-component" style={{ backgroundImage: `url(${this.state.imageUrl})` }}></div> : '' }
                  
                  <TextField
                    id="standard-story"
                    label={languageObjectProp.data.myRecipes.newRecipe.form.story}
                    className={classes.textField}
                    value={this.state.story}
                    onChange={this.handleInputChange('story')}
                    margin="normal"
                    multiline
                    placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.storyPlaceholder}
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

                  <form onSubmit={this.onSubmitIngredients}>
                    <div className="ingredients-input-and-btn-container">
                      <TextField
                        id="textfield-recipe-ingredients"
                        label={languageObjectProp.data.myRecipes.newRecipe.form.ingredients}
                        onChange={this.handleInputChange('ingredient')}
                        className={classes.textField}
                        placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.ingredientsPlaceholder}
                        value={this.state.ingredient}
                        margin="normal"
                        autoComplete='off'
                      />
                      <div className="ingredients-add-btn-container">
                        <IconButton aria-label="Delete" onClick={this.onSubmitIngredients}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  </form>

                  <div className="ingredients-container">
                    {
                      this.state.ingredients.length ?
                        this.state.ingredients.map((item, index) => {
                          return <IngredientItem key={index} ingredientProp={item} indexProp={index} handleDeleteIngredientProp={this.handleDeleteIngredient} />
                        })
                        : <div className="empty-list">{languageObjectProp.data.myRecipes.newRecipe.form.emptyList}</div>
                    }
                  </div>

                  <TextField
                    id="textfield-recipe-longDes"
                    label={languageObjectProp.data.myRecipes.newRecipe.form.longDes}
                    multiline
                    placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.longDesPlaceholder}
                    onChange={this.handleInputChange('longDes')}
                    className={classes.textField}
                    value={this.state.longDes}
                    margin="normal"
                  />

                  <div className="slider-and-timepicker-container">
                    <div className="slider-container">
                      <Typography id="slider-label">
                        {languageObjectProp.data.myRecipes.newRecipe.form.difficulty}
                      </Typography>
                      <Slider className="slider" value={this.state.sliderValue} min={0} max={2} step={1} onChange={this.handleChangeSlider} />
                    </div>
                    <div className="space-between"></div>
                    <div className="timepicker-container">
                      <div className="hour">
                        <FormControl className={classes.formControl + ' hour-picker'}>
                          <InputLabel className="time-select-label" htmlFor="hour-select">
                            {languageObjectProp.data.myRecipes.newRecipe.form.prepTime}
                          </InputLabel>
                          <Select
                            value={this.state.hour}
                            onChange={this.handleChangeHour}
                            inputProps={{
                              name: 'hour',
                              id: 'hour-select',
                            }}
                          >
                            <MenuItem value='0'>00</MenuItem>
                            <MenuItem value='1'>01</MenuItem>
                            <MenuItem value='2'>02</MenuItem>
                            <MenuItem value='3'>03</MenuItem>
                            <MenuItem value='4'>04</MenuItem>
                            <MenuItem value='5'>05</MenuItem>
                            <MenuItem value='6'>06</MenuItem>
                            <MenuItem value='7'>07</MenuItem>
                            <MenuItem value='8'>08</MenuItem>
                            <MenuItem value='9'>09</MenuItem>
                            <MenuItem value='10'>10</MenuItem>
                            <MenuItem value='11'>11</MenuItem>
                            <MenuItem value='12'>12</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="minute">
                        <FormControl className={classes.formControl + ' minute-picker'}>
                          <InputLabel htmlFor="hour-select"></InputLabel>
                          <Select
                            value={this.state.minute}
                            onChange={this.handleChangeMinute}
                            inputProps={{
                              name: 'minute',
                              id: 'minute-select',
                            }}
                          >
                            <MenuItem value='0'>00</MenuItem>
                            <MenuItem value='5'>05</MenuItem>
                            <MenuItem value='10'>10</MenuItem>
                            <MenuItem value='15'>15</MenuItem>
                            <MenuItem value='20'>20</MenuItem>
                            <MenuItem value='25'>25</MenuItem>
                            <MenuItem value='30'>30</MenuItem>
                            <MenuItem value='35'>35</MenuItem>
                            <MenuItem value='40'>40</MenuItem>
                            <MenuItem value='45'>45</MenuItem>
                            <MenuItem value='50'>50</MenuItem>
                            <MenuItem value='55'>55</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>

                  <div>
                    <FormControl className={classes.formControl + ' category-selector'}>
                      <InputLabel htmlFor="category-dropdown">
                        {languageObjectProp.data.myRecipes.newRecipe.form.category}
                      </InputLabel>
                      <Select
                        value={this.state.category}
                        onChange={this.handleChangeCategory}
                        inputProps={{
                          name: 'category',
                          id: 'category-dropdown',
                        }}
                      >
                        {languageObjectProp.data.myRecipes.newRecipe.categoryItems.map((item, i) => {
                          return <MenuItem key={i} value={i}>{item}</MenuItem>
                        })}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="recipe-language-select-container">
                    <FormControl className={classes.formControl + ' language-picker'}>
                      <InputLabel htmlFor="recipe-language">Recept nyelve</InputLabel>
                      <Select
                        className='language-selector'
                        value={this.state.recipeLanguage}
                        onChange={this.handleChangeRecipeLanguage}
                        inputProps={{
                          name: 'recipeLanguage',
                          id: 'language-select',
                        }}
                      >
                        {this.state.languages.map(item => {
                          return item;
                        })}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="recipe-controller-container">
                    <FormControlLabel className="is-recipe-will-be-public-container"
                      control={
                        <Checkbox
                          checked={this.state.publicChecked}
                          onChange={this.handleChangeCheckbox('publicChecked')}
                          value="checked"
                          color="primary"
                        />
                      }
                      label={languageObjectProp.data.myRecipes.newRecipe.form.public}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      className={classes.buttonSave + ' control-btn save-btn'}
                      onClick={this.handleUpdateRecipe}
                    >
                      <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                      {languageObjectProp.data.myRecipes.editRecipe.saveChanges}
                    </Button>
                  </div>

                </Paper>
              </MuiThemeProvider>
            </Grid>

          </Grid>

        </Grid>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          pauseOnHover
        />
      </div>
    )
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Edit);