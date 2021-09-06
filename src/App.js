import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {  

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    picture: ''
  });


  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase.app().auth().signInWithPopup(provider)
    .then((res) => {

      // console.log(res.additionalUserInfo.profile.picture);
      const {name, email, picture} = res.additionalUserInfo.profile;
      const signedInUser = {
        isSignedIn: true,
        name: name,
        email: email,
        picture: picture,
      }
      setUser(signedInUser);
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut().then(() => {
      const signOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        picture: '',
      }
      setUser(signOutUser);
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick = {handleSignOut} >Sign out</button> :  <button onClick = {handleSignIn} >Sign in</button>
      }
      {
        user.isSignedIn && 
        <div> 
            <p>Welcome {user.name}</p>
            <p>Email: {user.email}</p>
            <img src={user.picture} alt=""/>
        </div>
      }
    </div>
  );
}

export default App;
