'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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
  lat: number;
  lng: number;
  name?: string;
}

export default function Map({ points }: { points: Point[] }) {
  if (!points || points.length === 0) return <div className="h-96 bg-gray-100 flex items-center justify-center">No hay puntos en la ruta</div>;

  const center = [points[0].lat, points[0].lng] as [number, number];
  const positions = points.map(p => [p.lat, p.lng] as [number, number]);

  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {points.map((point, idx) => (
        <Marker key={idx} position={[point.lat, point.lng]} icon={customIcon}>
          <Popup>{point.name || `Punto ${idx + 1}`}</Popup>
        </Marker>
      ))}

      <Polyline positions={positions} color="blue" />
    </MapContainer>
  );
}