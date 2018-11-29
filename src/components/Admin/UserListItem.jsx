import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Details from '@material-ui/icons/Details';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import LaunchIcon from '@material-ui/icons/Launch';

const styles = theme => ({
	button: {
		margin: 0,
	},
	userPaper: {
		width: '100%',
		marginBottom: 10,
	},
	avatar: {
		marginRight: 20,
		width: 60,
		height: 60,
	},
	icon: {
		fontSize: 32
	},
	closeBtn: {
		margin: '6px 12px'
	},
	margin: {
    margin: 6,
  },
});

class UserListItem extends Component {
	state = {
		anchorEl: null,
		open: false
	};

	handleClickMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleCloseMore = () => {
		this.setState({ anchorEl: null });
	};

	handleClickOpenDialog = () => {
		this.setState({ open: true });
	};

	handleCloseDialog = () => {
		this.setState({ open: false });
	};

	render() {
		const { anchorEl } = this.state;
		const { dataProp, languageObjectProp, classes, fullScreen, idProp } = this.props;

    let urlToUser = `/user/${idProp}`;

		return (
			<Paper className={classes.userPaper}>
				<div className="user-info-container">
					<div>
						{dataProp.username}
					</div>
					<div>
						<IconButton
							className={classes.button}
							aria-owns={anchorEl ? 'simple-menu' : undefined}
							aria-haspopup="true"
							onClick={this.handleClickMenu}
						>
							<MoreVert />
						</IconButton>
					</div>
				</div>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={this.handleCloseMore}
				>
					<MenuItem className={classes.menuItem} onClick={() => { this.handleCloseMore(); this.handleClickOpenDialog() }}>
						<ListItemIcon className={classes.icon}>
							<Details />
						</ListItemIcon>
						<ListItemText
							classes={{ primary: classes.primary }}
							inset
							primary={languageObjectProp.data.Admin.details}
						/>
					</MenuItem>
				</Menu>

				<Dialog
					fullScreen={fullScreen}
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="responsive-dialog-title"
					className="user-dialog"
				>
					<div className="open-user-btn-container">
						<IconButton aria-label="Delete" className={classes.margin} component={Link} to={urlToUser}>
							<LaunchIcon />
						</IconButton>
					</div>
					<DialogTitle id="responsive-dialog-title">
						<div className="dialog-title-name-and-pic">
							<div>
								{dataProp.profilePicUrl ?
									<Avatar alt="Remy Sharp" src={dataProp.profilePicUrl} className={classes.avatar} /> :
									<Avatar className={classes.avatar}><FaceIcon className={classes.icon} /></Avatar>
								}
							</div>
							<div className="username-container">
								{dataProp.username}
							</div>
						</div>
					</DialogTitle>
					<DialogContent>
						<div className="user-details-container">
							<div>ID</div>
							<div>{idProp}</div>
						</div>
						<div className="user-details-container">
							<div>E-mail</div>
							<div>{dataProp.email}</div>
						</div>
						<div className="user-details-container">
							<div>{languageObjectProp.data.Admin.roles}</div>
							<div>{dataProp.roles ? dataProp.roles[0] : 'USER'}</div>
						</div>
						<div className="user-details-container">
							<div>{languageObjectProp.data.Admin.language}</div>
							<div>{dataProp.language ? dataProp.language : 'eng'}</div>
						</div>
					</DialogContent>
					<DialogActions>
						<Button className={classes.closeBtn} onClick={this.handleCloseDialog} variant="contained" color="primary" autoFocus>
							{languageObjectProp.data.Admin.close}
						</Button>
					</DialogActions>
				</Dialog>

			</Paper>
		)
	}
}

const authCondition = (authUser) => !!authUser;

UserListItem.propTypes = {
	classes: PropTypes.object.isRequired,
	fullScreen: PropTypes.bool.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles), withMobileDialog())(UserListItem);