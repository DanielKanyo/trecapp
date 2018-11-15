import React, { Component } from 'react';
import '../App/index.css';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  card: {
    maxWidth: '100%',
  },
  media: {
    height: 0,
    paddingTop: '50%',
  },
});

class CategoryItem extends Component {
  render() {
    const { classes } = this.props;
    let { dataProp } = this.props;

    return (
      <Grid item xs={4} className="category-item">
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={require(`../../images/categories/img${dataProp.imageNumber}.jpg`)}
            title={dataProp.categoryName}
          />
          <CardContent className="category-item-title">
            <Typography gutterBottom>
              {dataProp.categoryName}
            </Typography>
          </CardContent>
        </Card>
        <div className="recipe-counter">
          <Chip label={dataProp.numberOfRecipe} />
        </div>
      </Grid>
    )
  }
}

CategoryItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CategoryItem);