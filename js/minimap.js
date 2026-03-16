//
// Minimap – Colombia only
//

// Colombia full extent: mainland + San Andrés (S 4.5°, N 13°, W -82°, E -66.8°)
var COLOMBIA_CENTER = [4.57, -74.30];
var COLOMBIA_BOUNDS = L.latLngBounds([-4.5, -82.0], [13.0, -66.8]);

function mminitialize() {
    mymap = L.map("miniMap", {
        minZoom: 4,
        maxZoom: 19,
        maxBounds: COLOMBIA_BOUNDS,
        maxBoundsViscosity: 1.0
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(mymap);

    mymap.fitBounds(COLOMBIA_BOUNDS, { padding: [20, 20] });

    guess2 = L.marker([-999, -999]).addTo(mymap);
    guess2.setLatLng({lat: -999, lng: -999});

    mymap.on("click", function(e) {
        guess2.setLatLng(e.latlng);
        window.guessLatLng = e.latlng;
    })
};
