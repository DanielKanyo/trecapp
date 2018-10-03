import {
  db
} from './firebase';

// User API

export const doCreateUser = (id, username, email, language) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    language
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

// Get user data
export const getUserInfo = (id) =>
  db.ref(`users/${id}`).once('value').then(function (snap) {
    return snap.val();
  });

// Save recipe 
export const addRecipe = (id, recipe) => {
  let recipesRef = db.ref(`recipes`);
  let recipeRef = recipesRef.push();

  recipeRef.set({
    userId: id,
    category: recipe.category,
    creationTime: recipe.creationTime,
    longDes: recipe.longDes,
    prepTime: recipe.prepTime,
    publicChecked: recipe.publicChecked,
    story: recipe.story,
    ingredients: recipe.ingredients,
    sliderValue: recipe.sliderValue,
    title: recipe.title
  });

  return recipeRef;
}

// Get users recipes
export const getUsersRecipes = () => {
  return db.ref(`recipes`).once('value').then(function (snap) {
    return snap.val();
  });
}

// Remove recipe
export const removeRecipe = (id, recipeId) => {
  let recipeRef = db.ref(`recipes/${recipeId}`);
  recipeRef.remove();
}

// Update user info
export const updateUserInfo = (id, username, language) => {
  let userRef = db.ref(`users/${id}`);

  return userRef.update({
    username,
    language
  });
}