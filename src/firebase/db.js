import {
  db
} from './firebase';

// Create user
export const doCreateUser = (id, username, email, language, currency) => {
  return db.ref(`users/${id}`).set({
    username,
    email,
    language,
    currency
  });
}

// Get all user
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
    hour: recipe.hour,
    minute: recipe.minute,
    publicChecked: recipe.publicChecked,
    story: recipe.story,
    dose: recipe.dose,
    cost: recipe.cost,
    ingredients: recipe.ingredients,
    sliderValue: recipe.sliderValue,
    title: recipe.title,
    currency: recipe.currency
  });

  return recipeRef;
}

// Get users recipes
export const getUsersRecipes = () =>
  db.ref(`recipes`).once('value').then(function (snap) {
    return snap.val();
  });


// Remove recipe
export const removeRecipe = (recipeId) => {
  let recipeRef = db.ref(`recipes/${recipeId}`);
  recipeRef.remove();
}

// Update user info
export const updateUserInfo = (id, username, language, currency) => {
  let userRef = db.ref(`users/${id}`);

  return userRef.update({
    username,
    language,
    currency
  });
}

// Update recipe visibility
export const updateRecipeVisibility = (recipeId, visibility) => {
  let recipeRef = db.ref(`recipes/${recipeId}`);

  return recipeRef.update({
    publicChecked: visibility
  });
}

// Get favourite recipes by userid
export const getFavouriteRecipesByUserId = (userId) => {
  return db.ref(`users/${userId}/favourites`).once('value');
}

// Add recipe to favourites
export const addRecipeToFavourites = (userId, recipeId) => {
  let favouritesRef = db.ref(`users/${userId}/favourites`);
  let favouriteRef = favouritesRef.push();

  favouriteRef.set({
    userId,
    recipeId
  });

  return favouriteRef;
}

// Remove recipe from favourites
export const removeRecipeFromFavourites = (userId, favouriteId) => {
  let favouriteRef = db.ref(`users/${userId}/favourites/${favouriteId}`);
  favouriteRef.remove();
}

// Save shopping list item
export const addItem = (userId, item) => {
  let itemsRef = db.ref(`users/${userId}/shoppingListItems`);
  let itemRef = itemsRef.push();

  itemRef.set({
    value: item.value,
    creationTime: item.creationTime,
    inBasket: item.inBasket
  });

  return itemRef;
}

// Get shopping items
export const getShoppingListItems = (userId) =>
  db.ref(`users/${userId}/shoppingListItems`).once('value').then(function (snap) {
    return snap.val();
  });

// Remove shoppping list item
export const removeShoppingListItem = (userId, itemId) => {
  let itemRef = db.ref(`users/${userId}/shoppingListItems/${itemId}`);
  itemRef.remove();
}