console.log('Client-side code running');

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


const signUp = document.getElementById('signUp');
signUp.addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/signup', {method: 'GET'})
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


const signIn = document.getElementById('signIn');
signIn.addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/signin', {method: 'GET'})
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

const trackPkg = document.getElementById('trackPackage');
trackPkg.addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/track', {method: 'GET'})
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