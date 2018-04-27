import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyA5-AJSl5cusH_40YcRRlrF2xOeOMHtN8Q",
  authDomain: "drawing-games.firebaseapp.com",
  databaseURL: "https://drawing-games.firebaseio.com",
  projectId: "drawing-games",
  storageBucket: "drawing-games.appspot.com",
  messagingSenderId: "390333190998"
};

const fire = firebase.initializeApp(config);

export default fire;
