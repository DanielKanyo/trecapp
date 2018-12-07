import React, { Component } from 'react';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

const styles = theme => ({
	card: {
		maxWidth: '100%',
		padding: '5px 18px 10px 18px'
	},
	textField: {
		width: '100%',
	},
	button: {
		margin: '8px 0px 8px',
		background: 'red',
		color: 'white',
		paddingLeft: 15,
		paddingRight: 15
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
});

const theme = createMuiTheme({
	typography: {
		useNextVariants: true,
	},
	palette: {
		primary: {
			light: '#f00',
			main: '#f00',
			dark: '#f00',
		}
	}
});

class BugReport extends Component {

	/**
	 * Constructor
	 * 
	 * @param {Object} props 
	 */
	constructor(props) {
		super(props);
		this.state = {
			bugText: ''
		};
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render() {
		const { classes } = this.props;

		return (
			<div className="ComponentContent">
				<Grid className="main-grid" container spacing={16}>
					<Grid item className="grid-component" xs={12}>
						<MuiThemeProvider theme={theme}>
							<Card className={classes.card}>
								<TextField
									id="bugreport-textfield"
									label="Report a bug"
									multiline
									rows="9"
									value={this.state.bugText}
									onChange={this.handleChange('bugText')}
									className={classes.textField}
									margin="normal"
									placeholder="Write your observation here..."
								/>
								<div className="bug-report-send-btn-container">
									<Button variant="contained" size="small" className={classes.button + ' report-send-btn'}>
										<SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
										Send Report
      					</Button>
								</div>
							</Card>
						</MuiThemeProvider>
					</Grid>
				</Grid>
			</div>
		)
	}
}

const authCondition = (authUser) => !!authUser;

BugReport.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(BugReport);