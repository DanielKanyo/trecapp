import React, { Component } from 'react';
import { db } from '../../firebase';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import compose from 'recompose/compose';
import People from '@material-ui/icons/People';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import FriendItem from './FriendItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import MyPagination from '../Pagination/MyPagination';

const styles = theme => ({
	chip: {
		background: '#058956',
		color: 'white'
	},
	progressLine: {
		borderRadius: '4px',
	},
	progressBar: {
		background: '#099b63'
	},
});

const theme = createMuiTheme({
	typography: {
		useNextVariants: true,
	},
	palette: {
		primary: {
			light: '#099b63',
			main: '#099b63',
			dark: '#099b63',
			contrastText: '#fff',
		}
	}
});

const constants = {
	DEFAULT_NUMBER_OF_FRIENDS: 20
}

class Friends extends Component {

	/**
	 * Constructor
	 * 
	 * @param {Object} props
	 */
	constructor(props) {
		const locationObject = new URL(window.location.href);
		let pageId = locationObject.searchParams.get('pageId');

		if (pageId === null) {
			props.history.push({
				search: '?pageId=1'
			});

			pageId = 1;
		}

		super(props);
		this.state = {
			friends: [],
			loading: true,
			loggedInUserId: '',
			numberOfPages: null,
			pageId,
			friendsTotal: [],
		};
	}

	componentDidMount = () => {
		this.mounted = true;

		let authObject = JSON.parse(localStorage.getItem('authUser'));
		let loggedInUserId = authObject.id;
		let lengthCounter = 0;

		db.users().once('value').then(usersRef => {

			db.getFriends(loggedInUserId).once('value').then(friendsRes => {
				if (this.mounted) {

					let users = usersRef.val();
					let friends = friendsRes.val();
					let previousFriends = this.state.friends;

					if (users) {
						Object.keys(users).forEach(key => {
							if (friends && friends.hasOwnProperty(key)) {
								let data = {
									friendData: users[key],
									isMyFriend: true,
									key,
									loggedInUserId
								}
								previousFriends.push(
									<FriendItem
										friendDataProp={data}
										key={key}
										languageObjectProp={this.props.languageObjectProp}
									/>
								)

								lengthCounter++;
							}
						});
					}

					let counter = 0;
					let friendsPerPage = [];
					let friendsTotal = [];

					for (let i = 0; i < previousFriends.length; i++) {
						friendsPerPage.push(previousFriends[i]);
						counter++;

						if (counter === constants.DEFAULT_NUMBER_OF_FRIENDS) {
							friendsTotal.push(friendsPerPage);
							friendsPerPage = [];
							counter = 0;
						}
					}

					if (friendsPerPage.length > 0) {
						friendsTotal.push(friendsPerPage);
					}

					let numberOfPages = Math.ceil(lengthCounter / constants.DEFAULT_NUMBER_OF_FRIENDS);

					this.setState({
						friends: previousFriends,
						loggedInUserId,
						loading: false,
						numberOfPages,
						friendsTotal,
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

	/**
	 * Pagination button clicked
	 */
	pagBtnClicked = (pageId) => {
		let newParam = `?pageId=${pageId}`;

		this.props.history.push({
			search: newParam
		});

		this.setState({
			pageId
		});
	}

	render() {
		const { classes, languageObjectProp } = this.props;
		let { friends, loading, friendsTotal, pageId, numberOfPages } = this.state;

		return (
			<div className="ComponentContent">
				<MuiThemeProvider theme={theme}>
					<Grid className="main-grid" container spacing={2}>

						<Grid item className="grid-component friends-grid-component" xs={12}>
							<div>
								<Paper className={classes.paper + ' paper-title paper-title-friends'}>
									<div className="paper-title-icon">
										<People />
									</div>
									<div className="paper-title-text">
										{languageObjectProp.data.menuItems[11]}
									</div>
									<div className="number-of-friends">
										<Tooltip title={languageObjectProp.data.Favourites.numOfFavRecipes}>
											<Chip label={friends.length} className={classes.chip} />
										</Tooltip>
									</div>
								</Paper>

								<Grid container spacing={2}>
									{
										loading && <Grid item className="grid-component" xs={12}><LinearProgress classes={{ colorPrimary: classes.progressLine, barColorPrimary: classes.progressBar }} /></Grid>
									}

									{friends.length === 0 && !loading ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

									{friendsTotal[pageId - 1] && friendsTotal[pageId - 1].map((friend, index) => {
										return friend;
									})}
								</Grid>
							</div>
							{
								!loading && numberOfPages > 1 &&
								<MyPagination
									pagBtnClickedProp={this.pagBtnClicked}
									totalProp={numberOfPages}
									activePageProp={pageId}
								/>
							}
						</Grid>
					</Grid>
				</MuiThemeProvider>
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

Friends.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(Friends);