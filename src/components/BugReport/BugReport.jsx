import React, { Component } from 'react';
import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import compose from 'recompose/compose';
import { db } from '../../firebase';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

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

	sendBugReport = () => {
		let authObject = JSON.parse(localStorage.getItem('authUser'));
		let loggedInUserId = authObject.id;

		let text = this.state.bugText;
		let timestamp = new Date().getTime();

		if (text) {
			db.saveBugReport(loggedInUserId, text, timestamp).then(res => {

				toast.success(this.props.languageObjectProp.data.BugReport.toaster.bugSaved);

				this.setState({
					bugText: ''
				});

			});
		}
	}

	render() {
		const { classes, languageObjectProp } = this.props;

		let disabled = this.state.bugText === '' ? true : false;

		return (
			<div className="ComponentContent">
				<Grid className="main-grid" container spacing={16}>
					<Grid item className="grid-component" xs={12}>
						<MuiThemeProvider theme={theme}>
							<Card className={classes.card}>
								<TextField
									id="bugreport-textfield"
									label={languageObjectProp.data.BugReport.label}
									multiline
									rows="9"
									value={this.state.bugText}
									onChange={this.handleChange('bugText')}
									className={classes.textField}
									margin="normal"
									placeholder={languageObjectProp.data.BugReport.placeholder}
								/>
								<div className="bug-report-send-btn-container">
									<Button
										onClick={this.sendBugReport}
										variant="contained"
										size="small"
										className={classes.button + ' report-send-btn'}
										disabled={disabled}
									>
										<SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
										{languageObjectProp.data.BugReport.btnText}
									</Button>
								</div>
							</Card>
						</MuiThemeProvider>
					</Grid>
				</Grid>

				<ToastContainer
					position="top-right"
					autoClose={2500}
					hideProgressBar
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnVisibilityChange
					pauseOnHover
				/>
			</div>
		)
	}
}

const authCondition = (authUser) => !!authUser;

BugReport.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(BugReport);