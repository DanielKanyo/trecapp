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

// Other db APIs ...

export const getUserInfo = (id) =>
  db.ref(`users/${id}`).once('value').then(function (snap) {
    return snap.val();
  });

// Save recipe 
export const addRecipe = (id, recipe) => {
  let recipesRef = db.ref(`users/${id}/recipes`);
  let recipeRef = recipesRef.push();

  recipeRef.set({
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
export const getUsersRecipes = (id) => {
  return db.ref(`users/${id}/recipes`).once('value').then(function (snap) {
    let object = {
      id: id,
      value: snap.val()
    }
    return object;
  });
}

// Remove recipe
export const removeRecipe = (id, recipeId) => {
  let recipeRef = db.ref(`users/${id}/recipes/${recipeId}`);
  recipeRef.remove();
}