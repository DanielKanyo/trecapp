import React, { Component } from 'react';
import '../App/index.css';
import { db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOutlined from '@material-ui/icons/VisibilityOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import Notifications, { notify } from 'react-notify-toast';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '14px'
  },
  card: {},
  media: {
    height: 0,
    paddingTop: '120px',
  },
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
  chip: {
    margin: theme.spacing.unit,
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
      favourite: this.props.dataProp.isFavourite,
      favouriteId: this.props.dataProp.favouriteId
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
      this.toastr(this.props.languageObjectProp.data.myRecipes.toaster.removedFromPublic, '#4BB543');
    } else {
      this.toastr(this.props.languageObjectProp.data.myRecipes.toaster.addedToPublic, '#4BB543');
    }
  }

  /**
   * User can add or remove recipe from favourites
   * 
   * @param {strin} recipeId 
   * @param {string} userId 
   */
  handleAddOrRemoveToFavorites(recipeId, userId) {
    let isFav = this.state.favourite;
    let newValue = !isFav;

    this.setState({
      favourite: newValue
    });

    if (newValue) {
      db.addRecipeToFavourites(userId, recipeId).then(snap => {
        let favouriteId = snap.key;

        this.setState({
          favouriteId
        });

        this.toastr(this.props.languageObjectProp.data.myRecipes.toaster.addedToFav, '#4BB543');
      });
    } else {
      db.removeRecipeFromFavourites(userId, this.state.favouriteId);

      this.toastr(this.props.languageObjectProp.data.myRecipes.toaster.removedFromFav, '#4BB543');
    }
  }

  /**
   * Show notification
   * 
   * @param {string} msg 
   * @param {string} bgColor 
   */
  toastr(msg, bgColor) {
    let style = { background: bgColor, text: "#FFFFFF" };

    notify.show(msg, 'custom', 4000, style);
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

    let hour = data.hour.split('');
    let hourText = hour[0] === '0' ? hour[1] : hour[0] + '' + hour[1];

    let minute = data.minute.split('');
    let minuteText = minute[0] === '0' ? minute[1] : minute[0] + '' + minute[1];

    return (
      <div className="recipe-content">
        <Card className={classes.card + ' card-recipe'}>
          <CardHeader className="recipe-card-header"
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                {titleCharacters[0]}
              </Avatar>
            }
            action={
              <Tooltip title={languageObjectProp.data.myRecipes.tooltips.deleteRecipe}>
                <IconButton className="delete-recipe-btn" onClick={this.handleClickOpenDialog}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            }
            title={data.title}
            subheader={creationTime}
          />
          <CardContent className="recipe-story-card-content">
            <Typography component="p">
              {data.story}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>

            {this.state.favourite ?
              <Tooltip title={languageObjectProp.data.myRecipes.tooltips.removeFromFav}>
                <IconButton
                  aria-label="Remove from favorites"
                  onClick={() => { this.handleAddOrRemoveToFavorites(data.recipeId, this.state.userId) }}
                >
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
              :
              <Tooltip title={languageObjectProp.data.myRecipes.tooltips.addToFav}>
                <IconButton
                  aria-label="Add to favorites"
                  onClick={() => { this.handleAddOrRemoveToFavorites(data.recipeId, this.state.userId) }}
                >
                  <FavoriteBorderIcon className="icon-outlined" />
                </IconButton>
              </Tooltip>
            }

            {this.state.visibility ?
              <Tooltip title={languageObjectProp.data.myRecipes.tooltips.publicRecipe}>
                <IconButton
                  aria-label="Public recipe"
                  onClick={() => { this.handleChangeVisibility(data.recipeId, this.state.visibility) }}
                >

                  <Visibility />
                </IconButton>
              </Tooltip>
              :
              <Tooltip title={languageObjectProp.data.myRecipes.tooltips.privateRecipe}>
                <IconButton
                  aria-label="Private recipe"
                  onClick={() => { this.handleChangeVisibility(data.recipeId, this.state.visibility) }}
                >
                  <VisibilityOutlined className="icon-outlined" />
                </IconButton>
              </Tooltip>
            }

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
              {
                hour[0] === '0' ?
                  <Chip
                    label={`${minuteText} ${languageObjectProp.data.myRecipes.myRecipes.minuteText}`}
                    className="chip-card-content"
                  />
                  :
                  <Chip
                    label={`${hourText} ${languageObjectProp.data.myRecipes.myRecipes.hourText} 
                        ${minuteText} ${languageObjectProp.data.myRecipes.myRecipes.minuteText}`}
                    className="chip-card-content"
                  />
              }

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
          <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={() => { this.handleCloseDialog(); this.handleDeleteRecipe(data.recipeId) }} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Notifications options={{ zIndex: 5000 }} />
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

Recipe.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(Recipe);