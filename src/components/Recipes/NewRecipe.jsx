import React, { Component } from 'react';
import '../App/index.css';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import AddCircle from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import SaveIcon from '@material-ui/icons/Save';

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
      main: '#ff9b68',
    },
  },
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
    let valueToSend = this.state;
    valueToSend.creationTime = new Date().getTime();

    if (valueToSend.title === '' || valueToSend.shortDes === '' || valueToSend.longDes === '' || valueToSend.prepTime === '') {
      this.toastr('Warning! Fill the required fields...', '#ffc107');
    } else {
      this.toastr('Recipe saved!', '#4BB543');
      this.props.saveRecipeProp(valueToSend);
    }
  }

  handleClearForm = () => {
    console.log('Clear');
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
            <Typography id="slider-label">Difficulty level</Typography>
            <Slider className="slider" value={sliderValue} min={0} max={5} step={1} onChange={this.handleChangeSlider} />
            <TextField
              id="new-recipe-time"
              label="Preparation time"
              type="time"
              defaultValue="02:00"
              onChange={this.handleInputChange('prepTime')}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
            <FormGroup row>
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
            </FormGroup>
            <div className="recipe-controller-container">
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

NewRecipe.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewRecipe);