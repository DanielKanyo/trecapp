import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from '../Navigation/Navigation';
import SignUpPage from '../SignUp/SignUp';
import LandingPage from '../Landing/Landing';
import SignInPage from '../SignIn/SignIn';
import PasswordForgetPage from '../PasswordForget/PasswordForget';
import RecipesWall from '../Recipes/RecipesWall';
import AccountPage from '../Account/Account';
import MyRecipes from '../Recipes/MyRecipes';
import ShoppingList from '../ShoppingList/ShoppingList';
import withAuthentication from '../Session/withAuthentication';
import Favourites from '../Favourites/Favourites';
import * as routes from '../../constants/routes';

import { dataHun } from '../../constants/languages/hun';
import { dataEng } from '../../constants/languages/eng';

import './index.css';

class App extends Component {

  /**
   * Constructor
   * 
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      languageObject: dataEng
    };
    this.setLanguage = this.setLanguage.bind(this);
  }

  /**
   * Set language object
   * 
   * @param {string} language 
   */
  setLanguage(language) {
    switch (language) {
      case 'eng':
        this.setState({ languageObject: dataEng })
        break;
      default:
        this.setState({ languageObject: dataHun })
        break;
    }
  }

  /**
   * Render function
   */
  render() {
    return (
      <Router>
        <div className="app">
          <Navigation
            languageObjectProp={this.state.languageObject}
            setLanguageProp={this.setLanguage.bind(this)}
          />

          <Route exact path={routes.LANDING}
            component={() => <LandingPage languageObjectProp={this.state.languageObject} />}
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
            component={() => <ShoppingList languageObjectProp={this.state.languageObject} />}
          />
        </div>
      </Router>
    );
  }
}

export default withAuthentication(App);