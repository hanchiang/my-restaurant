import axios from 'axios';


function makeMap(input) {
  if (!input) return;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: userLat, longitude: userLng, accuracy } = pos.coords;

      axios.get(`/api/stores/near?lat=${userLat}&lng=${userLng}`)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(cerr)
        });

    }, (err) => {
      console.log(err);
    })
  }
}

export default makeMap;