import React, { Component } from 'react';
import AccountDetails from './AccountDetails';

import AuthUserContext from '../Session/AuthUserContext';
import { PasswordForgetForm } from '../PasswordForget/PasswordForget';
import PasswordChangeForm from '../PasswordChange/PasswordChange';
import { db, storage } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Settings from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Chip from '@material-ui/core/Chip';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isoLanguages } from '../../constants/languages/iso-639';
import Snackbar from '../Snackbar/MySnackbar';
import LanguageListItem from './LanguageListItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import _ from 'lodash';

import ImageCompressor from 'image-compressor.js';

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const styles = theme => ({
  textField: {
    width: '100%',
    marginTop: 12,
    marginBottom: 6
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#F8B000',
  },
  flex: {
    flex: 1,
    fontSize: 16
  },
  progressLine: {
    borderRadius: '4px',
  },
  progressBar: {
    background: '#3f51b5'
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class AccountPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pageLoading: true,
      accountName: '',
      accountEmail: '',
      loggedInUserId: '',
      accountFilterRecipes: '',
      accountAbout: '',
      open: false,
      src: null,
      blob: '',
      crop: {
        x: 10,
        y: 10,
        aspect: 1,
        height: 80
      },
      profilePicUrl: '',
      profileImageName: '',
      loading: false,
      selectedLanguages: [],
      defaultLanguages: [],
      snackbarMessage: '',
      snackbarType: '',
      snackbarOpen: false,
      method: ''
    };

    this.saveNewValueToDb = _.debounce(this.saveNewValueToDb, 3000);
  }

  saveNewValueToDb = (key, value) => {
    try {
      switch (key) {
        case 'accountName':
          db.updateUsername(this.state.loggedInUserId, value);
          break;

        case 'accountAbout':
          db.updateUserAbout(this.state.loggedInUserId, value);
          break;

        default:
          break;
      }

      this.setState({
        snackbarOpen: true,
        snackbarMessage: this.props.languageObjectProp.data.Account.toaster.userDataSaved,
        snackbarType: 'success'
      });
    } catch (error) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'Something went wrong...',
        snackbarType: 'error'
      });
    }
  }

  /**
	 * Hide snackbar after x seconds
	 */
  hideSnackbar = () => {
    this.setState({
      snackbarOpen: false
    });
  }

  handleInputChange = (name, event) => {
    this.setState({ [name]: event.target.value });

    this.saveNewValueToDb(name, event.target.value);
  }

  handleChangeFilterBy = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * Save new account data
   */
  handleSaveLanguages = (filterRecipes) => {
    let languages = [];

    for (let i = 0; i < filterRecipes.length; i++) {
      if (filterRecipes.length === 1 && filterRecipes[0].key === 'all') {
        languages = 'all';
      } else {
        languages.push(filterRecipes[i].key);
      }
    }

    this.setState({
      snackbarOpen: true,
      snackbarMessage: this.props.languageObjectProp.data.Account.toaster.userDataSaved,
      snackbarType: 'success'
    });

    db.updateUserFilterRecipes(this.state.loggedInUserId, languages);
  }

  /**
   * Load user info
   */
  componentDidMount() {
    this.mounted = true;

    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;
    let selectedLanguages = this.state.selectedLanguages;

    db.getUserInfo(loggedInUserId).then(snapshot => {
      if (this.mounted) {

        if (snapshot.filterRecipes) {
          let defaultLanguages = this.getDefaultLanguages(snapshot.filterRecipes);

          this.setState({ defaultLanguages, filterRecipes: snapshot.filterRecipes });

          if (Array.isArray(snapshot.filterRecipes)) {
            for (let i = 0; i < snapshot.filterRecipes.length; i++) {
              selectedLanguages.push(
                <Chip
                  key={snapshot.filterRecipes[i]}
                  label={(isoLanguages[snapshot.filterRecipes[i]].nativeName).toUpperCase()}
                  onDelete={() => { this.handleDeleteLanguage(snapshot.filterRecipes[i]) }}
                  className={'language-chip'}
                  variant="outlined"
                />
              );
            }
          } else if (snapshot.filterRecipes !== 'all') {
            selectedLanguages.push(
              <Chip
                key={snapshot.filterRecipes}
                label={(isoLanguages[snapshot.filterRecipes].nativeName).toUpperCase()}
                onDelete={() => { this.handleDeleteLanguage(snapshot.filterRecipes) }}
                className={'language-chip'}
                variant="outlined"
              />
            );
          } else {
            selectedLanguages.push(
              <Chip key={'all'} label={(this.props.languageObjectProp.data.Account.showAllRecipes).toUpperCase()} className={'language-chip'} variant="outlined" />
            );
          }
        } else {
          selectedLanguages.push(
            <Chip key={'all'} label={(this.props.languageObjectProp.data.Account.showAllRecipes).toUpperCase()} className={'language-chip'} variant="outlined" />
          );
        }

        this.setState(() => ({
          accountName: this.titleCase(snapshot.username),
          accountEmail: snapshot.email,
          accountFilterRecipes: selectedLanguages,
          accountAbout: snapshot.about ? snapshot.about : '',
          profilePicUrl: snapshot.profilePicUrl ? snapshot.profilePicUrl : '',
          profileImageName: snapshot.profileImageName ? snapshot.profileImageName : '',
          loggedInUserId: loggedInUserId,
          method: snapshot.method,
          pageLoading: false,
        }));
      }
    });
  }

  /**
   * Capitalize string
   */
  titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  /**
   * Get default language items for the full screen dialog
   */
  getDefaultLanguages = (filterLanguages) => {
    let previousDefaultLanguages = this.state.defaultLanguages;
    let checked;

    Object.keys(isoLanguages).forEach(key => {
      let nativeName = isoLanguages[key].nativeName;
      let name = isoLanguages[key].name;

      if (filterLanguages !== 'all' && !Array.isArray(filterLanguages)) {
        checked = filterLanguages === key ? true : false;
      } else {
        checked = filterLanguages.includes(key) ? true : false;
      }

      let dataProp = {
        key,
        nativeName,
        name,
        checked
      }

      previousDefaultLanguages.push(
        <LanguageListItem
          key={key}
          dataProp={dataProp}
          handleAddLanguageProp={this.handleAddLanguage}
          handleDeleteLanguageProp={this.handleDeleteLanguage}
        />
      )
    });

    return previousDefaultLanguages
  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  openUploadDialog = () => {
    this.setState({ open: true });
  };

  closeUploadDialog = () => {
    this.setState({
      open: false,
      src: ''
    });

    document.getElementsByClassName("profile-input-container")[0].classList.remove("hide");
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      document.getElementsByClassName("profile-input-container")[0].classList.add("hide");
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = (image, pixelCrop) => {
    this.imageRef = image;
  };

  onCropComplete = async (crop, pixelCrop) => {
    let timestamp = new Date().getTime();

    const croppedImageUrl = await this.getCroppedImg(
      this.imageRef,
      pixelCrop,
      `profile-picture-${this.state.accountName}-${timestamp}`
    );

    this.setState({ croppedImageUrl });
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(file);
        resolve(this.fileUrl);

        this.setState({
          blob: file
        });

      }, "image/jpeg");
    });
  }

  /**
   * Save profile picture
   */
  saveProfilePicture() {
    const imageCompressor = new ImageCompressor();

    this.setState({
      loading: true
    });

    if (this.state.profileImageName) storage.deleteProfileImage(this.state.profileImageName);

    let quality = 0.5;

    if (this.state.blob.size < 150000) {
      quality = .6;
    } else if (this.state.blob.size > 2000000) {
      quality = .4;
    }

    imageCompressor.compress(this.state.blob, {
      quality: quality,
    }).then((result) => {

      storage.uploadProfileImage(result).then(fileObject => {
        const fullPath = fileObject.metadata.fullPath;
        const profileImageName = fileObject.metadata.name;

        storage.getImageDownloadUrl(fullPath).then(url => {

          this.setState({
            profilePicUrl: url,
            profileImageName,
            loading: false
          });

          db.updateUsersProfilePictureUrlAndName(this.state.loggedInUserId, url, profileImageName);
        });
      });

    }).catch((err) => {
      console.log('Something went wrong...', err);
    });
  }

  /**
   * Delete selected language from the list
   */
  handleDeleteLanguage = (language) => {
    let previousSelectedLanguages = this.state.selectedLanguages;
    let previousDefaultLanguages = this.state.defaultLanguages;

    for (let i = 0; i < previousSelectedLanguages.length; i++) {
      if (language === previousSelectedLanguages[i].key) {
        previousSelectedLanguages.splice(i, 1);
      }
    }

    for (let j = 0; j < previousDefaultLanguages.length; j++) {
      if (language === previousDefaultLanguages[j].key) {
        previousDefaultLanguages[j].props.dataProp.checked = false;
      }
    }

    if (previousSelectedLanguages.length !== 0) {
      this.setState({ selectedLanguages: previousSelectedLanguages });
      this.handleSaveLanguages(previousSelectedLanguages);
    } else {
      previousSelectedLanguages.push(
        <Chip
          key={'all'}
          label={(this.props.languageObjectProp.data.Account.showAllRecipes).toUpperCase()}
          className={'language-chip'}
          variant="outlined"
        />
      )

      this.setState({ selectedLanguages: previousSelectedLanguages });
      this.handleSaveLanguages(previousSelectedLanguages);
    }

  }

  /**
   * Add language to the list
   */
  handleAddLanguage = (e, lang) => {
    let previousSelectedLanguages = this.state.selectedLanguages;
    let previousDefaultLanguages = this.state.defaultLanguages;
    let alreadyAdded;

    for (let j = 0; j < previousSelectedLanguages.length; j++) {
      if (lang === previousSelectedLanguages[j].key) {
        alreadyAdded = true;
      }
    }

    for (let j = 0; j < previousDefaultLanguages.length; j++) {
      if (lang === previousDefaultLanguages[j].key) {
        previousDefaultLanguages[j].props.dataProp.checked = true;
      }
    }

    if (!alreadyAdded) {
      for (let i = 0; i < previousSelectedLanguages.length; i++) {
        if (previousSelectedLanguages[i].key === 'all') {
          previousSelectedLanguages.splice(0, 1)
        }
      }

      this.setState({
        selectedLanguages: previousSelectedLanguages,
        defaultLanguages: previousDefaultLanguages
      });

      previousSelectedLanguages.push(
        <Chip
          key={lang}
          label={(isoLanguages[lang].nativeName).toUpperCase()}
          onDelete={() => { this.handleDeleteLanguage(lang) }}
          className={'language-chip'}
          variant="outlined"
        />
      )

      this.setState({
        selectedLanguages: previousSelectedLanguages
      });
    } else {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: this.props.languageObjectProp.data.Account.toaster.languageAlreadyInList,
        snackbarType: 'warning'
      });
    }
  }

  render() {
    const { classes, languageObjectProp } = this.props;
    const { pageLoading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <div className="ComponentContent Account">
            <Grid className="main-grid" container spacing={2}>

              <Grid item className="grid-component" xs={12}>

                <Paper className={classes.paper + ' paper-title paper-title-profile'}>
                  <div className="paper-title-icon">
                    <Settings />
                  </div>
                  <div className="paper-title-text">
                    {languageObjectProp.data.Account.title}
                  </div>
                </Paper>

                {
                  pageLoading && <LinearProgress classes={{ colorPrimary: classes.progressLine, barColorPrimary: classes.progressBar }} />
                }

                {
                  !pageLoading ?
                    <Grid item className="grid-component" xs={12}>
                      <Grid className="sub-grid" container spacing={2}>

                        <Grid item className="grid-component" xs={6}>
                          <Paper className={classes.paper + ' profile-picture-container'}>
                            <div>
                              {
                                this.state.profilePicUrl === "" ?
                                  <div className="profile-picture-with-no-image">
                                    {
                                      this.state.loading ?
                                        <div><CircularProgress /></div> :
                                        <div>
                                          <BrokenImageIcon />
                                          <div className="no-image-text">{languageObjectProp.data.Account.noImageText}</div>
                                        </div>
                                    }

                                  </div> : <div className="profile-picture" style={{ backgroundImage: `url(${this.state.profilePicUrl})` }}></div>
                              }
                              <div className="profile-picture-upload-btn">
                                <Button color="inherit" onClick={this.openUploadDialog} className="upload-profile-pic-btn">
                                  {this.state.profilePicUrl === "" ?
                                    languageObjectProp.data.Account.profileImageUpload : languageObjectProp.data.Account.profileImageChange
                                  }
                                </Button>
                              </div>
                            </div>
                          </Paper>
                          <AccountDetails
                            handleInputChangeProp={this.handleInputChange}
                            handleChangeFilterByProp={this.handleChangeFilterBy}
                            handleSaveLanguagesProp={this.handleSaveLanguages}
                            dataProp={this.state}
                            languageObjectProp={languageObjectProp}
                            defaultLanguagesProp={this.state.defaultLanguages}
                          />
                        </Grid>

                        <Grid item className="grid-component" xs={6}>
                          <Paper className={classes.paper + ' account-details-container'}>
                            <PasswordForgetForm languageObjectProp={languageObjectProp} />
                            <PasswordChangeForm languageObjectProp={languageObjectProp} />
                          </Paper>
                        </Grid>

                      </Grid>
                    </Grid> : ''
                }

              </Grid>
            </Grid>

            <Dialog
              fullScreen
              open={this.state.open}
              onClose={this.closeUploadDialog}
              TransitionComponent={Transition}
              className="upload-profile-image-dialog"
            >
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <IconButton color="inherit" onClick={this.closeUploadDialog} aria-label="Close">
                    <CloseIcon />
                  </IconButton>
                  <Typography color="inherit" className={classes.flex}>
                    {languageObjectProp.data.Account.profileImageUpload}
                  </Typography>
                  <Button color="inherit" onClick={() => { this.closeUploadDialog(); this.saveProfilePicture() }}>
                    {languageObjectProp.data.Account.save}
                  </Button>
                </Toolbar>
              </AppBar>
              <div className="uploaded-image-container">
                {this.state.src && (
                  <ReactCrop
                    src={this.state.src}
                    crop={this.state.crop}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                  />
                )}
              </div>
              <div className="profile-input-container">
                <div className="profile-input-overlap">
                  <AddPhotoAlternateIcon className="add-profile-picture-icon" />
                </div>
                <input className="profile-input" type="file" onChange={this.onSelectFile} />
              </div>
            </Dialog>

            <Snackbar
              messageProp={this.state.snackbarMessage}
              typeProp={this.state.snackbarType}
              openProp={this.state.snackbarOpen}
              hideSnackbarProp={this.hideSnackbar}
            />
          </div>
        }
      </AuthUserContext.Consumer>
    );
  }
}

const authCondition = (authUser) => !!authUser;

AccountPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(AccountPage);