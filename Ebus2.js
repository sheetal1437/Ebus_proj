// Initialize Firestore
const db = firebase.firestore();

// Function to get the current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("location").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    document.getElementById("location").innerHTML = `Latitude: ${lat}, Longitude: ${lng}`;

    // Initialize the map
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng },
        zoom: 15
    });

    // Add a marker
    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: "You are here!"
    });

    // Save location to Firestore
    db.collection("locations").add({
        latitude: lat,
        longitude: lng,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Location added to Firestore");
    })
    .catch((error) => {
        console.error("Error adding location: ", error);
    });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("location").innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("location").innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById("location").innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("location").innerHTML = "An unknown error occurred.";
            break;
    }
}
