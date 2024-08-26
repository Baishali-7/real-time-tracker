const socket = io(); 


if (navigator.geolocation) {
    
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Sending location:', { latitude, longitude });
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
} else {
    console.error("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 16);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map "
}).addTo(map);


const markers = {};


socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    console.log('Received location data:', data);

    
    map.setView([latitude, longitude], 16);

    
    if (markers[id]) {
        console.log('Updating marker position for ID:', id);
        markers[id].setLatLng([latitude, longitude]); 
    } else {
        console.log('Adding new marker for ID:', id);
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});


socket.on("user-disconnected", (id) => {
    console.log('User disconnected:', id);
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
