import React, { Component } from 'react';
import './Landing.css';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import { FacebookProvider, Like } from 'react-facebook';

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
  },
  margin: {
    margin: theme.spacing.unit,
  },
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

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { classes, languageObjectProp, appIdProp } = this.props;

    return (
      <div className='LandingComponent'>
        <MuiThemeProvider theme={theme}>
          <div className='landing-component-container'>
            <Card className={classes.card + " landing-card"}>
              <div className="welcome-container">
                <div className="welcome-text">
                  <div>{languageObjectProp.data.Landing.welcome}</div>
                  <div className="landing-card-title">TRECAPP</div>
                </div>
                <div className={classes.buttonContainer + ' landing-btn-container'}>
                  <div className='landing-background'></div>
                  <div>
                    <Button component={Link} to={ROUTES.SIGN_IN} variant="outlined" color="primary" className={classes.button}>
                      Sign In
                    </Button>
                    <Button component={Link} to={ROUTES.SIGN_UP} variant="outlined" color="primary" className={classes.button}>
                      Sign Up
                    </Button>
                  </div>
                </div>
                <div className="welcome-long-text">
                  {languageObjectProp.data.Landing.description}
                </div>
                <div className="social-container">
                  <div className='landing-background'></div>
                  <FacebookProvider appId={appIdProp}>
                    <Like href="https://www.facebook.com/Trecapp-415056679268737/" layout="button_count" action="recommend" share />
                  </FacebookProvider>
                </div>
              </div>
            </Card>

            <Card className={classes.card + " landing-card"}>
              <div className="landing-recipe-container">
                <div className='landing-background'></div>
                <div className="landing-recipe-text-container">
                  <div>{languageObjectProp.data.Landing.saveRecipes}</div>
                  <div className="landing-card-title">{languageObjectProp.data.Landing.recipes}</div>
                </div>
              </div>
            </Card>

            <Card className={classes.card + " landing-card"}>
              <div className="landing-favourite-container">
                <div className='landing-background'></div>
                <div className="landing-favourite-text-container">
                  <div>{languageObjectProp.data.Landing.addFav}</div>
                  <div className="landing-card-title">{languageObjectProp.data.Landing.favs}</div>
                </div>
              </div>
            </Card>

            <Card className={classes.card + " landing-card"}>
              <div className="landing-friends-container">
                <div className='landing-background'></div>
                <div className="landing-friends-text-container">
                  <div>{languageObjectProp.data.Landing.makeFriends}</div>
                  <div className="landing-card-title">{languageObjectProp.data.Landing.friends}</div>
                </div>
              </div>
            </Card>
            <div className="landing-card copyright-container">
              copyright © {new Date().getFullYear()}
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Landing);