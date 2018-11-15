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
import Tooltip from '@material-ui/core/Tooltip';

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

  numberFormatter(number) {
    if (number > 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number > 1000) {
      return (number / 1000).toFixed(1) + 'k';
    } else {
      return number;
    }
  }

  render() {
    const { languageObjectProp } = this.props;
    const { classes } = this.props;
    let { dataProp } = this.props;
    console.log(classes.media);
    

    return (
      <Grid item xs={4} className="category-item">
        <Card className={classes.card}>
          <CardMedia
            className={classes.media + `${dataProp.numberOfRecipe ? '' : ' no-recipe-in-category'}`}
            image={require(`../../images/categories/img${dataProp.imageNumber}.jpg`)}
            title={dataProp.categoryName}
          />
          <CardContent className="category-item-title">
            <Typography gutterBottom>
              {dataProp.categoryName}
            </Typography>
          </CardContent>
        </Card>
        <Tooltip
          title={dataProp.numberOfRecipe ?
            `${dataProp.numberOfRecipe} ${languageObjectProp.data.Categories.tooltip.numOfRecipe}` :
            languageObjectProp.data.Categories.tooltip.zeroRecipeInCategory
          }
        >
          <div className="recipe-counter">
            <Chip label={this.numberFormatter(dataProp.numberOfRecipe)} />
          </div>
        </Tooltip>
      </Grid>
    )
  }
}

CategoryItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CategoryItem);