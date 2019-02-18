import React, { Component } from 'react';
import { db } from '../../firebase';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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

class Friends extends Component {

	/**
	 * Constructor
	 * 
	 * @param {Object} props
	 */
	constructor(props) {
		super(props);
		this.state = {
			friends: [],
			loading: true,
			loggedInUserId: ''
		};
	}

	componentDidMount = () => {
		this.mounted = true;

		let authObject = JSON.parse(localStorage.getItem('authUser'));
		let loggedInUserId = authObject.id;

		db.users().once('value').then(usersRef => {

			db.getFriends(loggedInUserId).once('value').then(friendsRes => {
				if (this.mounted) {

					let users = usersRef.val();
					let friends = friendsRes.val();
					let previousFriends = this.state.friends;

					if (users) {
						for (let key in users) {
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
							}
						}
					}

					this.setState({
						friends: previousFriends,
						loggedInUserId,
						loading: false
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
		const { classes, languageObjectProp } = this.props;
		let { friends, loading } = this.state;

		return (
			<div className="ComponentContent">
				<Grid className="main-grid" container spacing={16}>

					<Grid item className="grid-component" xs={12}>
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

						<Grid container spacing={16}>
							{
								loading && <Grid item className="grid-component" xs={12}><LinearProgress classes={{ colorPrimary: classes.progressLine, barColorPrimary: classes.progressBar }} /></Grid>
							}

							{friends.length === 0 && !loading ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

							{friends.map((friend, index) => {
								return friend;
							})}
						</Grid>

						<MyPagination />
					</Grid>
				</Grid>
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