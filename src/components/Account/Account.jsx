import React, { Component } from 'react';
import AccountDetails from './AccountDetails';

import AuthUserContext from '../Session/AuthUserContext';
import { PasswordForgetForm } from '../PasswordForget/PasswordForget';
import PasswordChangeForm from '../PasswordChange/PasswordChange';
import { db, storage } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
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
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';

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
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AccountPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      accountName: '',
      accountEmail: '',
      accountLanguage: '',
      loggedInUserId: '',
      accountCurrency: '',
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
      profilePicUrl: ''
    };
  }

  handleInputChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  }

  handleChangeLanguage = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeCurrency = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSaveNewAccountData = (name, language, currency, about) => {
    this.setState({
      accountName: name,
      accountLanguage: language,
      accountCurrency: currency,
      accountAbout: about,
    });

    db.updateUserInfo(this.state.loggedInUserId, name, language, currency, about);
  }

  componentDidMount() {
    this.mounted = true;

    let authObject = JSON.parse(localStorage.getItem('authUser'));
    let loggedInUserId = authObject.id;

    db.getUserInfo(loggedInUserId).then(snapshot => {
      if (this.mounted) {
        this.setState(() => ({
          accountName: snapshot.username,
          accountEmail: snapshot.email,
          accountCurrency: snapshot.currency ? snapshot.currency : 'USD',
          accountLanguage: snapshot.language ? snapshot.language : 'eng',
          accountAbout: snapshot.about ? snapshot.about : '', 
          profilePicUrl: snapshot.profilePicUrl,
          loggedInUserId: loggedInUserId,
        }));
      }
    });
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

  saveProfilePicture() {
    storage.uploadProfileImage(this.state.blob).then(fileObject => {
      let fullPath = fileObject.metadata.fullPath;

      storage.getImageDownloadUrl(fullPath).then(url => {

        this.setState({
          profilePicUrl: url,
        });

        db.updateUsersProfilePictureUrl(this.state.loggedInUserId, url);
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <div className="ComponentContent Account">
            <Grid className="main-grid" container spacing={16}>

              <Grid item className="grid-component" xs={12}>

                <Paper className={classes.paper + ' paper-title paper-title-profile'}>
                  <div className="paper-title-icon">
                    <Settings />
                  </div>
                  <div className="paper-title-text">
                    {languageObjectProp.data.Account.title}
                  </div>
                </Paper>

                <Grid item className="grid-component" xs={12}>
                  <Grid className="sub-grid" container spacing={16}>

                    <Grid item className="grid-component" xs={6}>
                      <Paper className={classes.paper + ' profile-picture-container'}>
                        <div>
                          {
                            this.state.profilePicUrl === "" ?
                              <div className="profile-picture-with-no-image">
                                <div>
                                  <BrokenImageIcon />
                                  <div className="no-image-text">{languageObjectProp.data.Account.noImageText}</div>
                                </div>
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
                        handleChangeLanguageProp={this.handleChangeLanguage}
                        handleChangeCurrencyProp={this.handleChangeCurrency}
                        setLanguageProp={this.props.setLanguageProp}
                        handleSaveNewAccountDataProp={this.handleSaveNewAccountData}
                        dataProp={this.state}
                        languageObjectProp={languageObjectProp}
                      />
                    </Grid>

                    <Grid item className="grid-component" xs={6}>
                      <Paper className={classes.paper + ' account-details-container'}>
                        <PasswordForgetForm languageObjectProp={languageObjectProp} />
                        <PasswordChangeForm languageObjectProp={languageObjectProp} />
                      </Paper>
                    </Grid>

                  </Grid>
                </Grid>

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

export default compose(withAuthorization(authCondition), withStyles(styles))(AccountPage);