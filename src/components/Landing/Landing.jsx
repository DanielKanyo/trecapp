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
    margin: 8,
    marginBottom: 10,
  },
  button: {
    margin: 4,
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
      main: '#fff',
      contrastText: '#fff',
    }
  }
});

const LandingPage = (props) => {
  const { classes, isAuthenticatedProp } = props;

  return (
    <div className={isAuthenticatedProp ? "ComponentContent" : 'LandingComponent'}>
      <div className={isAuthenticatedProp ? 'landing-component-container' : ''}>
        <Card className={classes.card + " landing-card"}>
          <div className="welcome-container">
            <div className="welcome-text">
              <div>welcome on</div>
              <div>TRECAPP</div>
            </div>
            <div className={classes.buttonContainer + ' landing-btn-container'}>
              <div className='landing-btn-container-background'></div>
              <MuiThemeProvider theme={theme}>
                {
                  isAuthenticatedProp ?
                    <div>
                      <Button component={Link} to={ROUTES.ACCOUNT} variant="outlined" color="primary" className={classes.button}>
                        Settings
                      </Button>
                      <Button component={Link} to={ROUTES.IMPRESSUM} variant="outlined" color="primary" className={classes.button}>
                        Impressum
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
            <div className="welcome-long-text">
              Save your recipes, share with others and discover other interesting things
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