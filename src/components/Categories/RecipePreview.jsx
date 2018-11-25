import React, { Component } from 'react';
import '../App/index.css';
import { db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Face from '@material-ui/icons/Face';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Button from '@material-ui/core/Button';

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const styles = theme => ({
	card: {
		position: 'relative'
	},
	media: {
		height: 0,
		paddingTop: '50%',
		backgroundRepeat: 'unset'
	},
	actions: {
		display: 'flex',
	},
	avatar: {
		backgroundColor: 'blue',
	},
});

const difficultyColors = ['#008E3D', '#F8B000', '#ff1414']

class RecipePreview extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedInUserId: this.props.dataProp.loggedInUserId,
			displayUserInfo: this.props.dataProp.displayUserInfo,
			username: this.props.dataProp.username,
			isMine: this.props.dataProp.isMine,
			profilePicUrl: this.props.dataProp.profilePicUrl,
			isFavourite: this.props.dataProp.isFavourite,
			favouriteCounter: this.props.dataProp.favouriteCounter,
		};
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

	render() {
		const { classes } = this.props;
		const { languageObjectProp } = this.props;
		let data = this.props.dataProp;

		let year = new Date(data.creationTime).getFullYear();
		let month = languageObjectProp.data.months[new Date(data.creationTime).getMonth()];
		let day = new Date(data.creationTime).getDate();
		let creationTime = `${month} ${day}, ${year}`;

		let titleCharacters = data.title.split('');

		let urlToRecipe = `${this.props.dataProp.url}/fullsize/${this.props.dataProp.recipeId}`;

		return (
			<Grid item xs={12} className="recipe-preview-item">
				<Card className={classes.card}>
					<CardHeader className="recipe-card-header"
						avatar={
							<Tooltip title={languageObjectProp.data.myRecipes.tooltips.recipeDifficulty[data.sliderValue]}>
								<Avatar aria-label="Recipe" className={classes.avatar} style={{ backgroundColor: difficultyColors[data.sliderValue] }}>
									{titleCharacters[0]}
								</Avatar>
							</Tooltip>
						}
						action={
							<Tooltip title={languageObjectProp.data.myRecipes.tooltips.openRecipeFullSize}>
								<IconButton component={Link} to={urlToRecipe}>
									<OpenInNew />
								</IconButton>
							</Tooltip>
						}
						title={data.title}
						subheader={creationTime}
					/>
					{data.imageUrl ?
						<CardMedia
							className={classes.media}
							image={data.imageUrl}
							title={data.title}
						/>
						:
						<div className="no-image-container">
							<div className="recipe-preview-no-image"></div>
							<div className="no-image-icon-container" title={languageObjectProp.data.Categories.noPreviewImage}>
								<div className="no-image-text-and-icon">
									<BrokenImageIcon />
									<div>{languageObjectProp.data.Categories.noPreviewImage}</div>
								</div>
							</div>
						</div>
					}
					<Tooltip title={this.state.isFavourite ? languageObjectProp.data.myRecipes.tooltips.removeFromFav : languageObjectProp.data.myRecipes.tooltips.addToFav}>
						<div className="fav-icon-and-counter icon-and-counter-on-recipe-preview">
							<Button
								mini
								variant="fab"
								color="secondary"
								aria-label="heart"
								onClick={() => { this.handleToggleFavourite(data.recipeId, this.state.loggedInUserId) }}
							>
								{this.state.isFavourite ?
									<FavoriteIcon /> :
									<FavoriteBorderIcon />}
							</Button>
							{this.state.favouriteCounter ? <div className="fav-counter fav-counter-rec-preview"><div>{this.numberFormatter(this.state.favouriteCounter)}</div></div> : ''}
						</div>
					</Tooltip>
					{this.state.displayUserInfo ?
						<div className="user-container">
							<span>
								{this.state.isMine ? languageObjectProp.data.Favourites.yourRecipe : this.state.username}
							</span>
							<div className="user-picture" style={{ backgroundImage: `url(${this.state.profilePicUrl})` }}>
								{this.state.profilePicUrl ? '' : <div className="if-no-profile-image"><Face /></div>}
							</div>
						</div> : ''
					}
				</Card>

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
			</Grid>
		)
	}
}

const authCondition = (authUser) => !!authUser;

RecipePreview.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(RecipePreview);