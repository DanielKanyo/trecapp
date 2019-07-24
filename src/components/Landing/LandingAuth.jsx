import React, { Component } from 'react';
import './Landing.css';

import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import compose from 'recompose/compose';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import PeopleIcon from '@material-ui/icons/People';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CreateIcon from '@material-ui/icons/Create';
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
    margin: theme.spacing(),
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

class LandingAuth extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { classes, languageObjectProp, renderFbProp, appIdProp } = this.props;

    return (
      <div className="ComponentContent">
        <MuiThemeProvider theme={theme}>
          <div className='landing-component-container landing-auth'>
            <Card className={classes.card + " landing-card"}>
              <div className="welcome-container">
                <div className="welcome-text">
                  <div>{languageObjectProp.data.Landing.welcome}</div>
                  <div className="landing-card-title">TRECAPP</div>
                </div>
                <div className={classes.buttonContainer + ' landing-btn-container'}>
                  <div className='landing-background'></div>
                  <div>
                    <Button component={Link} to={ROUTES.ACCOUNT} variant="outlined" color="primary" className={classes.button}>
                      {languageObjectProp.data.Account.title}
                    </Button>
                    <Button component={Link} to={ROUTES.IMPRESSUM} variant="outlined" color="primary" className={classes.button}>
                      {languageObjectProp.data.Impressum.title}
                    </Button>
                  </div>
                </div>
                <div className="welcome-long-text">
                  {languageObjectProp.data.Landing.description}
                </div>
                <div className="social-container">
                  <div className='landing-background'></div>
                  {
                    renderFbProp &&
                    <FacebookProvider appId={appIdProp}>
                      <Like href="https://www.facebook.com/Trecapp-415056679268737/" layout="button_count" action="recommend" share />
                    </FacebookProvider>
                  }
                </div>
              </div>
            </Card>

            <Card className={classes.card + " landing-card"}>
              <div className="landing-recipe-container">
                <div className='landing-background'></div>
                <div className="landing-card-button moveLeft">
                  <IconButton component={Link} to={ROUTES.MYRECIPES} aria-label="Friends" className={classes.margin}>
                    <CreateIcon />
                  </IconButton>
                </div>
                <div className="landing-recipe-text-container">
                  <div>{languageObjectProp.data.Landing.saveRecipes}</div>
                  <div className="landing-card-title">{languageObjectProp.data.Landing.recipes}</div>
                </div>
              </div>
            </Card>

            <Card className={classes.card + " landing-card"}>
              <div className="landing-favourite-container">
                <div className='landing-background'></div>
                <div className="landing-card-button moveRight">
                  <IconButton component={Link} to={ROUTES.FAVOURITES} aria-label="Friends" className={classes.margin}>
                    <FavoriteIcon />
                  </IconButton>
                </div>
                <div className="landing-favourite-text-container">
                  <div>{languageObjectProp.data.Landing.addFav}</div>
                  <div className="landing-card-title">{languageObjectProp.data.Landing.favs}</div>
                </div>
              </div>
            </Card>

            <Card className={classes.card + " landing-card"}>
              <div className="landing-friends-container">
                <div className='landing-background'></div>
                <div className="landing-card-button moveLeft">
                  <IconButton component={Link} to={ROUTES.FRIENDS} aria-label="Friends" className={classes.margin}>
                    <PeopleIcon />
                  </IconButton>
                </div>
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

const authCondition = (authUser) => !!authUser;

LandingAuth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withAuthorization(authCondition), withStyles(styles))(LandingAuth);