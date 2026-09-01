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
  if (!points || points.length === 0) {
    return (
      <div className="h-100 bg-slate-50 flex items-center justify-center rounded-xl border border-slate-200">
        <span className="text-slate-400">No hay puntos geográficos registrados</span>
      </div>
    );
  }

  const center = [points[0].lat, points[0].lng] as [number, number];
  const positions = points.map(p => [p.lat, p.lng] as [number, number]);

  return (
    // El 'key' sigue siendo importante para forzar la re-renderización de Leaflet si la ruta cambia, 
    // previniendo el error interno de appendChild de la librería.
    <MapContainer 
      key={center.toString()} 
      center={center} 
      zoom={14} 
      style={{ height: '400px', width: '100%', borderRadius: '0.75rem', zIndex: 1 }}
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {points.map((point, idx) => (
        <Marker key={idx} position={[point.lat, point.lng]} icon={customIcon}>
          <Popup>{point.name || `Punto ${idx + 1}`}</Popup>
        </Marker>
      ))}

      <Polyline positions={positions} color="#2563eb" weight={4} opacity={0.7} />
    </MapContainer>
  );
}