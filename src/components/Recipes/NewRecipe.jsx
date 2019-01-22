import React, { Component } from 'react';
import '../App/index.css';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import AddCircle from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import Select from '@material-ui/core/Select';
import SaveIcon from '@material-ui/icons/Save';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ClearIcon from '@material-ui/icons/Clear';
import IngredientItem from './IngredientItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

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
  timePicker: {
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
  buttonClear: {
    width: 'auto',
    color: 'white',
    marginLeft: 'auto',
    padding: '7px 8px 7px 12px',
    background: '#F55300'
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#F55300',
      main: '#F55300',
      dark: '#F55300',
      contrastText: '#fff',
    }
  }
});

const INITIAL_STATE = {
  title: '',
  story: '',
  ingredient: '',
  longDes: '',
  difficulty: 1,
  hour: '0',
  minute: '30',
  dose: '',
  cost: '',
  publicChecked: true,
  category: '',
};

class NewRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      languages: this.props.availableLanguagesProp ? this.props.availableLanguagesProp : [],
      recipeLanguage: '',
      currencies: [],
      ingredients: [],
    };
  }

  componentDidMount() {
    this.mounted = true;

    let previousCurrencies = this.state.currencies;

    if (this.mounted) {
      for (let key in isoCurrencies) {
        let code = isoCurrencies[key].code;

        previousCurrencies.push(
          <MenuItem key={key} value={code}>{code}</MenuItem>
        )
      }

      this.setState({
        currencies: previousCurrencies
      });

    }

  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChangeDifficultySlider = (event, difficulty) => {
    this.setState({ difficulty });
  };

  handleInputChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  handleChangeCurrency = event => {
    this.props.handleChangeCurrencyProp(event.target.value);
  }

  handleSaveRecipe = () => {
    let data = {
      title: this.state.title,
      story: this.state.story,
      ingredients: this.state.ingredients,
      longDes: this.state.longDes,
      difficulty: this.state.difficulty,
      publicChecked: this.state.publicChecked,
      hour: this.state.hour,
      minute: this.state.minute,
      dose: this.state.dose,
      category: this.state.category,
      cost: this.state.cost,
      creationTime: new Date().getTime()
    };

    if (data.title === '' || data.story === '' || data.longDes === '' || data.ingredients.length === 0 || data.dose === '' || data.cost === '' || !data.category) {
      toast.warn(this.props.languageObjectProp.data.myRecipes.toaster.warningFillReq);
    } else {
      if (data.dose < 1 || data.cost < 1) {
        toast.warn(this.props.languageObjectProp.data.myRecipes.toaster.warningSmallerThanOne);
      } else {
        this.props.saveRecipeProps(data);

        this.setState(state => ({
          ...INITIAL_STATE,
          ingredients: []
        }));
      }

    }
  }

  handleChangeCategory = (event) => {
    this.setState({ category: event.target.value });
  }

  handleChangeHour = (event) => {
    this.setState({ hour: event.target.value });
  }

  handleChangeMinute = (event) => {
    this.setState({ minute: event.target.value });
  }

  handleChangeRecipeLanguage = (event) => {
    this.props.changeRecipeLanguageProp(event.target.value);

    this.setState({ recipeLanguage: event.target.value });
  }

  /**
   * Clear input fields
   */
  clearForm = () => {
    this.setState({ ...INITIAL_STATE });
  }

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

  render() {
    const { classes, languageObjectProp } = this.props;
    const { difficulty } = this.state;

    return (
      <div>
        <Paper className={classes.paper + ' paper-title paper-title-newrecipe'}>
          <div className="paper-title-icon">
            <AddCircle />
          </div>
          <div className="paper-title-text">
            {languageObjectProp.data.myRecipes.newRecipe.title}
          </div>
          <div className="clear-form-container">
            <Button
              variant="contained"
              size="small"
              aria-label="Delete"
              className={classes.buttonClear + ' btn-clear'}
              onClick={this.clearForm}
            >
              {languageObjectProp.data.myRecipes.newRecipe.clearBtn}
              <ClearIcon className={classes.rightIcon} />
            </Button>
          </div>
        </Paper>

        <Paper className={classes.paper + ' paper-recipe-new'}>
          <MuiThemeProvider theme={theme}>
            <TextField
              id="textfield-recipe-title"
              label={languageObjectProp.data.myRecipes.newRecipe.form.title}
              onChange={this.handleInputChange('title')}
              className={classes.textField}
              value={this.state.title}
              margin="normal"
              placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.titlePlaceholder}
            />
            <TextField
              id="textfield-recipe-story"
              label={languageObjectProp.data.myRecipes.newRecipe.form.story}
              onChange={this.handleInputChange('story')}
              className={classes.textField}
              placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.storyPlaceholder}
              value={this.state.story}
              margin="normal"
              multiline
              rows="6"
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
                      value={this.props.currencyProp ? this.props.currencyProp : 'USD'}
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
              rows="9"
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
                <Slider className="slider" value={difficulty} min={0} max={2} step={1} onChange={this.handleChangeDifficultySlider} />
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
                  value={this.props.recipeLanguageProp}
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
                onClick={this.handleSaveRecipe}
              >
                <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                {languageObjectProp.data.myRecipes.newRecipe.form.save}
              </Button>
            </div>
          </MuiThemeProvider>
        </Paper>
      </div>
    );
  }
}

NewRecipe.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewRecipe);