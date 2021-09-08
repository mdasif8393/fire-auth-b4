import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {  

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  var facebookProvider = new firebase.auth.FacebookAuthProvider();

  const [newUser, setNewUser] = useState(false);

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    picture: '',
    error: '',
    success: false
  });

  //Facebook pop up sign in
  const handleFacebookSignIn = () => {
    firebase.auth()
    .signInWithPopup(facebookProvider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // The signed-in user info.
      var user = result.user;
      console.log(user);

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var accessToken = credential.accessToken;

      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      // ...
    });
  }


  //Google opo up sign in
  const handleSignIn = () => {
    firebase.app().auth().signInWithPopup(googleProvider)
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
      // console.log(err);
      // console.log(err.message);
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

  //Firebase signup with email and password
  const handleSubmit = (e) => {

    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)

      .then((res) => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })

      .catch( error => {

        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }

    //Firebase login with email and password
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)

      .then( res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        console.log('sign in user info', res.user);
      })

      .catch((error) => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        
      });
    }

    e.preventDefault();
  }

  const handleBlur = (e) => {

    let isFieldValid = true;
    
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }

    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }

    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value ; 
      setUser(newUserInfo);
    }

  }

  const updateUserName = name => {

    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,

    })
    .then( res => {
      console.log("User name updated successfully")
    }).catch((error) => {
      console.log(error);
    });  
  }

  return (
    <div className="App">
      <button onClick={handleFacebookSignIn}>Facebook Sign in</button>
      <br />
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

      <h1>Our own Authentication</h1>

      <input type="checkbox" onChange={ ()=> setNewUser(!newUser) } name="newUser" id="" />
      <label htmlFor="newUser">New User Sign Up</label>

      <form onSubmit={handleSubmit}>
        {
          newUser && <input type="text" name="name" id="" placeholder="Your name" onBlur={handleBlur}/>
        }
        <br />
        <input type="text" name="email" onBlur={handleBlur}  id="" placeholder="Your email address"  required/> 
        <br />
        <input type="password" name="password" onBlur={handleBlur} id="" placeholder="Your password" required/> 
        <br />
        <input type="submit" value={newUser ? "Sign up" : "Sign in"} />
      </form>

      <p style={{color:'red'}} >{user.error}</p>
      {
        user.success && <p style={{color:'green'}} >User { newUser ? "created" : "Logged in"} successfully</p>
      }
    </div>
  );
}

export default App;
