import React, { Component } from 'react';
// import { auth, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Chip from '@material-ui/core/Chip';
import CardMedia from '@material-ui/core/CardMedia';

const styles = theme => ({
  card: {
    width: '100%',
    marginBottom: '14px',
  },
  actions: {
    display: 'flex',
    padding: '16px 12px 8px 12px'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: '#9b42f4',
  },
  chip: {
    margin: theme.spacing.unit,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    marginBottom: '16px'
  },
});

class FavRecipeItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes } = this.props;
    const { languageObjectProp } = this.props;
    const { userProp } = this.props;
    let data = this.props.dataProp;

    let year = new Date(data.creationTime).getFullYear();
    let month = languageObjectProp.data.months[new Date(data.creationTime).getMonth()];
    let day = new Date(data.creationTime).getDate();
    let creationTime = `${month} ${day}, ${year}`;

    let titleCharacters = data.title.split('');

    let hour = data.hour;
    let minute = data.minute;

    return (
      <Grid item className="grid-component recipe-content" xs={12}>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                {titleCharacters[0]}
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={data.title}
            subheader={creationTime}
          />
          {
            data.imageUrl !== '' ?
              <CardMedia
                className={classes.media}
                image={data.imageUrl}
                title={languageObjectProp.data.myRecipes.myRecipes.recipeImage}
              /> : ''
          }

          <CardContent className="recipe-story-card-content">
            <Typography component="p">{data.story}</Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <div>
              {data.isMine ?
                <Chip
                  label={languageObjectProp.data.Favourites.yourRecipe}
                  className={classes.chip + ' chip-card-content-mine'}
                /> :
                <Chip
                  label={userProp.username}
                  className={classes.chip + ' chip-card-content'}
                />}
            </div>
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
      </Grid>
    )
  }
}

const authCondition = (authUser) => !!authUser;

FavRecipeItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(FavRecipeItem);