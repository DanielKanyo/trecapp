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
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

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
      expanded: false,
      dialogOpen: false,
      visibility: this.props.dataProp.publicChecked,
      favourite: false
    };
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  }

  handleDeleteRecipe = (id) => {
    this.props.deleteRecipeProp(id);
  }

  handleClickOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

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

    this.toastr('Visibility of the recipe has changed!', '#4BB543');
  }

  handleAddToFavorites(recipeId) {
    this.setState(prevState => ({
      favourite: !prevState.favourite
    }));
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

  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;
    const data = this.props.dataProp;

    let year = new Date(data.creationTime).getFullYear();
    let month = languageObjectProp.data.months[new Date(data.creationTime).getMonth()];
    let day = new Date(data.creationTime).getDate();
    let creationTime = `${month} ${day}, ${year}`;

    let titleCharacters = data.title.split('');

    return (
      <div>
        <Card className={classes.card + ' card-recipe'}>
          <CardHeader className="recipe-card-header"
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                {titleCharacters[0]}
              </Avatar>
            }
            action={
              <IconButton className="delete-recipe-btn" onClick={this.handleClickOpenDialog}>
                <DeleteIcon />
              </IconButton>
            }
            title={data.title}
            subheader={creationTime}
          />
          <CardContent>
            <Typography component="p">
              {data.story}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Add to favorites" onClick={() => { this.handleAddToFavorites(data.recipeId)}}>
              <FavoriteIcon className={this.state.favourite ? 'fav-recipe': ''} />
            </IconButton>
            
            {this.state.visibility ?
              <IconButton aria-label="Public recipe" onClick={() => { this.handleChangeVisibility(data.recipeId, this.state.visibility) }}>
                <Visibility />
              </IconButton>
              :
              <IconButton aria-label="Public recipe" onClick={() => { this.handleChangeVisibility(data.recipeId, this.state.visibility) }}>
                <VisibilityOff />
              </IconButton>
            }

            <Chip label={languageObjectProp.data.myRecipes.newRecipe.categoryItems[data.category]} className={classes.chip} />
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
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
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