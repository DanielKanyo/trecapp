import React, { Component } from 'react';
import '../App/index.css';
import { db } from '../../firebase';
import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Recipe from '../Recipes/Recipe';
import { ToastContainer } from 'react-toastify';

const styles = theme => ({
	paper: {
		padding: theme.spacing.unit * 2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		marginBottom: '14px'
	},
	chip: {
		background: '#00925d',
		color: 'white'
	}
});

class FullSizeRecipe extends Component {

	/**
   * Constructor
   * 
   * @param {Object} props 
   */
	constructor(props) {
		super(props);
		this.state = {
			recipe: '',
			category: this.props.match.params.category,
			recipeId: this.props.match.params.id,
			recipeTitle: 'Recipe Title',
			recipeCategory: 'Category'
		};
	}

	componentDidMount() {
		this.mounted = true;
		let authObject = JSON.parse(localStorage.getItem('authUser'));
		let loggedInUserId = authObject.id;

		db.users().once('value').then(users => {
			let usersObject = users.val();

			db.getRecipeById(this.props.match.params.id).then(resRecipe => {
				if (this.mounted) {
					let recipe = resRecipe.val();

					let username = usersObject[recipe.userId].username;
					let profilePicUrl = usersObject[recipe.userId].profilePicUrl;

					this.setState({
						loggedInUserId: loggedInUserId
					});

					let favouritesObject = recipe.favourites;

					let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;
					let recipeDeletable = false;
					let recipeEditable = false;
					let visibilityEditable = false;
					let displayUserInfo = true;
					let isMine = recipe.userId === loggedInUserId ? true : false;
					let withPhoto = recipe.imageUrl !== '' ? true : false;
					let favouriteCounter = recipe.favouriteCounter;
					let showMore = true;

					let data = recipe;

					data.loggedInUserId = loggedInUserId;
					data.username = username;
					data.profilePicUrl = profilePicUrl;
					data.isMine = isMine;
					data.isFavourite = isFavourite;
					data.favouriteCounter = favouriteCounter;
					data.recipeDeletable = recipeDeletable;
					data.recipeEditable = recipeEditable;
					data.withPhoto = withPhoto;
					data.visibilityEditable = visibilityEditable;
					data.displayUserInfo = displayUserInfo;
					data.showMore = showMore;
					data.fullSizeRecipe = 'fullSizeRecipe';
					data.recipeId = this.props.match.params.id;

					let recipeComponent = <Recipe key={data.recipeId} dataProp={data} languageObjectProp={this.props.languageObjectProp} />

					this.setState({
						recipe: recipeComponent
					});
				}
			});
		});
	}

	/**
   * Sets 'mounted' property to false to ignore warning 
   */
	componentWillUnmount() {
		this.mounted = false;
	}

	render() {

		return (
			<div className="ComponentContent">
				<Grid className="main-grid" container spacing={16}>
					<Grid item className="grid-component" xs={12}>
						{this.state.recipe}
					</Grid>
				</Grid>

				<ToastContainer
					position="top-right"
					autoClose={2500}
					hideProgressBar
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnVisibilityChange
					pauseOnHover
				/>
			</div>
		)
	}
}

const authCondition = (authUser) => !!authUser;

FullSizeRecipe.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(FullSizeRecipe);