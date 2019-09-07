import React, { Component } from 'react';

import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import compose from 'recompose/compose';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
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
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Snackbar from '../Snackbar/MySnackbar';

import ImageCompressor from 'image-compressor.js';

import { db, storage } from '../../firebase';
import { isoCurrencies } from '../../constants/iso-4217';
import { isoLanguages } from '../../constants/languages/iso-639';

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
  uploadIcon: {
    marginRight: theme.spacing(),
  },
  margin: {
    margin: 12,
    marginLeft: 0,
  },
  fab: {
    margin: 5
  },
  progress: {
    margin: theme.spacing(2),
    color: '#d33061',
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
      open: false,
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
      difficulty: 1,
      hour: '0',
      minute: '30',
      category: '',
      recipeLanguage: '',
      publicChecked: false,
      loggedInUserId: '',
      imageUrl: '',
      imageName: '',
      file: '',
      saveReady: false,
      fileName: '',
      snackbarMessage: '',
      snackbarType: '',
      snackbarOpen: false,
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

          Object.keys(isoCurrencies).forEach(key => {
            let code = isoCurrencies[key].code;

            previousCurrencies.push(
              <MenuItem key={key} value={code}>{code}</MenuItem>
            )
          });

          Object.keys(isoLanguages).forEach(key => {
            let nativeName = isoLanguages[key].nativeName;
            let name = isoLanguages[key].name;

            previousLanguages.push(
              <MenuItem key={key} value={isoLanguages[key]['639-1']}>{nativeName} ({name})</MenuItem>
            )
          });

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
            difficulty: recipeData.difficulty,
            hour: recipeData.hour,
            minute: recipeData.minute,
            category: recipeData.category,
            recipeLanguage: recipeData.recipeLanguage,
            publicChecked: recipeData.publicChecked,
            imageUrl: recipeData.imageUrl,
            imageName: recipeData.imageName,
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
      this.setState({
        snackbarOpen: true,
        snackbarMessage: this.props.languageObjectProp.data.myRecipes.newRecipe.toaster.fillTheInput,
        snackbarType: 'warning'
      });
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

  handleChangeSlider = (event, difficulty) => {
    this.setState({ difficulty });
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
      difficulty: this.state.difficulty,
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
      this.setState({
        snackbarOpen: true,
        snackbarMessage: this.props.languageObjectProp.data.myRecipes.toaster.warningFillReq,
        snackbarType: 'warning'
      });
    } else {
      if (data.dose < 1 || data.cost < 1) {
        this.setState({
          snackbarOpen: true,
          snackbarMessage: this.props.languageObjectProp.data.myRecipes.toaster.warningSmallerThanOne,
          snackbarType: 'warning'
        });
      } else {
        db.updateRecipe(this.state.recipeId, data).then(() => {
          this.setState({
            snackbarOpen: true,
            snackbarMessage: this.props.languageObjectProp.data.myRecipes.editRecipe.saveSuccess,
            snackbarType: 'success'
          });
        });
      }
    }
  }

  uploadNewImage = () => {
    this.inputElement.click();
  }

  uploadInputChanged = (e) => {
    // max 10 MB
    const maxFileSize = 10485760;

    if (e.target.files.length === 1) {
      let file = e.target.files[0];
      let fileType = file.type;

      if (fileType.includes("image") && file.size < maxFileSize) {
        this.setState({
          file,
          fileName: '',
          saveReady: true
        });
      } else {

        if (file.size > maxFileSize) {
          this.setState({
            snackbarOpen: true,
            snackbarMessage: this.props.languageObjectProp.data.myRecipes.toaster.fileTooBig,
            snackbarType: 'warning'
          });
        } else {
          this.setState({
            snackbarOpen: true,
            snackbarMessage: this.props.languageObjectProp.data.myRecipes.toaster.chooseAnImage,
            snackbarType: 'warning'
          });
        }

        this.setState({
          file: '',
          fileName: '',
          saveReady: false
        });

      }
    } else {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: this.props.languageObjectProp.data.myRecipes.toaster.chooseOnlyOne,
        snackbarType: 'warning'
      });

      this.setState({
        file: '',
        fileName: '',
        saveReady: false
      });
    }
  }

  dismissImage = () => {
    this.inputElement.value = '';

    this.setState({
      file: '',
      fileName: '',
      saveReady: false
    });
  }

  /**
   * Hide snackbar after x seconds
   */
  hideSnackbar = () => {
    this.setState({
      snackbarOpen: false
    });
  }

  saveImage = () => {
    const imageCompressor = new ImageCompressor();

    this.setState({
      uploading: true
    });

    if (this.state.imageName) {
      storage.deleteRecipeImage(this.state.imageName);
    }

    let quality = 0.5;

    if (this.state.file.size < 150000) {
      quality = .6;
    } else if (this.state.file.size > 2000000) {
      quality = .4;
    }

    imageCompressor.compress(this.state.file, {
      quality: quality,
    }).then((result) => {

      storage.uploadImage(result).then(fileObject => {
        let fullPath = fileObject.metadata.fullPath;
        let name = fileObject.metadata.name;

        storage.getImageDownloadUrl(fullPath).then(url => {
          this.setState({
            imageUrl: url,
            imageName: name,
            uploading: false,
            saveReady: false
          });

          db.updateRecipeImageUrlAndName(this.state.recipeId, url, name);
        });
      });

    }).catch((err) => {
      console.log('Something went wrong...', err);
    });
  }

  deleteImage = () => {
    if (this.state.imageName) {
      storage.deleteRecipeImage(this.state.imageName);
      db.updateRecipeImageUrlAndName(this.state.recipeId, '', '');

      this.setState({
        imageUrl: '',
        imageName: ''
      });
    }
  }

  handleClickOpenDialog = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, languageObjectProp } = this.props;

    let imgDeletable = this.state.imageName ? false : true;

    return (
      <div className="ComponentContent EditComponent">
        <Grid className="main-grid" container spacing={2}>

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

                  <div className="recipe-image-on-edit-component">
                    {
                      this.state.imageUrl ?
                        <div className="background-with-image" style={{ backgroundImage: `url(${this.state.imageUrl})` }}></div>
                        :
                        <div className="background-no-image">
                          {
                            this.state.saveReady ? '' :
                              <div className="no-image-text-and-icon">
                                <BrokenImageIcon />
                                <div>{languageObjectProp.data.Categories.noPreviewImage}</div>
                              </div>
                          }
                        </div>
                    }
                    <div className="upload-new-image-btn-container">
                      <input
                        ref={input => this.inputElement = input}
                        type="file"
                        id="imgUpload"
                        onChange={this.uploadInputChanged}
                      />

                      <Tooltip title={languageObjectProp.data.myRecipes.editRecipe.newImg} placement="right">
                        <Fab
                          size="medium"
                          color="primary"
                          aria-label="Add"
                          className={classes.fab}
                          onClick={this.uploadNewImage}
                        >
                          <AddPhotoAlternateIcon />
                        </Fab>
                      </Tooltip>

                      <Tooltip title={languageObjectProp.data.myRecipes.editRecipe.deleteImg} placement="right">
                        <div>
                          <Fab
                            size="medium"
                            color="primary"
                            aria-label="Remove"
                            disabled={imgDeletable}
                            className={classes.fab}
                            onClick={this.handleClickOpenDialog}
                          >
                            <DeleteIcon />
                          </Fab>
                        </div>
                      </Tooltip>
                    </div>
                    {
                      this.state.saveReady ?
                        <div className="ready-to-upload-image">
                          {
                            this.state.uploading ? <CircularProgress className={classes.progress} /> :
                              <div>
                                <Tooltip title={languageObjectProp.data.myRecipes.editRecipe.uploadImg}>
                                  <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.saveImage}>
                                    <SaveIcon />
                                  </Fab>
                                </Tooltip>
                                <Tooltip title={languageObjectProp.data.myRecipes.editRecipe.cancelImg}>
                                  <Fab aria-label="Delete" className={classes.fab} onClick={this.dismissImage}>
                                    <CloseIcon />
                                  </Fab>
                                </Tooltip>
                              </div>
                          }
                        </div> : ''
                    }
                  </div>

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
                      <Slider className="slider" value={this.state.difficulty} min={0} max={2} step={1} onChange={this.handleChangeSlider} />
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
                      {languageObjectProp.data.myRecipes.editRecipe.saveChanges}
                    </Button>
                  </div>

                </Paper>
              </MuiThemeProvider>
            </Grid>

          </Grid>

        </Grid>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          id='delete-recipe-dialog'
        >
          <DialogTitle id="alert-dialog-title">{languageObjectProp.data.myRecipes.editRecipe.modal.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {languageObjectProp.data.myRecipes.editRecipe.modal.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              {languageObjectProp.data.myRecipes.editRecipe.modal.cancel}
            </Button>
            <Button onClick={() => { this.handleClose(); this.deleteImage() }} color="primary" autoFocus>
              {languageObjectProp.data.myRecipes.editRecipe.modal.do}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          messageProp={this.state.snackbarMessage}
          typeProp={this.state.snackbarType}
          openProp={this.state.snackbarOpen}
          hideSnackbarProp={this.hideSnackbar}
        />
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(Edit);