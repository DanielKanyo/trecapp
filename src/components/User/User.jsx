import React, { Component } from 'react';
import '../App/index.css';
import { db } from '../../firebase';
import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import RecipePreview from '../Categories/RecipePreview';
import { dataEng } from '../../constants/languages/eng';

const styles = theme => ({
	paper: {
		padding: 20,
		position: 'relative'
	},
	paperProfilePictureContainer: {
		width: 220,
		height: 220,
		borderRadius: 4,
	},
	paperProfilePicture: {
		width: '100%',
		height: '100%',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
	}
});

class User extends Component {

	constructor(props) {
		super(props);
		this.state = {
			userId: this.props.match.params.id,
			userData: '',
			recipes: [],
			recipeCounter: 0,
		}
	}

	componentDidMount = () => {
		this.mounted = true;

		let recipeCounter = this.state.recipeCounter;

		let authObject = JSON.parse(localStorage.getItem('authUser'));
		let loggedInUserId = authObject.id;

		let previousRecipes = this.state.recipes;

		db.user(this.state.userId).once('value').then(snapshot => {
			if (this.mounted) {
				let userData = snapshot.val();

				this.setState({
					userData
				});

				db.getRecipes().then(resRecipes => {
					let recipes = resRecipes;

					for (let key in recipes) {
						if (this.state.userId === recipes[key].userId) {
							let recipe = recipes[key];

							let username = userData.username;
							let profilePicUrl = userData.profilePicUrl;

							let isMine = false;

							if (recipe.publicChecked) {
								let favouritesObject = recipes[key].favourites;
								let isFavourite = !favouritesObject ? false : favouritesObject.hasOwnProperty(loggedInUserId) ? true : false;

								let categoryItems = dataEng.data.myRecipes.newRecipe.categoryItems;
								let categoryNameEng = categoryItems[recipe.category];
								let url = `/categories/${categoryNameEng.charAt(0).toLowerCase() + categoryNameEng.slice(1)}`;

								let data = {
									loggedInUserId: loggedInUserId,
									recipeId: key,
									imageUrl: recipe.imageUrl,
									title: recipe.title,
									creationTime: recipe.creationTime,
									sliderValue: recipe.sliderValue,
									displayUserInfo: false,
									username: username,
									isMine: isMine,
									profilePicUrl: profilePicUrl,
									isFavourite: isFavourite,
									favouriteCounter: recipes[key].favouriteCounter,
									userId: recipe.userId,
									url
								}

								recipeCounter++;

								previousRecipes.unshift(
									<RecipePreview
										key={key}
										dataProp={data}
										languageObjectProp={this.props.languageObjectProp}
									/>
								)
							}
						}
						this.setState({
							recipes: previousRecipes,
							recipeCounter
            });
					}
				})
			}
		})
	}

	/**
	 * Sets 'mounted' property to false to ignore warning 
	 */
	componentWillUnmount() {
		this.mounted = false;
	}

	render() {
		const { classes, languageObjectProp } = this.props;
		const { userData } = this.state;

		return (
			<div className="ComponentContent UserContent">
				<Grid className="main-grid" container spacing={16}>
					<Grid item className="grid-component" xs={12}>
						<div className={'user-cover-container'}>
							<div className="header-user-details-container">
								<div className="header-prof-pic-container">
									<Paper className={classes.paperProfilePictureContainer}>
										<div className={classes.paperProfilePicture} style={{ backgroundImage: `url(${userData.profilePicUrl})` }}></div>
									</Paper>
								</div>
								<div className="header-user-details-text-container">
									<div>
										<div>
											<div className="username">{userData.username}</div>
											<div className="roles-container">
												{userData.roles ? 
													<span className="role role-admin">
														{userData.roles[0]}
													</span> : ''
												}
												<span className="role">
													USER
												</span>
											</div>
										</div>
										<div>
											{this.state.recipeCounter}
										</div>
									</div>
									<div>Nincs leírás</div>
								</div>
							</div>
						</div>

						<Grid container spacing={16}>
							{this.state.recipes.length === 0 ? <EmptyList /> : ''}

							{this.state.recipes.map((recipe, index) => {
								return recipe;
							})}
						</Grid>

					</Grid>
				</Grid>
			</div>
		)
	}
}

const EmptyList = () =>
	<Grid item xs={12}>
		<div className="empty-container">
			Empty
    </div>
	</Grid>

const authCondition = (authUser) => !!authUser;

User.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(User);