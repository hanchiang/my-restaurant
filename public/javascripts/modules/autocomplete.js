import { $, $$ } from './bling';

function autocompletePlaces(input) {
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    // Enter key
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  })

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: userLat, longitude: userLng, accuracy } = pos.coords;

      const autocomplete = new google.maps.places.Autocomplete(input);

      // Create a circle to with centre and radius to set the bounds(top left and bottom right)
      // of current location
      const circle = new google.maps.Circle({
        center: new google.maps.LatLng(userLat, userLng),
        radius: accuracy
      });
      // Set the bounds to return results biased towards, but not restricted to, the bounds
      autocomplete.setBounds(circle.getBounds());

      autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        $('#lat').value = lat;
        $('#lng').value = lng;
      });
    }, (err) => {
      console.log(err);
    })
  }
  
  
}

export default autocompletePlaces;