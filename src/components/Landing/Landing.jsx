import React from 'react';
import './Landing.css';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import withEmailVerification from '../Session/withEmailVerification';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';

const styles = theme => ({
  card: {
    maxWidth: '100%',
    marginBottom: '10px',
    padding: '20px'
  },
  button: {
    margin: 4,
    padding: '14px 20px'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#eca900',
      contrastText: '#fff',
    }
  }
});

const LandingPage = (props) => {
  const { classes, isAuthenticatedProp } = props;

  return (
    <div className={isAuthenticatedProp ? "ComponentContent" : 'LandingComponent'}>
      <div className={isAuthenticatedProp ? 'landing-component-container' : ''}>
        <Card className={classes.card + " landing-title"}>
          <div className="welcome-container">
            <div>
              <div className="landing-logo"></div>
            </div>
            <div className={classes.buttonContainer + ' landing-btn-container'}>

              <MuiThemeProvider theme={theme}>
                {
                  isAuthenticatedProp ?
                    <div>
                      <Button component={Link} to={ROUTES.ACCOUNT} variant="outlined" color="primary" className={classes.button}>
                        Languages
                      </Button>
                      <Button component={Link} to={ROUTES.MYRECIPES} variant="outlined" color="primary" className={classes.button}>
                        My recipes
                      </Button>
                    </div> :
                    <div>
                      <Button component={Link} to={ROUTES.SIGN_IN} variant="outlined" color="primary" className={classes.button}>
                        Sign In
                      </Button>
                      <Button component={Link} to={ROUTES.SIGN_UP} variant="outlined" color="primary" className={classes.button}>
                        Sign Up
                      </Button>
                    </div>
                }

              </MuiThemeProvider>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

LandingPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withEmailVerification, withStyles(styles))(LandingPage);