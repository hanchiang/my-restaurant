import { $, $$ } from './bling';

function autocompletePlaces(input) {
  if (!input) return;
  
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', function() {
    const place = autocomplete.getPlace();
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    $('#lat').value = lat;
    $('#lng').value = lng;
  });
}

export default autocompletePlaces;