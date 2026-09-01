'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Point {
  lat: number | string;
  lng: number | string;
  name?: string;
}

interface MapEventsProps {
  onAddPoint: (lat: number, lng: number) => void;
}

function ClickHandler({ onAddPoint }: MapEventsProps) {
  useMapEvents({
    click(e) {
      onAddPoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function InteractiveMapPicker({ points, onAddPoint }: { points: Point[]; onAddPoint: (lat: number, lng: number) => void }) {
  
  const defaultCenter: [number, number] = points.length > 0 && Number(points[0].lat) 
    ? [Number(points[0].lat), Number(points[0].lng)] 
    : [11.404, -69.673];

  const validPoints = points.filter(p => !isNaN(Number(p.lat)) && !isNaN(Number(p.lng)));
  const positions = validPoints.map(p => [Number(p.lat), Number(p.lng)] as [number, number]);

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={13} 
      style={{ height: '300px', width: '100%', zIndex: 1 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler onAddPoint={onAddPoint} />
      
      {validPoints.map((point, idx) => (
        <Marker key={idx} position={[Number(point.lat), Number(point.lng)]} icon={customIcon}>
          <Popup>{point.name || `Punto ${idx + 1}`}</Popup>
        </Marker>
      ))}

      {positions.length > 1 && <Polyline positions={positions} color="#2563eb" weight={4} />}
    </MapContainer>
  );
}