import axios from 'axios';

function loadPlaces(map, userLat, userLng) {
  axios.get(`/api/stores/near?lat=${userLat}&lng=${userLng}`)
    .then(res => {
      const stores = res.data;

      if (stores.length === 0) {
        return alert('No stores found');
      }

      // Show markers on map
      const markers = stores.map(store => {
        const marker = new google.maps.Marker({
          position: { lat: store.location.coordinates[1], lng: store.location.coordinates[0] },
          map,
          title: store.name
        });
        marker.place = store;
        return marker;
      });

      let infowindowHtml;
      // Create one info so that only one will pop up when marker is clicked
      let infowindow = new google.maps.InfoWindow();
      // Add info window to display store detail when marker is clicked
      markers.forEach(marker => {
        marker.addListener('click', function() {
          infowindowHtml = `
            <div class="popup">
              <a href="/stores/${this.place.slug}">
                <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}"
                <p>${this.place.name} - ${this.place.address}</p>
              </a>
            </div>
          `;

          infowindow.setContent(infowindowHtml);
          infowindow.open(map, marker);
        })
      });

      // Centre the map onto the stores
      const bounds = new google.maps.LatLngBounds();
      stores.forEach(store => {
        bounds.extend({ lat: store.location.coordinates[1], lng: store.location.coordinates[0] });
      })

      map.fitBounds(bounds);
    })
    .catch(err => {
      console.log(err);
    });
}

function makeMap(inputMap) {
  if (!inputMap) return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: userLat, longitude: userLng, accuracy } = pos.coords;

      // Display map
      const map = new google.maps.Map(inputMap, {
        center: { lat: userLat, lng: userLng },
        zoom: 10
      });
      loadPlaces(map, userLat, userLng);

      const input = document.querySelector('.autocomplete__input[name="geolocate"]');
      const autocomplete = new google.maps.places.Autocomplete(input);

      // Create a circle to get latlng bounds
      const circle = new google.maps.Circle({
        center: { lat: userLat, lng: userLng },
        radius: accuracy
      });

      // Set bounds of autocomplete so that search results will be biased towards user's location
      autocomplete.setBounds(circle.getBounds());

      autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        loadPlaces(map, lat, lng);
      });

    }, (err) => {
      console.log(err);
      if (err.message === 'User denied Geolocation') {
        alert('Location permission is required');
      }
    })
  }
}

export default makeMap;