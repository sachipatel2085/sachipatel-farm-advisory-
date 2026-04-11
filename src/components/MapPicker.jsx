import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

const MapPicker = ({ position, setPosition }) => {
  useEffect(() => {
    if (!position && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, [position, setPosition]);

  return (
    <MapContainer
      center={position ? [position.lat, position.lng] : [23.02, 72.57]}
      zoom={13}
      style={{ height: "300px", borderRadius: "12px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {position && (
        <Marker position={[position.lat, position.lng]} icon={icon} />
      )}

      <ClickHandler setPosition={setPosition} />
    </MapContainer>
  );
};

export default MapPicker;
