import React, { Component } from 'react';
import '../App/index.css';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import AddCircle from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
  textField: {
    width: '100%'
  },
  slider: {
    width: 300,
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
      checked: false,
      sliderValue: 1,
    };
  }

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChangeSlider = (event, sliderValue) => {
    this.setState({ sliderValue });
  };

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
              label="Title"
              className={classes.textField}
              margin="normal"
              placeholder="Recipe title..."
              variant="outlined"
            />
            <TextField
              id="outlined-name"
              label="Short description"
              className={classes.textField}
              placeholder="Just a few sentences..."
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-multiline-static"
              label="Long description"
              multiline
              rows="5"
              placeholder="Preparation method..."
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <Typography id="slider-label">The difficulty of preparation</Typography>
            <Slider className="slider" value={sliderValue} min={0} max={5} step={1} onChange={this.handleChangeSlider} />
            <TextField
              id="new-recipe-time"
              label="Preparation time"
              type="time"
              defaultValue="02:00"
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
                    checked={this.state.checked}
                    onChange={this.handleChangeCheckbox('checked')}
                    value="checked"
                    color="primary"
                  />
                }
                label="Public"
              />
            </FormGroup>
          </MuiThemeProvider>
        </Paper>
      </div>
    );
  }
}

NewRecipe.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewRecipe);