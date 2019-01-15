import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({});

class IngredientItem extends Component {

	handleDeleteIngredient = (index) => {
		this.props.handleDeleteIngredientProp(index);
	}

	render() {
		const value = this.props.ingredientProp;
		const index = this.props.indexProp;

		return (
			<Paper className={'ingredient-item-container'} elevation={1}>
				<div>
					<div className="ingredient-value-container">
						<Typography component="p">
							{value}
						</Typography>
					</div>
					<div className="delete-ingredient-container" onClick={() => {this.handleDeleteIngredient(index)}}>
						<CloseIcon />
					</div>
				</div>
			</Paper>
		)
	}
}

IngredientItem.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IngredientItem);