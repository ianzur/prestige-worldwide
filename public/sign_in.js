console.log('sign_in.js run')

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
