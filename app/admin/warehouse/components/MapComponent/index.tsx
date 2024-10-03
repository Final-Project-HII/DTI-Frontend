import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LatLng {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  position: LatLng;
  setPosition: (position: LatLng) => void;
}

const DraggableMarker: React.FC<MapComponentProps> = ({ position, setPosition }) => {
  const markerRef = useRef<L.Marker | null>(null);
  const map = useMap();

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.on('dragend', () => {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          map.panTo(newPos);
        }
      });
    }
  }, [map, setPosition]);

  useEffect(() => {
    map.panTo(position);
  }, [map, position]);

  return (
    <Marker
      draggable={true}
      position={position}
      ref={markerRef}
    />
  );
};

const MapComponent: React.FC<MapComponentProps> = ({ position, setPosition }) => {
  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
};

export default MapComponent;