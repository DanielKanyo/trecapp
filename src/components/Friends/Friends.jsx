import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import People from '@material-ui/icons/People';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
	chip: {
		background: '#058956',
		color: 'white'
	}
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
			friends: []
		};
	}

	render() {
		const { classes, languageObjectProp } = this.props;
		let { friends } = this.state;

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
							{friends.length === 0 ? <EmptyList languageObjectProp={languageObjectProp} /> : ''}

							{friends.map((friend, index) => {
								return friend;
							})}
						</Grid>
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

export default compose(withAuthorization(authCondition), withStyles(styles))(Friends);