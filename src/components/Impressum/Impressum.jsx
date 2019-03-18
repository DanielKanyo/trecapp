import React from 'react';

import withAuthorization from '../Session/withAuthorization';
import withEmailVerification from '../Session/withEmailVerification';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AttachFile from '@material-ui/icons/AttachFile';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
	card: {
		maxWidth: '100%',
		padding: '10px 18px',
		marginBottom: 14
	},
	paper: {
		textAlign: 'center',
		color: theme.palette.text.secondary,
		marginBottom: '14px'
	},
	divider: {
		margin: '8px 0px'
	}
});

const Impressum = (props) => {
	const { classes, languageObjectProp } = props;

	return (
		<div className={"ComponentContent Impressum"}>
			<Grid className="main-grid" container spacing={16}>
				<Grid item className="grid-component" xs={12}>
					<Paper className={classes.paper + ' paper-title paper-title-impressum'}>
						<div className="paper-title-icon">
							<AttachFile />
						</div>
						<div className="paper-title-text">
							{languageObjectProp.data.Impressum.title}
						</div>
					</Paper>
					<Grid item className="grid-component" xs={12}>
						<Card className={classes.card + ' impressum-card'}>
							<Typography className="title-imp" variant="h6">
								{languageObjectProp.data.Impressum.responsiblePerson}
							</Typography>
							<div className="imp-text">
								<ul>
									<li>Daniel Kanyo</li>
								</ul>
							</div>

							<Divider className={classes.divider} />

							<Typography className="title-imp" variant="h6">
								{languageObjectProp.data.Impressum.contact}
							</Typography>
							<div className="imp-text">
								<ul>
									<li>danielkanyo992@gmail.com</li>
									<li><a href="http://danielkanyo.hu" target="_blank" rel="noopener noreferrer">danielkanyo.hu</a></li>
								</ul>
							</div>

							<Divider className={classes.divider} />

							<Typography className="title-imp" variant="h6">
								{languageObjectProp.data.Impressum.hostingProvider}
							</Typography>
							<div className="imp-text">
								<ul>
									<li>
										<a href="https://firebase.google.com/support/privacy/" target="_blank" rel="noopener noreferrer">Firebase</a>
									</li>
								</ul>
							</div>
						</Card>

						<Card className={classes.card + ' impressum-card'}>
							<Typography className="title-imp" variant="h6">
								{languageObjectProp.data.Impressum.dataStore}
							</Typography>
							<div className="imp-text">
								<ul>
									<li>{languageObjectProp.data.Impressum.emailAddress}</li>
								</ul>
							</div>
						</Card>

						<Card className={classes.card + ' impressum-card'}>
							<Typography className="title-imp" variant="h6">
								{languageObjectProp.data.Impressum.aboutCookies}
							</Typography>
							<div className="imp-text">
								<ul>
									<li>
										<a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank" rel="noopener noreferrer">Cookie</a>
									</li>
									<li>
										{languageObjectProp.data.Impressum.cookieStore}
									</li>
								</ul>
							</div>
						</Card>
					</Grid>
				</Grid>
			</Grid>
		</div>
	)
}

const authCondition = (authUser) => !!authUser;

Impressum.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withEmailVerification, withStyles(styles))(Impressum);