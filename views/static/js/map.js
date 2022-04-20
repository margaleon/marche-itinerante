const initLon = 0.0500730622919878;
const initLat = 47.21662858810452;

const departLonLat = [0.25125320472121476, 47.16341247731693];
const arrivalLonLat = [-0.07102508600925891, 47.26896663218585];

const firstNightLonLat = [0.11184695124720558, 47.13766278098554];
const secondNightLonLat = [0.052592796027642254, 47.21822096941579];

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFyZ2FsZW9uIiwiYSI6ImNrbW5yMjZ5MjF4cHIycHFvZzQ2OWtmbGwifQ.1OzQSRteme_8gtERtqesMA";

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/margaleon/ckzbimorh002214ml6zc53yh3", // style URL
  center: [initLon, initLat], // starting position [lng, lat]
  zoom: 10, // starting zoom
});

const api_url = "https://marche-itinerante-tracker.xyz/api/positions";

// depart and arrival popups markers
const departMarker = new mapboxgl.Marker({ color: "#f8b33d" })
  .setLngLat(departLonLat)
  .setPopup(new mapboxgl.Popup().setHTML("<p>Départ</p>"))
  .addTo(map);

const arrivalmarker = new mapboxgl.Marker({ color: "#f8b33d" })
  .setLngLat(arrivalLonLat)
  .setPopup(new mapboxgl.Popup().setHTML("<p>Arrivée</p>"))
  .addTo(map);

const firstNightMarker = new mapboxgl.Marker({ color: "#518e3c" })
  .setLngLat(firstNightLonLat)
  .setPopup(new mapboxgl.Popup().setHTML("<p>Première nuit ici !</p>"))
  .addTo(map);

const secondNightMarker = new mapboxgl.Marker({ color: "#518e3c" })
  .setLngLat(secondNightLonLat)
  .setPopup(new mapboxgl.Popup().setHTML("<p>Deuxième nuit là !</p>"))
  .addTo(map);

let markers = [];

map.on("load", async () => {
  getPos();

  function getPos() {
    if (markers !== null) {
      markers.forEach((marker, index) => {
        marker.remove();
      });
    }
    console.log(markers);

    $.ajax({
      type: "GET",
      url: api_url,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa("user:user"));
      },
      success: function (output) {
        const device = output[1];
        const { latitude, longitude } = device;

        const lastDate = new Date(device.deviceTime);
        const dateOptions = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        };
        const formattedLastDate = lastDate.toLocaleDateString(
          "fr-FR",
          dateOptions
        );

        // Create a new Marker and add it to the map.
        let posMarker = new mapboxgl.Marker({ color: "#75cced" })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<p>On est ici !</p>
              <span>${formattedLastDate}</span>`
            )
          )
          .addTo(map);
        markers.push(posMarker);
        console.log(markers);
      },
      error: function (output) {
        console.log(output);
      },
    });
  }

  // make the ajax request every 5 minutes (300000ms)
  setInterval(getPos, 300000);
});

map.scrollZoom.disable();
map.keyboard.enable();
map.addControl(new mapboxgl.NavigationControl());
