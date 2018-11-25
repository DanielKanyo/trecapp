import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Navigation from '../Navigation/Navigation';
import SignUpPage from '../SignUp/SignUp';
import LandingPage from '../Landing/Landing';
import SignInPage from '../SignIn/SignIn';
import PasswordForgetPage from '../PasswordForget/PasswordForget';
import RecipesWall from '../Recipes/RecipesWall';
import AccountPage from '../Account/Account';
import Categories from '../Categories/Categories';
import CategoryRecipes from '../Categories/CategoryRecipes';
import MyRecipes from '../Recipes/MyRecipes';
import ShoppingList from '../ShoppingList/ShoppingList';
import withAuthentication from '../Session/withAuthentication';
import Favourites from '../Favourites/Favourites';
import FullSizeRecipe from '../Categories/FullSizeRecipe';
import * as routes from '../../constants/routes';

import { dataHun } from '../../constants/languages/hun';
import { dataEng } from '../../constants/languages/eng';

import { suggestionsHun } from '../../constants/languages/hun';
import { suggestionsEng } from '../../constants/languages/eng';

import './index.css';


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  }
});

class App extends Component {

  /**
   * Constructor
   * 
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      languageObject: dataEng,
      suggestionsObject: suggestionsEng,
      isAuthenticated: false,
    };
  }

  /**
   * Set language object
   * 
   * @param {string} language 
   */
  setLanguage = (language) => {
    switch (language) {
      case 'eng':
        this.setState({
          languageObject: dataEng,
          suggestionsObject: suggestionsEng
        });
        break;
      default:
        this.setState({
          languageObject: dataHun,
          suggestionsObject: suggestionsHun
        });
        break;
    }
  }

  setIsUserAuthenticated = (isAuthenticated) => {
    this.setState({
      isAuthenticated
    });
  }

  /**
   * Render function
   */
  render() {
    return (
      <Router>
        <div className="app">

          <MuiThemeProvider theme={theme}>
            <Navigation
              languageObjectProp={this.state.languageObject}
              setLanguageProp={this.setLanguage}
              setIsUserAuthenticatedProp={this.setIsUserAuthenticated}
            />

            <Route exact path={routes.LANDING}
              component={() => <LandingPage languageObjectProp={this.state.languageObject} isAuthenticatedProp={this.state.isAuthenticated} />}
            />
            <Route exact path={routes.SIGN_UP}
              component={() => <SignUpPage languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={routes.SIGN_IN}
              component={() => <SignInPage languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={routes.PASSWORD_FORGET}
              component={() => <PasswordForgetPage languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={routes.WALL}
              component={() => <RecipesWall languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={routes.ACCOUNT}
              component={() => <AccountPage setLanguageProp={this.setLanguage} languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={routes.MYRECIPES}
              component={() => <MyRecipes languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={routes.FAVOURITES}
              component={() => <Favourites languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={routes.SHOPPINGLIST}
              component={() => <ShoppingList languageObjectProp={this.state.languageObject} suggestionsObjectProp={this.state.suggestionsObject} />}
            />
            <Route exact path={routes.CATEGORIES}
              component={() => <Categories languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={routes.CATEGORIES + '/:category'}
              component={() => <CategoryRecipes languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={routes.CATEGORIES + '/:category/fullsize/:id'}
              component={(routerProps) => <FullSizeRecipe {...routerProps} languageObjectProp={this.state.languageObject} />}
            />
          </MuiThemeProvider>
        </div>
      </Router>
    );
  }
}

export default withAuthentication(App);