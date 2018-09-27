import React, { Component } from 'react';
import '../App/index.css';
import { auth } from '../../firebase';
import compose from 'recompose/compose';
import withAuthorization from '../Session/withAuthorization';

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

import Notifications, { notify } from 'react-notify-toast';

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
  slider: {
    width: 300,
  },
  button: {
    marginBottom: 6,
    width: 100,
    color: 'white',
    marginLeft: 'auto'
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#F55300',
      main: '#F55300',
      dark: '#F55300',
      contrastText: '#fff',
    }
  }
});

class NewRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      shortDes: '',
      longDes: '',
      sliderValue: 1,
      prepTime: '02:00',
      publicChecked: false,
      category: '',
      loggedInUserId: ''
    };
    this.handleSaveRecipe = this.handleSaveRecipe.bind(this);
  }

  componentDidMount() {
    let loggedInUserId = auth.getCurrentUserId();
    this.setState({ loggedInUserId: loggedInUserId });
  }

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChangeSlider = (event, sliderValue) => {
    this.setState({ sliderValue });
  };

  handleInputChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  handleSaveRecipe = () => {
    let data = this.state;
    data.creationTime = new Date().getTime();

    if (data.title === '' || data.shortDes === '' || data.longDes === '' || data.prepTime === '' || data.category === '') {
      this.toastr('Warning! Fill the required fields...', '#ffc107');
    } else {
      this.toastr('Recipe saved!', '#4BB543');
      
      // this.props.saveRecipeProps(data);
    }
  }

  handleChangeCategory = (event) => {
    this.setState({ category: event.target.value });
  }

  /** sucess toast */
  toastr(msg, bgColor) {
    let style = { background: bgColor, text: "#FFFFFF" };

    notify.show(msg, 'custom', 4000, style);
  }

  render() {
    const { classes } = this.props;
    const { sliderValue } = this.state;

    return (
      <div>
        <Paper className={classes.paper + ' paper-title paper-title-newrecipe'}>
          <div className="paper-title-icon">
            <AddCircle />
          </div>
          <div className="paper-title-text">
            New Recipe
          </div>
        </Paper>

        <Paper className={classes.paper + ' paper-recipe-new'}>
          <MuiThemeProvider theme={theme}>
            <TextField
              id="outlined-name"
              label="* Title"
              onChange={this.handleInputChange('title')}
              className={classes.textField}
              margin="normal"
              placeholder="Recipe title..."
              variant="outlined"
            />
            <TextField
              id="outlined-name"
              label="* Short description"
              onChange={this.handleInputChange('shortDes')}
              className={classes.textField}
              placeholder="Just a few sentences..."
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-multiline-static"
              label="* Long description"
              multiline
              rows="5"
              placeholder="Preparation method..."
              onChange={this.handleInputChange('longDes')}
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <div className="slider-and-timepicker-container">
              <div className="slider-container">
                <Typography id="slider-label">Difficulty</Typography>
                <Slider className="slider" value={sliderValue} min={0} max={5} step={1} onChange={this.handleChangeSlider} />
              </div>
              <div className="space-between"></div>
              <div className="timepicker-container">
                <TextField
                  id="new-recipe-time"
                  label="Preparation time"
                  type="time"
                  defaultValue="02:00"
                  onChange={this.handleInputChange('prepTime')}
                  className={classes.timePicker}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </div>
            </div>
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Category</InputLabel>
                <Select
                  value={this.state.category}
                  onChange={this.handleChangeCategory}
                  inputProps={{
                    name: 'category',
                    id: 'category-dropdown',
                  }}
                >
                  <MenuItem value=''><em>None</em></MenuItem>
                  <MenuItem value='Breakfast'>Breakfast</MenuItem>
                  <MenuItem value='Lunch'>Lunch</MenuItem>
                  <MenuItem value='Beverages'>Beverages</MenuItem>
                  <MenuItem value='Appetizers'>Appetizers</MenuItem>
                  <MenuItem value='Soups'>Soups</MenuItem>
                  <MenuItem value='Salads'>Salads</MenuItem>
                  <MenuItem value='Beef'>Beef</MenuItem>
                  <MenuItem value='Poultry'>Poultry</MenuItem>
                  <MenuItem value='Pork'>Pork</MenuItem>
                  <MenuItem value='Seafood'>Seafood</MenuItem>
                  <MenuItem value='Vegetarian'>Vegetarian</MenuItem>
                  <MenuItem value='Vegetables'>Vegetables</MenuItem>
                  <MenuItem value='Desserts'>Desserts</MenuItem>
                  <MenuItem value='Canning / Freezing'>Canning / Freezing</MenuItem>
                  <MenuItem value='Breads'>Breads</MenuItem>
                  <MenuItem value='Holidays'>Holidays</MenuItem>
                  <MenuItem value='Entertaining'>Entertaining</MenuItem>
                  <MenuItem value='Other'>Other</MenuItem>
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
                label="Public"
              />
              <Button
                variant="contained"
                size="small"
                className={classes.button + ' recipe-control-btn save-recipe-btn'}
                onClick={this.handleSaveRecipe}
              >
                <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Save
              </Button>
            </div>
          </MuiThemeProvider>
        </Paper>
        <Notifications options={{ zIndex: 5000 }} />
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

NewRecipe.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(withAuthorization(authCondition), withStyles(styles))(NewRecipe);