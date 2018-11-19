import React, { Component } from 'react';
// import { db, auth } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';

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

const styles = theme => ({
	card: {
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

		};
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

		return (
			<Grid item xs={6} className="category-item">
				<Card className={classes.card}>
					<CardHeader
						avatar={
							<Tooltip title={languageObjectProp.data.myRecipes.tooltips.recipeDifficulty[data.sliderValue]}>
								<Avatar aria-label="Recipe" className={classes.avatar} style={{ backgroundColor: difficultyColors[data.sliderValue] }}>
									{titleCharacters[0]}
								</Avatar>
							</Tooltip>
						}
						action={
							<IconButton>
								<OpenInNew />
							</IconButton>
						}
						title={data.title}
						subheader={creationTime}
					/>
					<CardMedia
						className={classes.media}
						image={data.imageUrl}
						title={data.title}
					/>
				</Card>
			</Grid>
		)
	}
}

const authCondition = (authUser) => !!authUser;

RecipePreview.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(RecipePreview);