import {
  auth,
  googleProvider,
  facebookProvider
} from './firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Send e-mail verification
export const doSendEmailVerification = () =>
  auth.currentUser.sendEmailVerification();

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () =>
  auth.signOut();

// Password Reset
export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
  auth.currentUser.updatePassword(password);

// Get Current User
export const getCurrentUserId = () =>
  auth.currentUser.uid;

// Sign Up with Google
export const doSignInWithGoogle = () =>
  auth.signInWithPopup(googleProvider).then(function (result) {
    let user = result.user;
    return user;
  });

// Sign up with Facebook
export const doSignInWithFacebook = () =>
  auth.signInWithPopup(facebookProvider).then(function(result) {
    let user = result.user;
    return user;
  });