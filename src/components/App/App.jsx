import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import AdminPage from '../Admin/Admin';
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
import Edit from '../Edit/Edit';
import Impressum from '../Impressum/Impressum';
import Friends from '../Friends/Friends';
import User from '../User/User';
import BugReport from '../BugReport/BugReport';
import Search from '../Search/Search';

import * as ROUTES from '../../constants/routes';

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
      renderFacebook: false
    };
  }

  /**
   * Set language object
   * 
   * @param {string} language 
   */
  setLanguage = (language) => {
    switch (language) {
      case 'hun':
        this.setState({
          languageObject: dataHun,
          suggestionsObject: suggestionsHun
        });
        break;
      default:
        this.setState({
          languageObject: dataEng,
          suggestionsObject: suggestionsEng
        });
        break;
    }
  }

  setIsUserAuthenticated = (isAuthenticated) => {
    this.setState({
      isAuthenticated,
      renderFacebook: true
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

            <Route exact path={ROUTES.LANDING}
              component={() => <LandingPage renderFbProp={this.state.renderFacebook} languageObjectProp={this.state.languageObject} isAuthenticatedProp={this.state.isAuthenticated} />}
            />
            <Route exact path={ROUTES.ADMIN}
              component={() => <AdminPage languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.SIGN_UP}
              component={() => <SignUpPage languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.SIGN_IN}
              component={() => <SignInPage languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.PASSWORD_FORGET}
              component={() => <PasswordForgetPage languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.WALL}
              component={() => <RecipesWall languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.ACCOUNT}
              component={() => <AccountPage languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.MYRECIPES}
              component={() => <MyRecipes languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.FAVOURITES}
              component={() => <Favourites languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.SHOPPINGLIST}
              component={() => <ShoppingList languageObjectProp={this.state.languageObject} suggestionsObjectProp={this.state.suggestionsObject} />}
            />
            <Route exact path={ROUTES.CATEGORIES}
              component={() => <Categories languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.CATEGORIES + '/:category'}
              component={() => <CategoryRecipes languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.CATEGORIES + '/:category/recipe/:id'}
              component={(routerProps) => <FullSizeRecipe {...routerProps} languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.USER + '/:id'}
              component={() => <User languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.BUGREPORT}
              component={() => <BugReport languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.EDIT + '/:id'}
              component={(routerProps) => <Edit {...routerProps} languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.IMPRESSUM}
              component={(routerProps) => <Impressum {...routerProps} languageObjectProp={this.state.languageObject} />}
            />
            <Route exact path={ROUTES.FRIENDS}
              component={(routerProps) => <Friends {...routerProps} languageObjectProp={this.state.languageObject} />}
            />

            <Route exact path={ROUTES.SEARCH}
              component={(routerProps) => <Search {...routerProps} languageObjectProp={this.state.languageObject} />}
            />
          </MuiThemeProvider>
        </div>
      </Router>
    );
  }
}

export default withAuthentication(App);