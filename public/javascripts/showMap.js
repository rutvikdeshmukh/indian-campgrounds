mapboxgl.accessToken = mapboxToken;
var map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: locationCordinates.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<p> ${locationCordinates.location}</p>`
);

new mapboxgl.Marker()
  .setLngLat(locationCordinates.geometry.coordinates)
  .setPopup(popup) // sets a popup on this marker
  .addTo(map);
