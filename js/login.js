function ForgotPassword()
{
  var email = document.getElementById("forgotPasswordMail").value;
  firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });
}
function Login()
{
  var emailOne = document.getElementById('email').value;
  var passwordOne = document.getElementById('password').value;
  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
    return firebase.auth().signInWithEmailAndPassword(emailOne, passwordOne);
  })
  .catch((error) => {
  });
  auth.signInWithEmailAndPassword(emailOne, passwordOne)
  .then((user) => {

    window.open('../index.html', '_self');

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}
function Register()
{
    var errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = "";
    var email = document.getElementById("registerEmail").value;
    var password = document.getElementById("registerPassword").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    var firstName = document.getElementById("first-name").value;
    var lastName = document.getElementById("last-name").value;
    var profilePicture = document.getElementById("profile-picture").files[0];
    //console.log("doslo do tud!")
    if (!email || !password || !confirmPassword || !firstName || !lastName || !profilePicture) {
        errorMessage.innerHTML = "Trebate ispuniti sva polja!";
        //console.log("eror 1")
    } else if (password !== confirmPassword) {
        errorMessage.innerHTML = "Lozinke nisu iste!";
        //console.log("eror 2")
    } else {
  firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(user) {
        //console.log("ulazak u aut dio")
        var userId = user.user.uid;
        var userRef = firebase.database().ref("users/" + userId);
        
        var storageRef = firebase.storage().ref("users/" + userId + "/" + profilePicture.name);
        var uploadTask = storageRef.put(profilePicture);
  
        uploadTask.on("state_changed", function(snapshot) {
          //console.log("slika se uploda")
        }, function(error) {
          //console.log("uplod fails")
        }, function() {
          // handle successful upload
          //console.log("uspjeh!")
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            userRef.set({
              email: email,
              firstName: firstName,
              lastName: lastName,
              profilePicture: downloadURL
            });
          });
        });
      }).catch(function(error) {
        if (error.code === "auth/email-already-in-use") {
          errorMessage.innerHTML = "Profil sa tom email adresom vec postoji";
        } else {
          errorMessage.innerHTML = "Error: " + error.message;
        }
      });
    }
}
const signUpButton = document.getElementById('showToRegistration');
const signInButton = document.getElementById('showToLogin');
const loginContainer = document.getElementById('login-form-container');
const rightPanel = document.getElementById('right-panel')
const registerContainer = document.getElementById('registration-form-container');
const leftPanel = document.getElementById('left-panel')
signUpButton.addEventListener('click', () => {
  // animate the switching of the image and form
  document.querySelector("#left-panel img").style.transform = "translateX(100%)";
  document.querySelector("#right-panel img").style.transform = "translateX(0%)";
  registerContainer.style.transform = "translateX(100%)";
  //transform the form
  setTimeout(() => {
    registerContainer.style.transform = "translateX(0%)";
  }, 670);
  setTimeout(() => {
    loginContainer.style.display = "none";
    rightPanel.style.display = "block";
    registerContainer.style.display = "block";
    leftPanel.style.display = "none";
  }, 600)
});


signInButton.addEventListener('click', () => {
  // animate the switching of the image and form
  document.querySelector("#left-panel img").style.transform = "translateX(0%)";
  document.querySelector("#right-panel img").style.transform = "translateX(-100%)";
  loginContainer.style.transform = "translateX(-150%)";
  //transform the form
  setTimeout(() => {
    loginContainer.style.transform = "translateX(0%)";
  }, 670);
  setTimeout(() => {
    loginContainer.style.display = "block";
    leftPanel.style.display = "block";
    registerContainer.style.display = "none";
    rightPanel.style.display = "none";
  }, 600)
});