import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import OpenInNew from '@material-ui/icons/OpenInNew';
import FaceIcon from '@material-ui/icons/Face';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import Tooltip from '@material-ui/core/Tooltip';
import { db } from '../../firebase';

const styles = theme => ({
	margin: {
		margin: theme.spacing(),
		marginBottom: 0
	},
	friendBtn: {
		margin: 8,
		marginBottom: 0,
		color: 'rgba(0, 0, 0, 0.6)',
		zIndex: 10
	},
	friendActiveBtn: {
		margin: 8,
		marginBottom: 0,
		color: 'white',
		zIndex: 10,
		backgroundColor: '#099b63'
	},
});

class FriendItem extends Component {

	/**
	 * Constructor
	 * 
	 * @param {Object} props
	 */
	constructor(props) {
		super(props);
		this.state = {
			isMyFriend: props.friendDataProp.isMyFriend,
			loggedInUserId: props.friendDataProp.loggedInUserId
		};
	}

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
		const { classes, friendDataProp, languageObjectProp } = this.props;
		const userId = friendDataProp.key;

		return (
			<Grid item xs={4} className="friend-item">
				<Paper className="friend-item-content">
					<div className="friend-item-actions-container">
						<Tooltip placement="right" title={languageObjectProp.data.Friends.openFriend}>
							<Fab
								size="small"
								color="primary"
								aria-label="Add"
								className={classes.margin}
								component={Link}
								to={`${ROUTES.USER}/${userId}`}
							>
								<OpenInNew />
							</Fab>
						</Tooltip>
						{
							this.state.isMyFriend ?
								<Tooltip placement="right" title={friendDataProp.friendData.username + " " + languageObjectProp.data.Friends.myFriend}>
									<Fab
										size="small"
										aria-label="Friend"
										className={classes.friendActiveBtn + ' active-friend-btn-on-friends-page'}
										onClick={() => { this.toggleFriend(userId) }}
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
										onClick={() => { this.toggleFriend(userId) }}
									>
										<PersonAddIcon />
									</Fab>
								</Tooltip>
						}
					</div>
					{
						friendDataProp.friendData.profilePicUrl ?
							<div className="friend-item-img-container" style={{ backgroundImage: `url(${friendDataProp.friendData.profilePicUrl})` }}></div>
							:
							<div className="friend-item-img-container">
								<FaceIcon />
							</div>
					}
					<div className="friend-item-detail-username">{friendDataProp.friendData.username}</div>
				</Paper>
			</Grid>
		)
	}
}

const authCondition = (authUser) => !!authUser;

FriendItem.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(FriendItem);