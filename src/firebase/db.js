import {
  db
} from './firebase';

// Create user
export const user = id => db.ref(`users/${id}`);

// Get all user
export const users = () => db.ref('users');

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
    difficulty: recipe.difficulty,
    title: recipe.title,
    currency: recipe.currency,
    favouriteCounter: recipe.favouriteCounter,
    likeCounter: recipe.likeCounter,
    imageUrl: recipe.imageUrl,
    imageName: recipe.imageName,
    recipeLanguage: recipe.recipeLanguage
  });

  return recipeRef;
}

// Update recipe data
export const updateRecipe = (recipeId, recipe) => {
  let recipeRef = db.ref(`recipes/${recipeId}`);

  return recipeRef.update({
    category: recipe.category,
    longDes: recipe.longDes,
    hour: recipe.hour,
    minute: recipe.minute,
    publicChecked: recipe.publicChecked,
    story: recipe.story,
    dose: recipe.dose,
    cost: recipe.cost,
    ingredients: recipe.ingredients,
    difficulty: recipe.difficulty,
    title: recipe.title,
    currency: recipe.currency,
    recipeLanguage: recipe.recipeLanguage
  });
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
export const updateUserInfo = (id, username, language, about, filterRecipes) => {
  let userRef = db.ref(`users/${id}`);

  return userRef.update({
    username,
    language,
    about,
    filterRecipes
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
export const updateRecipeImageUrlAndName = (recipeId, url, name) => {
  let recipeRef = db.ref(`recipes/${recipeId}`);

  return recipeRef.update({
    imageUrl: url,
    imageName: name
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

// Toggle like
export function toggleLike(userId, recipeId) {
  let recipeRef = db.ref(`recipes/${recipeId}`);

  return recipeRef.transaction(function (recipe) {
    if (recipe) {
      if (recipe.likeCounter && recipe.likes[userId]) {
        recipe.likeCounter--;
        recipe.likes[userId] = null;
      } else {
        recipe.likeCounter++;
        if (!recipe.likes) {
          recipe.likes = {};
        }
        recipe.likes[userId] = true;
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


// Save bug report
export const saveBugReport = (userId, text, timestamp) => {
  let bugsRef = db.ref(`bugs`);
  let bugRef = bugsRef.push();

  bugRef.set({
    userId,
    text,
    timestamp
  });

  return bugRef;
}

// Get bug reports 
export const getBugReports = () => db.ref(`bugs`);

// Update recipes language
export const updateRecipesLanguage = (userId, recipesLanguage) => {
  let userRef = db.ref(`users/${userId}`);

  return userRef.update({
    recipesLanguage
  });
}

// Update currency
export const updateCurrency = (userId, currency) => {
  let userRef = db.ref(`users/${userId}`);

  return userRef.update({
    currency
  });
}

export const toggleFriend = (loggedInUserId, userId) => {
  let userRef = db.ref(`users/${loggedInUserId}`);

  return userRef.transaction(function (user) {
    if (user) {
      if (user.friends && user.friends[userId]) {
        user.friends[userId] = null;
      } else {
        if (!user.friends) {
          user.friends = {};
        }
        user.friends[userId] = true;
      }
    }

    return user;
  });
}

// Get friends list
export const getFriends = (loggedInUserId) => db.ref(`users/${loggedInUserId}/friends`);