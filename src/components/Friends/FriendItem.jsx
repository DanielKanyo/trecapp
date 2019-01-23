import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import OpenInNew from '@material-ui/icons/OpenInNew';

const styles = theme => ({
	margin: {
		margin: theme.spacing.unit,
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

class FriendItem extends Component {
	render() {
		const { classes, friendDataProp } = this.props;

		return (
			<Grid item xs={4} className="friend-item">

				<MuiThemeProvider theme={theme}>
					<Paper className="friend-item-content">
						<div className="friend-item-actions-container">
							<Fab 
								size="small" 
								color="primary" 
								aria-label="Add" 
								className={classes.margin}
								component={Link} 
								to={`${ROUTES.USER}/${friendDataProp.key}`}
							>
								<OpenInNew />
							</Fab>
						</div>
						<div className="friend-item-img-container" style={{ backgroundImage: `url(${friendDataProp.friendData.profilePicUrl})` }}></div>
						<div className="friend-item-detail-username">{friendDataProp.friendData.username}</div>
					</Paper>
				</MuiThemeProvider>
			</Grid>
		)
	}
}

const authCondition = (authUser) => !!authUser;

FriendItem.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(FriendItem);