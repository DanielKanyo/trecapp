import {
  db
} from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

// Other db APIs ...

export const getUserInfo = (id) =>
  db.ref(`users/${id}`).once('value').then(function (snap) {
    return snap.val();
  });

export const addRecipe = (id, recipeData) => {
  let recipesRef = db.ref(`users/${id}/recipes`);
  let recipeRef = recipesRef.push();

  recipeRef.set({
    recipeData
  });

  return recipeRef;
}