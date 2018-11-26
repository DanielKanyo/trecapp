import {
  db
} from './firebase';

// Create user
export const doCreateUser = (id, username, email, language, currency, profilePicUrl, roles) => {
  return db.ref(`users/${id}`).set({
    username,
    email,
    language,
    currency,
    profilePicUrl,
    roles,
  });
}

// Get all user
export const onceGetUsers = () =>
  db.ref('users').once('value');

export const onceGetUser = id => db.ref(`users/${id}`).once('value');

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
    currency: recipe.currency,
    favouriteCounter: recipe.favouriteCounter,
    imageUrl: recipe.imageUrl
  });

  return recipeRef;
}

// Get recipes
export const getRecipes = () =>
  db.ref(`recipes`).once('value').then(function (snap) {
    return snap.val();
  });

// Get recipe by id
export const getRecipeById = (recipeId) => {
  return db.ref(`recipes/${recipeId}`).once('value');
}



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

// Update recipe image url value
export const updateRecipeImageUrl = (recipeId, url) => {
  let recipeRef = db.ref(`recipes/${recipeId}`);

  return recipeRef.update({
    imageUrl: url
  });
}

// Update users profile picture url
export const updateUsersProfilePictureUrl = (userId, url) => {
  let userRef = db.ref(`users/${userId}`);

  return userRef.update({
    profilePicUrl: url
  });
}

// Get favourite recipes by userid
export const getFavouriteRecipesByUserId = (userId) => {
  return db.ref(`users/${userId}/favourites`).once('value');
}

// Toggle favourites
export function toggleFavourite(userId, recipeId) {
  let recipeRef = db.ref(`recipes/${recipeId}`);

  return recipeRef.transaction(function (recipe) {
    if (recipe) {
      if (recipe.favouriteCounter && recipe.favourites[userId]) {
        recipe.favouriteCounter--;
        recipe.favourites[userId] = null;
      } else {
        recipe.favouriteCounter++;
        if (!recipe.favourites) {
          recipe.favourites = {};
        }
        recipe.favourites[userId] = true;
      }
    }

    return recipe;
  });
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

// Update inBasket value
export const updateItemInBasketValue = (userId, itemId, value) => {
  let itemRef = db.ref(`users/${userId}/shoppingListItems/${itemId}`);

  return itemRef.update({
    inBasket: value
  });
}

// Delete all shopping list item
export const deleteAllShoppingListItem = (userId) => {
  let shoppingListRef = db.ref(`users/${userId}/shoppingListItems`);
  shoppingListRef.remove();
}

// Get all recent products
export const getResentProducts = (userId) =>
  db.ref(`users/${userId}/recentProducts`).once('value').then(function (snap) {
    return snap.val();
  });

// Save product name for recet products feature
export const saveProductForRecent = (userId, value) => {
  let recProdsRef = db.ref(`users/${userId}/recentProducts`);
  let recProdRef = recProdsRef.push();

  recProdRef.set({
    value
  });

  return recProdRef;
}

// Clear all recent products
export const clearRecentProducts = (userId) => {
  let recProdsRef = db.ref(`users/${userId}/recentProducts`);
  recProdsRef.remove();
}