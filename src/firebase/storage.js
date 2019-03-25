import {
  storage
} from './firebase';

// Upload image to firebase storage
export const uploadImage = (file) => {
  let fileName = file.name;
  let lastDotIndex = fileName.lastIndexOf(".");
  let name = fileName.slice(0, lastDotIndex);
  let type = fileName.slice(lastDotIndex);
  
  let newName = `${name}${new Date().getTime()}${type}`;

  let storageRef = storage.ref(`recipe_images/${newName}`);

  return storageRef.put(file);
}

// Get image download url
export const getImageDownloadUrl = (fullPath) => {
  let storageRef = storage.ref(fullPath);

  return storageRef.getDownloadURL().then(function (url) {
    return url;
  });
}

// Upload profile image
export const uploadProfileImage = (file) => {
  let storageRef = storage.ref(`profile_images/${file.name}`);

  return storageRef.put(file);
}

// Delete profile image
export const deleteProfileImage = (imageName) => {
  let imgRef = storage.ref(`profile_images/${imageName}`);
  imgRef.delete();
}

// Delete recipe image
export const deleteRecipeImage = (imageName) => {
  let imgRef = storage.ref(`recipe_images/${imageName}`);
  imgRef.delete();
}