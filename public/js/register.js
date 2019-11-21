console.log('sign_up.js run');

var password = document.getElementById('password')
var confirmPassword = document.getElementById('confirmpassword')

// go home
const homeButton = document.getElementById('home_button')
homeButton.addEventListener("click", function(e) {
  console.log('take me home please')

  fetch('/', {method: 'GET'})
    .then(function(response) {
      if(response.ok) {
        console.log(response.url);
        location.replace(response.url)    
        return;
      }
      throw new Error('Request failed.'); 
    })
    .catch(function(error) {
      console.log(error);
    });
});

// validate passwords match
function validatePassword(){
  if (password.value != confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords do NOT match")
  }
  else {
    confirmPassword.setCustomValidity('')
  }
}

password.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;



