import React, { Component } from 'react';
import '../App/index.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import AddCircle from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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

class NewRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;
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
            rows="6"
            placeholder="Preparation method..."
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <FormControlLabel className="is-recipe-will-be-public-container"
            control={
              <Checkbox
                checked={this.state.checked}
                onChange={this.handleChange('checked')}
                value="checked"
                color="primary"
              />
            }
            label="Public"
          />
        </Paper>
      </div>
    );
  }
}

NewRecipe.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewRecipe);