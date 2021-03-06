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
import Fab from '@material-ui/core/Fab';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Snackbar from '../Snackbar/MySnackbar';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
			snackbarMessage: '',
			snackbarType: '',
			snackbarOpen: false,
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
   * Capitalize string
   */
	titleCase = (str) => {
		var splitStr = str.toLowerCase().split(' ');
		for (var i = 0; i < splitStr.length; i++) {
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
		}
		return splitStr.join(' ');
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
			this.setState({
				snackbarOpen: true,
				snackbarMessage: this.props.languageObjectProp.data.myRecipes.toaster.addedToFav,
				snackbarType: 'success'
			});
		} else {
			this.setState({
				snackbarOpen: true,
				snackbarMessage: this.props.languageObjectProp.data.myRecipes.toaster.removedFromFav,
				snackbarType: 'success'
			});
		}
	}

	/**
   * Hide snackbar after x seconds
   */
	hideSnackbar = () => {
		this.setState({
			snackbarOpen: false
		});
	}

	generatePdf = (print) => {
		let { dataProp, languageObjectProp } = this.props;

		let year = new Date(dataProp.creationTime).getFullYear();
		let month = languageObjectProp.data.months[new Date(dataProp.creationTime).getMonth()];
		let day = new Date(dataProp.creationTime).getDate();
		let creationTime = `${month} ${day}, ${year}`;

		let hour = dataProp.hour;
		let minute = dataProp.minute;

		let fileName = dataProp.title.split(" ").join("_");

		var docDefinition = {
			content: [
				{ text: dataProp.title, fontSize: 18, style: 'header', margin: [0, 0, 0, 6] },
				{ text: `${this.titleCase(this.state.username)}${languageObjectProp.data.Favourites.usersRecipe}`, margin: [0, 0, 0, 6] },
				{ text: creationTime, color: 'grey', margin: [0, 0, 0, 6] },
				{ canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }], margin: [0, 0, 0, 15] },
				{
					text: [
						{
							text: `${languageObjectProp.data.myRecipes.newRecipe.form.category}: `, bold: true
						},
						`${languageObjectProp.data.myRecipes.newRecipe.categoryItems[dataProp.category]}`
					],
					margin: [0, 0, 0, 15]
				},
				{
					text: [
						{
							text: `${languageObjectProp.data.myRecipes.newRecipe.form.story}: `, bold: true
						},
						`\n\n${dataProp.story}`
					],
					margin: [0, 0, 0, 15]
				},
				{ text: `${languageObjectProp.data.myRecipes.newRecipe.form.ingredients}: \n`, bold: true, style: 'header' },
				{ text: `\n` },
				{
					type: 'none',
					ul: [
						dataProp.ingredients.map(ingredient => {
							return ingredient;
						})
					],
					margin: [0, 0, 0, 15]
				},
				{
					text: [
						{
							text: `${languageObjectProp.data.myRecipes.newRecipe.form.longDes}: `, bold: true
						},
						`\n\n${dataProp.longDes}`
					],
					margin: [0, 0, 0, 15]
				},
				{
					text: [
						{
							text: `${languageObjectProp.data.myRecipes.newRecipe.form.prepTimeShort}: `, bold: true
						},
						`${hour === '0' ?
							`${minute} ${languageObjectProp.data.myRecipes.myRecipes.minuteText}` :
							`${hour} ${languageObjectProp.data.myRecipes.myRecipes.hourText} ${minute} ${languageObjectProp.data.myRecipes.myRecipes.minuteText}`}`
					],
					margin: [0, 0, 0, 6]
				},
				{
					text: [
						{
							text: `${languageObjectProp.data.myRecipes.newRecipe.form.dose}: `, bold: true
						},
						`${dataProp.dose}`
					],
					margin: [0, 0, 0, 6]
				},
				{
					text: [
						{
							text: `${languageObjectProp.data.myRecipes.newRecipe.form.cost}: `, bold: true
						},
						`${dataProp.cost} ${dataProp.currency}`
					],
					margin: [0, 0, 0, 6]
				},
			]
		};

		setTimeout(() => {
			if (print) {
				pdfMake.createPdf(docDefinition).print();
			} else {
				pdfMake.createPdf(docDefinition).download(`${fileName}.pdf`);
			}

		}, 1000);
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

		let urlToRecipe = `${this.props.dataProp.url}/recipe/${this.props.dataProp.recipeId}`;
		let urlToUser = `/user/${data.userId}`;

		return (
			<Grid item xs={12} className="recipe-preview-item">
				<Card className={classes.card}>
					<CardHeader className="recipe-card-header"
						avatar={
							<Tooltip title={languageObjectProp.data.myRecipes.tooltips.recipeDifficulty[data.difficulty]}>
								<Avatar aria-label="Recipe" className={classes.avatar} style={{ backgroundColor: difficultyColors[data.difficulty] }}>
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
					<div className="image-and-fav-btn-conrainer">
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
						<Tooltip placement="right" title={this.state.isFavourite ? languageObjectProp.data.myRecipes.tooltips.removeFromFav : languageObjectProp.data.myRecipes.tooltips.addToFav}>
							<div className="fav-icon-and-counter fav-icon-and-counter-on-recipe-preview">
								<Fab
									size="small"
									color="secondary"
									aria-label="heart"
									onClick={() => { this.handleToggleFavourite(data.recipeId, this.state.loggedInUserId) }}
								>
									{this.state.isFavourite ?
										<FavoriteIcon /> :
										<FavoriteBorderIcon />}
								</Fab>
								{this.state.favouriteCounter ? <div className="fav-counter fav-counter-rec-preview"><div>{this.numberFormatter(this.state.favouriteCounter)}</div></div> : ''}
							</div>
						</Tooltip>
						<Tooltip placement="right" title={languageObjectProp.data.myRecipes.tooltips.downloadRecipe}>
							<div className="download-icon download-icon-on-recipe-preview">
								<Fab
									size="small"
									color="primary"
									aria-label="download"
									onClick={() => { this.generatePdf(false) }}
								>
									<SaveAltIcon />
								</Fab>
							</div>
						</Tooltip>
					</div>
					{this.state.displayUserInfo ?
						<div className="user-container">
							<span>
								{this.state.isMine ? languageObjectProp.data.Favourites.yourRecipe : this.titleCase(this.state.username)}
							</span>
							<div
								className="user-picture"
								style={{ backgroundImage: `url(${this.state.profilePicUrl})` }}
							>
								<Fab className="user-btn" size="small" aria-label="User" component={Link} to={urlToUser}>
									{this.state.profilePicUrl ? '' : <div className="if-no-profile-image"><Face /></div>}
								</Fab>
							</div>
						</div> : ''
					}
				</Card>

				<Snackbar
					messageProp={this.state.snackbarMessage}
					typeProp={this.state.snackbarType}
					openProp={this.state.snackbarOpen}
					hideSnackbarProp={this.hideSnackbar}
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