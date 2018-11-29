import React, { Component } from 'react';
import '../App/index.css';
import { db } from '../../firebase';
import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
	paper: {
		padding: 20,
		position: 'relative'
	},
	paperProfilePicture: {
		width: 160,
		height: 160,
		borderRadius: 4,
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
	},
});

class User extends Component {

	constructor(props) {
		super(props);
		this.state = {
			userId: this.props.match.params.id,
			userData: '',
			recipes: [],
		}
	}

	componentDidMount = () => {
		this.mounted = true;

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

							console.log(recipes[key]);

						}
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
									<Paper
										className={classes.paperProfilePicture}
										style={{ backgroundImage: `url(${userData.profilePicUrl})` }}
									></Paper>
								</div>
								<div className="header-user-details-text-container">
									<div>
										<div>{userData.username}</div>
										<div><Chip label="15" className={classes.chip} /></div>
									</div>
									<div>Nincs leírás</div>
								</div>
							</div>
						</div>
					</Grid>
				</Grid>
			</div>
		)
	}
}

const authCondition = (authUser) => !!authUser;

User.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(User);