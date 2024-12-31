//Images from free stock photo website:  https://www.pexels.com/ 
//Google API Travel Modes: https://developers.google.com/maps/documentation/javascript/examples/directions-travel-modes#maps_directions_travel_modes-html

function chgimg(name, txt,row) {

  var cellImage = row.querySelector('td img.cellImage');
  var externalImage = document.getElementsByClassName("externalImage")[0];

  cellImage.src = name;
  cellImage.alt = txt;
  cellImage.style.display = "block"
  externalImage.src = name;
  externalImage.alt = txt;
}

function clearimg(row){
  var cellImage = row.querySelector('td img.cellImage');
  cellImage.style.display="none";

}



var directionService;
var directionRenderer;
let map;

function initMap() {
  var myLatLng = {lat: 44.977276, lng: -93.232266};

  map = new google.maps.Map(document.getElementById('map'), {zoom: 14,center: myLatLng});
  var geocoder = new google.maps.Geocoder();

  const contacts = getContacts();
  contacts.forEach(contact =>{ geocodeAddress(geocoder,map,contact);});

  directionService = new google.maps.DirectionsService();
  directionRenderer = new google.maps.DirectionsRenderer();
  directionRenderer.setMap(map);

  directionRenderer.setPanel(document.getElementById("directions"));
  document.getElementById("get-directions").addEventListener("click", () => {getDirections(geocoder);});
}

function getDirections(){
  const destination = document.getElementById("destination").value;

  if(!destination){
    alert("Enter a destination.")
    return;
  }

  const selectedModeElement = document.querySelector('input[name="travelMode"]:checked');
  const selectedMode = selectedModeElement.value;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => { const origin = { lat: position.coords.latitude, lng: position.coords.longitude,}; calculateAndDisplayRoute(origin, destination, selectedMode)});
  } 
  else {
    alert("Geolocation failed.");
  }
}


function calculateAndDisplayRoute(origin, destination, travelMode) {

  directionService.route({ origin: origin, destination: destination, travelMode: google.maps.TravelMode[travelMode],},
    (response, status) => {
      if (status === "OK") {
        directionRenderer.setDirections(response);
      } 
      else {
        alert("Failed due to " + status);
      }
    }
  );
}

function getContacts(){
  const rows = document.querySelectorAll(".contactInfo");
  const contacts = [];

  rows.forEach(row =>{
    const name = row.querySelector(".name").textContent;
    const location = row.querySelector(".location").textContent;
    const info = row.querySelector(".info").textContent;
    contacts.push({name, location, info});
  });
  return contacts;

}


function geocodeAddress(geocoder, map, contact) {
  geocoder.geocode({ address: contact.location }, (results, status) => {
    if (status === "OK") {

      const marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        title: contact.name,
      });

      const infoWindow = new google.maps.InfoWindow({content: `<div><h3>${contact.name}</h3><p>${contact.info}</p><p>${contact.location}</p></div>`,});
      marker.addListener("click", () => {infoWindow.open(map, marker);});
    } 
    else{
      alert("Failed due to " + status);
    }
  });
}
	

function createWindow(map,window,marker){
  return function(){
    window.open(map,marker);
  }
}

