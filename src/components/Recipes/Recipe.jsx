import React, { Component } from 'react';
import '../App/index.css';
import { db, storage } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Chip from '@material-ui/core/Chip';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOutlined from '@material-ui/icons/VisibilityOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
  card: {},
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: '#F8B000',
    textTransform: 'uppercase'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  chip: {
    margin: theme.spacing.unit,
    backgroundColor: "#efefef"
  },
  uploadButton: {
    position: 'absolute',
    right: '3px',
    bottom: '3px',
    color: '#03c457'
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: '#F8B000',
  },
});

class Recipe extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.dataProp.userId,
      expanded: false,
      dialogOpen: false,
      visibility: this.props.dataProp.publicChecked,
      isFavourite: this.props.dataProp.isFavourite,
      favouriteCounter: this.props.dataProp.favouriteCounter,
      isMine: this.props.dataProp.isMine,
      uploadReady: false,
      file: '',
      imageUrl: this.props.dataProp.imageUrl,
      uploading: false
    };
  }

  /**
   * Open or close recipe details
   */
  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  }

  /**
   * Delete recipe prop function
   * 
   * @param {string} id
   */
  handleDeleteRecipe = (id) => {
    this.props.deleteRecipeProp(id);
  }

  /**
   * Open dialog
   */
  handleClickOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  /**
   * Close dialog
   */
  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };

  /**
   * Change recipe vibility
   * 
   * @param {string} recipeId 
   * @param {boolean} isPublic 
   */
  handleChangeVisibility(recipeId, isPublic) {
    db.updateRecipeVisibility(recipeId, !isPublic);

    this.setState({
      visibility: !isPublic
    });

    if (isPublic) {
      toast.success(this.props.languageObjectProp.data.myRecipes.toaster.removedFromPublic);
    } else {
      toast.success(this.props.languageObjectProp.data.myRecipes.toaster.addedToPublic);
    }
  }

  /**
   * User can add or remove recipe from favourites
   * 
   * @param {strin} recipeId 
   * @param {string} userId 
   */
  handleToggleFavourite(recipeId, userId) {
    let isFav = this.state.isFavourite;
    let newValue = !isFav;

    this.setState({
      isFavourite: newValue
    });

    db.toggleFavourite(userId, recipeId).then(recipe => {
      let recipeNew = recipe.snapshot.val();

      this.setState({
        favouriteCounter: recipeNew.favouriteCounter
      });
    });

    if (newValue) {
      toast.success(this.props.languageObjectProp.data.myRecipes.toaster.addedToFav);
    } else {
      toast.success(this.props.languageObjectProp.data.myRecipes.toaster.removedFromFav);
    }
  }

  fileAdded = (e) => {
    // max 10 MB
    const maxFileSize = 10485760;

    let file = e.target.files[0];
    let fileType = file.type;

    if (fileType.includes("image") && file.size < maxFileSize) {
      this.setState({
        file,
        uploadReady: true
      });
    } else {

      if (file.size > maxFileSize) {
        toast.warn(this.props.languageObjectProp.data.myRecipes.toaster.fileTooBig);
      } else {
        toast.warn(this.props.languageObjectProp.data.myRecipes.toaster.chooseAnImage);
      }

      this.setState({
        file: '',
        uploadReady: false
      });

    }
  }

  saveImage = () => {
    this.setState({
      uploading: true
    });

    storage.uploadImage(this.state.file).then(fileObject => {
      let fullPath = fileObject.metadata.fullPath;

      storage.getImageDownloadUrl(fullPath).then(url => {
        this.setState({
          imageUrl: url,
          uploading: false
        });

        db.updateRecipeImageUrl(this.props.dataProp.recipeId, url);
      });
    });
  }

  numberFormatter(number) {
    if (number > 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number > 1000) {
      return (number / 1000).toFixed(1) + 'k';
    } else {
      return number;
    }
  }

  /**
   * Render function
   */
  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;
    const data = this.props.dataProp;

    let year = new Date(data.creationTime).getFullYear();
    let month = languageObjectProp.data.months[new Date(data.creationTime).getMonth()];
    let day = new Date(data.creationTime).getDate();
    let creationTime = `${month} ${day}, ${year}`;

    let titleCharacters = data.title.split('');

    let hour = data.hour;
    let minute = data.minute;

    return (
      <div className="recipe-content">
        <Card className={classes.card + ' card-recipe'}>
          <CardHeader className="recipe-card-header"
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                {titleCharacters[0]}
              </Avatar>
            }
            action={this.state.isMine ?
              <Tooltip title={languageObjectProp.data.myRecipes.tooltips.deleteRecipe}>
                <IconButton className="delete-recipe-btn" onClick={this.handleClickOpenDialog}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip> : ''
            }
            title={data.title}
            subheader={creationTime}
          />
          {this.state.imageUrl !== "" ?
            <CardMedia
              className={classes.media}
              image={this.state.imageUrl}
              title={languageObjectProp.data.myRecipes.myRecipes.recipeImage}
            /> :
            <div className="file-upload-container">
              <div className="file-upload-overlap">
                <div>
                  {this.state.uploading ? <CircularProgress className={classes.progress} /> : <AddPhotoAlternateIcon />}
                </div>
              </div>
              {this.state.uploadReady ?
                <Tooltip title={languageObjectProp.data.myRecipes.tooltips.saveImage}>
                  <IconButton className={classes.uploadButton} aria-label="Delete">
                    <SaveIcon onClick={this.saveImage} />
                  </IconButton>
                </Tooltip> : ''}
              <input type="file" onChange={(e) => { this.fileAdded(e) }} className="file-upload-input" />
            </div>
          }

          <CardContent className="recipe-story-card-content">
            <Typography component="p">
              {data.story}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>

            <Tooltip title={this.state.isFavourite ? languageObjectProp.data.myRecipes.tooltips.removeFromFav : languageObjectProp.data.myRecipes.tooltips.addToFav}>
              <div className="fav-icon-and-counter">
                <IconButton
                  aria-label="Remove from favorites"
                  onClick={() => { this.handleToggleFavourite(data.recipeId, this.state.userId) }}
                >
                  {this.state.isFavourite ? <FavoriteIcon className="fav-icon" /> : <FavoriteBorderIcon className="icon-outlined" />}
                </IconButton>
                {this.state.favouriteCounter ? <div className="fav-counter"><div>{this.numberFormatter(this.state.favouriteCounter)}</div></div> : ''}
              </div>
            </Tooltip>

            <Tooltip title={this.state.visibility ? languageObjectProp.data.myRecipes.tooltips.publicRecipe : languageObjectProp.data.myRecipes.tooltips.privateRecipe}>
              <IconButton
                aria-label="Public recipe"
                onClick={() => { this.handleChangeVisibility(data.recipeId, this.state.visibility) }}
              >
                {this.state.visibility ? <Visibility className="visibility-icon" /> : <VisibilityOutlined className="icon-outlined" />}
              </IconButton>
            </Tooltip>

            <Chip label={languageObjectProp.data.myRecipes.newRecipe.categoryItems[data.category]} className={classes.chip} />

            <Tooltip title={languageObjectProp.data.myRecipes.tooltips.more}>
              <IconButton
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expanded,
                })}
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>

          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent className="recipe-card-content">
              <Typography paragraph variant="body2">
                {languageObjectProp.data.myRecipes.myRecipes.ingredients + ':'}
              </Typography>
              <Typography paragraph>
                {data.ingredients}
              </Typography>
              <Typography paragraph variant="body2">
                {languageObjectProp.data.myRecipes.myRecipes.method + ':'}
              </Typography>
              <Typography paragraph>
                {data.longDes}
              </Typography>
              <Chip label={`${data.dose} ${languageObjectProp.data.myRecipes.myRecipes.numDose}`} className="chip-card-content" />
              <Chip
                label={hour === '0' ?
                  `${minute} ${languageObjectProp.data.myRecipes.myRecipes.minuteText}` :
                  `${hour} ${languageObjectProp.data.myRecipes.myRecipes.hourText} ${minute} ${languageObjectProp.data.myRecipes.myRecipes.minuteText}`}
                className="chip-card-content"
              />
              <Chip label={`${data.cost} ${data.currency}`} className="chip-card-content" />
            </CardContent>
          </Collapse>
        </Card>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          id='delete-recipe-dialog'
        >
          <DialogTitle id="alert-dialog-title">{languageObjectProp.data.myRecipes.myRecipes.modal.title}</DialogTitle>
          <DialogContent id="alert-dialog-content">
            <DialogContentText id="alert-dialog-description">
              {languageObjectProp.data.myRecipes.myRecipes.modal.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              {languageObjectProp.data.myRecipes.myRecipes.modal.cancel}
            </Button>
            <Button onClick={() => { this.handleCloseDialog(); this.handleDeleteRecipe(data.recipeId) }} color="primary" autoFocus>
              {languageObjectProp.data.myRecipes.myRecipes.modal.do}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

Recipe.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(Recipe);