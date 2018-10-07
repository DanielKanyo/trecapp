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
    width: 110,
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
      story: '',
      ingredients: '',
      longDes: '',
      sliderValue: 1,
      hour: '02',
      minute: '00',
      dose: '',
      publicChecked: false,
      category: ''
    };
    this.handleSaveRecipe = this.handleSaveRecipe.bind(this);
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
      creationTime: new Date().getTime()
    };

    if (data.title === '' || data.story === '' || data.longDes === '' || data.ingredients === '' || data.dose === '' || !data.category) {
      this.toastr('Warning! Fill the required fields...', '#ffc107');
    } else {
      this.toastr('Recipe saved!', '#4BB543');

      this.props.saveRecipeProps(data);

      this.setState({
        title: '',
        story: '',
        longDes: '',
        ingredients: '',
        sliderValue: 1,
        hour: '02',
        minute: '00',
        dose: '',
        publicChecked: false,
        category: ''
      });
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

  toastr(msg, bgColor) {
    let style = { background: bgColor, text: "#FFFFFF" };

    notify.show(msg, 'custom', 4000, style);
  }

  render() {
    const { classes } = this.props;
    const { sliderValue } = this.state;
    const { languageObjectProp } = this.props;

    return (
      <div>
        <Paper className={classes.paper + ' paper-title paper-title-newrecipe'}>
          <div className="paper-title-icon">
            <AddCircle />
          </div>
          <div className="paper-title-text">
            {languageObjectProp.data.myRecipes.newRecipe.title}
          </div>
        </Paper>

        <Paper className={classes.paper + ' paper-recipe-new'}>
          <MuiThemeProvider theme={theme}>
            <TextField
              id="textfield-recipe-title"
              label={'* ' + languageObjectProp.data.myRecipes.newRecipe.form.title}
              onChange={this.handleInputChange('title')}
              className={classes.textField}
              value={this.state.title}
              margin="normal"
              placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.titlePlaceholder}
              variant="outlined"
            />
            <TextField
              id="textfield-recipe-story"
              label={'* ' + languageObjectProp.data.myRecipes.newRecipe.form.story}
              onChange={this.handleInputChange('story')}
              className={classes.textField}
              placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.storyPlaceholder}
              value={this.state.story}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="textfield-recipe-dose"
              label={'* ' + languageObjectProp.data.myRecipes.newRecipe.form.dose}
              onChange={this.handleInputChange('dose')}
              className={classes.textField}
              placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.dosePlaceholder}
              value={this.state.dose}
              margin="normal"
              type="number"
              variant="outlined"
            />
            <TextField
              id="textfield-recipe-ingredients"
              label={'* ' + languageObjectProp.data.myRecipes.newRecipe.form.ingredients}
              onChange={this.handleInputChange('ingredients')}
              className={classes.textField}
              placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.ingredientsPlaceholder}
              value={this.state.ingredients}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="textfield-recipe-longDes"
              label={'* ' + languageObjectProp.data.myRecipes.newRecipe.form.longDes}
              multiline
              rows="5"
              placeholder={languageObjectProp.data.myRecipes.newRecipe.placeholder.longDesPlaceholder}
              onChange={this.handleInputChange('longDes')}
              className={classes.textField}
              value={this.state.longDes}
              margin="normal"
              variant="outlined"
            />
            <div className="slider-and-timepicker-container">
              <div className="slider-container">
                <Typography id="slider-label">
                  {languageObjectProp.data.myRecipes.newRecipe.form.difficulty}
                </Typography>
                <Slider className="slider" value={sliderValue} min={0} max={5} step={1} onChange={this.handleChangeSlider} />
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
                      <MenuItem value='00'>00</MenuItem>
                      <MenuItem value='01'>01</MenuItem>
                      <MenuItem value='02'>02</MenuItem>
                      <MenuItem value='03'>03</MenuItem>
                      <MenuItem value='04'>04</MenuItem>
                      <MenuItem value='05'>05</MenuItem>
                      <MenuItem value='06'>06</MenuItem>
                      <MenuItem value='07'>07</MenuItem>
                      <MenuItem value='08'>08</MenuItem>
                      <MenuItem value='09'>09</MenuItem>
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
                      <MenuItem value='00'>00</MenuItem>
                      <MenuItem value='05'>05</MenuItem>
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
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="category-dropdown">
                  * {languageObjectProp.data.myRecipes.newRecipe.form.category}
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
                className={classes.button + ' control-btn save-btn'}
                onClick={this.handleSaveRecipe}
              >
                <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                {languageObjectProp.data.myRecipes.newRecipe.form.save}
              </Button>
            </div>
          </MuiThemeProvider>
        </Paper>
        <Notifications options={{ zIndex: 5000 }} />
      </div>
    );
  }
}

NewRecipe.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewRecipe);