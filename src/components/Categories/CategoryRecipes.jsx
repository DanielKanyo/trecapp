import React, { Component } from 'react';
import '../App/index.css';
import { db, auth } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { dataEng } from '../../constants/languages/eng';

const styles = theme => ({

});

class CategoryRecipes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categoryName: '',
      categoryNumber: null,
    };
  }

  componentDidMount = () => {
    this.mounted = true;

    let loggedInUserId = auth.getCurrentUserId();

    this.setState({
      loggedInUserId: loggedInUserId
    });

    db.getRecipes().then(resRecipes => {

      if (this.mounted) {
        let recipes = resRecipes;
        console.log(recipes);
        
        let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
        let categoryNameEng = this.props.match.params.category;
        let categoryNumber = categoryItems.indexOf(categoryNameEng.charAt(0).toUpperCase() + categoryNameEng.slice(1));
        let categoryName = this.props.languageObjectProp.data.myRecipes.newRecipe.categoryItems[categoryNumber]

        this.setState({
          categoryNumber,
          categoryName
        });
      }
    });


  }

  /**
   * Sets 'mounted' property to false to ignore warning 
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    // const { classes } = this.props;
    // const { languageObjectProp } = this.props;

    return (
      <div className="ComponentContent">
        {this.state.categoryName}
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;

CategoryRecipes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(CategoryRecipes);