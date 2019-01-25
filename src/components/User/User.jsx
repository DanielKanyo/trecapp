import React, { Component } from 'react';
import '../App/index.css';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import RecipePreview from '../Categories/RecipePreview';
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import FaceIcon from '@material-ui/icons/Face';
import Tooltip from '@material-ui/core/Tooltip';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import HowToRegIcon from '@material-ui/icons/HowToReg';

import { dataEng } from '../../constants/languages/eng';
import { ToastContainer } from 'react-toastify';

const styles = theme => ({
	paper: {
		padding: 20,
		position: 'relative'
	},
	paperProfilePictureContainer: {
		width: 220,
		height: 220,
		borderRadius: 4,
		background: '#898989',
	},
	paperProfilePicture: {
		width: '100%',
		height: '100%',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		borderRadius: 4
	},
	settings: {
		position: 'absolute',
		top: 0,
		display: 'flex',
		flexDirection: 'column'
	},
	settingsBtn: {
		margin: 8,
		marginBottom: 0,
		color: 'rgba(0, 0, 0, 0.6)',
		zIndex: 10
	},
	friendBtn: {
		margin: 8,
		color: 'rgba(0, 0, 0, 0.6)',
		zIndex: 10
	},
	friendActiveBtn: {
		margin: 8,
		color: 'white',
		zIndex: 10,
		backgroundColor: '#099b63'
	},
	icon: {
		fontSize: 180
	},
	paperUserDetails: {
		margin: 8,
		padding: '10px 15px',
		background: 'rgba(0, 0, 0, 0.3)',
		fontSize: 18,
		textTransform: 'uppercase',
		color: 'white'
	},
	paperUserAbout: {
		marginTop: 8,
		padding: '15px 15px',
		color: '#545454'
	}
});

class User extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedInUserId: '',
			userId: this.props.match.params.id,
			userData: '',
			recipes: [],
			recipeCounter: 0,
			isMe: false,
			isMyFriend: false,
		}
	}

	componentDidMount = () => {
		this.mounted = true;

		let authObject = JSON.parse(localStorage.getItem('authUser'));
		let loggedInUserId = authObject.id;
		let isMyFriend;

		db.user(loggedInUserId).once('value').then(loggedInUserRes => {
			let loggedInUserData = loggedInUserRes.val();

			db.user(this.state.userId).once('value').then(userRes => {
				if (this.mounted) {

					if (loggedInUserData.friends && loggedInUserData.friends.hasOwnProperty(this.state.userId)) {
						isMyFriend = true;
					} else {
						isMyFriend = false;
					}

					if (loggedInUserId === this.state.userId) {
						this.setState({
							isMe: true
						});
					}

					let userData = userRes.val();

					this.setState({
						userData
					});

					db.getRecipes().then(resRecipes => {
						let previousRecipes = this.state.recipes;
						let recipeCounter = this.state.recipeCounter;
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
										...recipes[key],
										loggedInUserId: loggedInUserId,
										recipeId: key,
										imageUrl: recipe.imageUrl,
										title: recipe.title,
										creationTime: recipe.creationTime,
										difficulty: recipe.difficulty,
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
						}

						this.setState({
							recipes: previousRecipes,
							recipeCounter,
							loggedInUserId,
							isMyFriend
						});
					});
				}
			});
		});
	}

	/**
	 * Reload component if url parameter changed
	 */
	componentWillReceiveProps = (nextProps) => {
		if (nextProps.match.params.id) {
			this.setState({
				userId: nextProps.match.params.id,
				userData: '',
				recipes: [],
				recipeCounter: 0,
			}, this.componentDidMount());
		}
	}

	/**
	 * Sets 'mounted' property to false to ignore warning 
	 */
	componentWillUnmount() {
		this.mounted = false;
	}

	/**
	 * Add or remove user to/from the friends list
	 */
	toggleFriend = (userId) => {
		const { loggedInUserId } = this.state;
		let { isMyFriend } = this.state;

		if (isMyFriend) {
			db.toggleFriend(loggedInUserId, userId).then(friendRes => {
				this.setState({
					isMyFriend: false
				});
			});
		} else {
			db.toggleFriend(loggedInUserId, userId).then(friendRes => {
				this.setState({
					isMyFriend: true
				});
			});
		}
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
										{userData.profilePicUrl ? <div className={classes.paperProfilePicture} style={{ backgroundImage: `url(${userData.profilePicUrl})` }}></div> :
											<div className="user-prof-pic-in-user-comp"><FaceIcon className={classes.icon} /></div>
										}
									</Paper>
									<div className={classes.settings}>
										{
											this.state.isMe ?
												<Fab component={Link} to={ROUTES.ACCOUNT} size="small" aria-label="Add" className={classes.settingsBtn}>
													<SettingsIcon />
												</Fab> : ''
										}
										{
											!this.state.isMe ?
												<div>
													{
														this.state.isMyFriend ?
															<Tooltip placement="right" title={userData.username + " " + languageObjectProp.data.Friends.myFriend}>
																<Fab
																	size="small"
																	aria-label="Friend"
																	className={classes.friendActiveBtn + ' active-friend-btn'}
																	onClick={() => { this.toggleFriend(this.state.userId) }}
																>
																	<HowToRegIcon />
																</Fab>
															</Tooltip>
															:
															<Tooltip placement="right" title={languageObjectProp.data.Friends.addToFriends}>
																<Fab
																	size="small"
																	aria-label="Friend"
																	className={classes.friendBtn}
																	onClick={() => { this.toggleFriend(this.state.userId) }}
																>
																	<PersonAddIcon />
																</Fab>
															</Tooltip>
													}
												</div>
												: ''
										}
									</div>
									<div className="user-details-container-for-mobile">
										<Paper className={classes.paperUserDetails} elevation={1}>
											{userData.username}
											<div className="roles-container">
												{userData.roles ?
													<span className="role role-admin">
														{userData.roles[0]}
													</span> : ''
												}
												<span className="role">
													USER
												</span>
												<Tooltip
													title={this.state.isMe ? languageObjectProp.data.myRecipes.tooltips.numOfRecipes : languageObjectProp.data.myRecipes.tooltips.numOfHisRecipes}
												>
													<span className="num-of-recipes-user-chip">
														{this.state.recipeCounter}
													</span>
												</Tooltip>
											</div>
										</Paper>
									</div>
								</div>
								<div className="user-about-container-for-mobile">
									<Paper className={classes.paperUserAbout} elevation={1}>
										{userData.about ? userData.about : languageObjectProp.data.User.emptyAbout}
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
												<Tooltip
													title={this.state.isMe ? languageObjectProp.data.myRecipes.tooltips.numOfRecipes : languageObjectProp.data.myRecipes.tooltips.numOfHisRecipes}
												>
													<span className="num-of-recipes-user-chip">
														{this.state.recipeCounter}
													</span>
												</Tooltip>
											</div>
										</div>
									</div>
									<div>
										<div className="user-about-container">
											{userData.about ? userData.about : languageObjectProp.data.User.emptyAbout}
										</div>
									</div>
								</div>
							</div>
						</div>

						<Grid container spacing={16}>
							{this.state.recipes.length === 0 ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

							{this.state.recipes.map((recipe, index) => {
								return recipe;
							})}
						</Grid>

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

const EmptyList = (props) =>
	<Grid item xs={12}>
		<div className="empty-container">
			{props.languageObjectProp.data.emptyList}
		</div>
	</Grid>

const authCondition = (authUser) => !!authUser;

User.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(User);