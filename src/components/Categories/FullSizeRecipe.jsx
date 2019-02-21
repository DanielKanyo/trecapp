import React, { Component } from 'react';
import '../App/index.css';
import { db } from '../../firebase';
import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import Recipe from '../Recipes/Recipe';

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
	},
	progressLine: {
		borderRadius: '4px',
	},
	progressBar: {
		background: '#F8B000'
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
			recipeCategory: 'Category',
			loading: true,
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
					if (resRecipe.val()) {
						let recipe = resRecipe.val();

						let username = usersObject[recipe.userId].username;
						let profilePicUrl = usersObject[recipe.userId].profilePicUrl;

						this.setState({
							loggedInUserId: loggedInUserId
						});

						let favouritesObject = recipe.favourites;
						let likesObject = recipe.likes;

						let isMine = recipe.userId === loggedInUserId ? true : false;
						let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;
						let isLiked = !likesObject ? false : likesObject.hasOwnProperty(loggedInUserId) ? true : false;
						let recipeDeletable = false;
						let recipeEditable = isMine;
						let visibilityEditable = false;
						let displayUserInfo = true;
						let withPhoto = recipe.imageUrl !== '' ? true : false;
						let favouriteCounter = recipe.favouriteCounter;
						let showMore = true;

						let data = recipe;

						data.loggedInUserId = loggedInUserId;
						data.username = username;
						data.profilePicUrl = profilePicUrl;
						data.isMine = isMine;
						data.isFavourite = isFavourite;
						data.isLiked = isLiked;
						data.favouriteCounter = favouriteCounter;
						data.recipeDeletable = recipeDeletable;
						data.recipeEditable = recipeEditable;
						data.withPhoto = withPhoto;
						data.visibilityEditable = visibilityEditable;
						data.displayUserInfo = displayUserInfo;
						data.showMore = showMore;
						data.fullSizeRecipe = 'fullSizeRecipe';
						data.recipeId = this.props.match.params.id;
						data.withComments = true;

						let recipeComponent = <Recipe key={data.recipeId} dataProp={data} languageObjectProp={this.props.languageObjectProp} />

						this.setState({
							recipe: recipeComponent,
							loading: false,
						});
					} else {
						this.setState({
							loading: false,
						});
					}
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
		const { classes } = this.props;
		
		return (
			<div className="ComponentContent">
				<Grid className="main-grid" container spacing={16}>
					<Grid item className="grid-component" xs={12}>
						{this.state.loading && <LinearProgress classes={{ colorPrimary: classes.progressLine, barColorPrimary: classes.progressBar }} />}

						{this.state.recipe}
					</Grid>
				</Grid>
			</div>
		)
	}
}

const authCondition = (authUser) => !!authUser;

FullSizeRecipe.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(FullSizeRecipe);