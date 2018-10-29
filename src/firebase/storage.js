import {
 storage
} from './firebase';

// Upload image to firebase storage
export const uploadImage = (file) => {
 let storageRef = storage.ref(`recipe_images/${file.name}`);

 return storageRef.put(file);
}

// Get image download url
export const getImageDownloadUrl = (fullPath) => {
 let storageRef = storage.ref(fullPath);

 return storageRef.getDownloadURL().then(function(url) {
  return url;
 });
}