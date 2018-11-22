import React, { Component } from 'react';
import '../App/index.css';
// import { auth, db } from '../../firebase';
import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LocalDining from '@material-ui/icons/LocalDining';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
	paper: {
		padding: theme.spacing.unit * 2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		marginBottom: '14px'
	},
	chip: {
		background: '#00925d',
		color: 'white'
	}
});

class FullSizeRecipe extends Component {

	/**
    * Constructor
    * 
    * @param {Object} props 
    */
	constructor(props) {
		super(props);
		this.state = {
			category: this.props.match.params.category,
			recipeId: this.props.match.params.id,
			recipeTitle: 'Recipe Title',
			recipeCategory: 'Category'
		};
	}

	componentDidMount() {
		this.mounted = true;

		if (this.mounted) {
			// console.log('asd');
		}
	}

	/**
   * Sets 'mounted' property to false to ignore warning 
   */
	componentWillUnmount() {
		this.mounted = false;
	}

	render() {
		const { classes } = this.props;
		const { languageObjectProp } = this.props;

		return (
			<div className="ComponentContent">

				<Grid className="main-grid" container spacing={16}>
					<Grid item className="grid-component" xs={12}>
						<Paper className={classes.paper + ' paper-title paper-title-fullrecipe'}>
							<div className="paper-title-icon">
								<LocalDining />
							</div>
							<div className="paper-title-text">
								{this.state.recipeTitle}
							</div>
							<div className="number-of-recipes">
								<Tooltip title={languageObjectProp.data.myRecipes.tooltips.categoryText}>
									<Chip
										label={this.state.recipeCategory}
										className={classes.chip} />
								</Tooltip>
							</div>
						</Paper>

						{this.state.category + ', ' + this.state.recipeId}
					</Grid>
				</Grid>
			</div>
		)
	}
}

const authCondition = (authUser) => !!authUser;

FullSizeRecipe.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(FullSizeRecipe);