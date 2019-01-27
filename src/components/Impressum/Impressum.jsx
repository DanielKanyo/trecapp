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
		padding: '10px 18px'
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
		<div className={"ComponentContent"}>
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
						<Card className={classes.card}>
							<Typography variant="h6">
								Felelős személy / Fejlesztő
      				</Typography>
							<div className="imp-text">
								<ul>
									<li>Kanyó Dániel</li>
								</ul>
							</div>

							<Divider className={classes.divider} />

							<Typography variant="h6">
								Elérhetőség
      				</Typography>
							<div className="imp-text">
								<ul>
									<li>+36 30 7792953</li>
									<li>+381 64 2735861</li>
									<li>6723 Szeged, Tabán utca 38</li>
									<li>danielkanyo992@gmail.com</li>
									<li><a href="http://danielkanyo.hu" target="_blank" rel="noopener noreferrer">danielkanyo.hu</a></li>
								</ul>
							</div>

							<Divider className={classes.divider} />

							<Typography variant="h6">
								Tárhely szolgáltató
      				</Typography>
							<div className="imp-text">
								<ul>
									<li>
										<a href="https://firebase.google.com/support/privacy/" target="_blank" rel="noopener noreferrer">Firebase</a>
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