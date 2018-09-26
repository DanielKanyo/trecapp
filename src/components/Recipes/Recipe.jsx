import React, { Component } from 'react';
import '../App/index.css';

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
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
    textTransform: 'uppercase'
  },
});

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

class Recipe extends Component {

  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  componentDidMount() {}

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  formatDate() {

  }

  render() {
    const { classes } = this.props;
    const data = this.props.dataProp;

    let year = new Date(data.creationTime).getFullYear();
    let month = monthNames[new Date(data.creationTime).getMonth()];
    let day = new Date(data.creationTime).getDate();
    let creationTime = `${month} ${day}, ${year}`;

    let titleCharacters = data.title.split(''); 

    return (
      <div>
        <Card className={classes.card + ' card-recipe'}>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                { titleCharacters[0] }
              </Avatar>
            }
            action={
              <IconButton>
                <DeleteIcon />
              </IconButton>
            }
            title={ data.title }
            subheader={ creationTime }
          />
          <CardContent>
            <Typography component="p">
              { data.shortDes }
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
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
                Method:
              </Typography>
              <Typography paragraph>
                { data.longDes }
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      </div>
    );
  }
}

Recipe.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Recipe);