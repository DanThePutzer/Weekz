// Get Elements
var txtFirstname = document.getElementById('first');
var txtLastname = document.getElementById('last');
var txtEmail = document.getElementById('email');
var txtPassword1 = document.getElementById('password1');
var txtPassword2 = document.getElementById('password2');
var btnSignup = document.getElementById('signup');

  // Initialize Firebase
var config = {
    apiKey: "AIzaSyD-23wnCzHAmW_AaS_yODHhcTbh9RhnbLY",
    authDomain: "weekz-fba03.firebaseapp.com",
    databaseURL: "https://weekz-fba03.firebaseio.com",
    projectId: "weekz-fba03",
    storageBucket: "gs://weekz-fba03.appspot.com/",
    messagingSenderId: "708230896117"
};

firebase.initializeApp(config);
var auth = firebase.auth();
var ref = firebase.database().ref();

/*txtEmail.addEventListener('input', function()
{
  auth.fetchProvidersForEmail(email.value).then(function(val)
  {
    if (val.length > 0)
    {
      txtEmail.style.border = "1px solid #7AC843"
    }
    else
    {
      txtEmail.style.border = "1px solid #FF514C";
    }
  }).catch(function(e) {
    console.log(e); // "oh, no!"
  });
});*/

// Login Event
btnSignup.addEventListener('click', e => {

  // Get Email & Password
  var first = txtFirstname.value;
  var last = txtLastname.value;
  var email = txtEmail.value;
  var pass1 = txtPassword1.value;
  var pass2 = txtPassword2.value;

  if (first == "") {
    resetBorders();
    txtFirstname.style.border = "1px solid #FF514C";
  } else if (last == "") {
    resetBorders();
    txtLastname.style.border = "1px solid #FF514C";
  } else if (email == "") {
    resetBorders();
    txtEmail.style.border = "1px solid #FF514C";
  } else if (pass1 == "") {
    resetBorders();
    txtPassword1.style.border = "1px solid #FF514C";
  } else if (pass2 == "") {
    resetBorders();
    txtPassword2.style.border = "1px solid #FF514C";
  } else {
    resetBorders();

    if (pass1 == pass2) {
      // Sign up
      var promise = auth.createUserWithEmailAndPassword(email, pass2)
        .then(function(response) {
          txtFirstname.style.border = "1px solid #7AC843"
          txtLastname.style.border = "1px solid #7AC843"
          txtEmail.style.border = "1px solid #7AC843"
          txtPassword1.style.border = "1px solid #7AC843"
          txtPassword2.style.border = "1px solid #7AC843"

          ref.child("users").child(response.uid).child("info").set({firstname: first, lastname: last, email: email});
          auth.onAuthStateChanged(function(user) {
            user.sendEmailVerification().then(function() {
              window.location = 'dashboard';
            }).catch(function(error) {
              console.log(error);
            });
          })
        });
      promise.catch(e => console.log(e.message));

    } else {
      txtPassword1.style.border = "1px solid #FF514C"
      txtPassword2.style.border = "1px solid #FF514C"
    };
  };
});

function resetBorders() {
  txtLastname.style.border = "none";
  txtFirstname.style.border = "none";
  txtEmail.style.border = "none";
  txtPassword1.style.border = "none";
  txtPassword2.style.border = "none";
}
