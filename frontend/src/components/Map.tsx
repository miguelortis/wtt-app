'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  points: { lat: number; lng: number; name?: string }[];
}

export default function Map({ points }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    import('leaflet').then((L) => {
      const iconPrototype = L.Icon.Default.prototype as typeof L.Icon.Default.prototype & {
        _getIconUrl?: string;
      };
      delete iconPrototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && mapRef.current) {
        const initialLat = points?.[0]?.lat || 10.4806;
        const initialLng = points?.[0]?.lng || -66.9036;

        mapInstanceRef.current = L.map(mapRef.current).setView([initialLat, initialLng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapInstanceRef.current);
      }

      const map = mapInstanceRef.current;

      if (!map) return;

      map.eachLayer((layer: unknown) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });

      if (points && points.length > 0) {
        const latLngs = points.map((p) => [Number(p.lat), Number(p.lng)] as [number, number]);

        points.forEach((p) => {
          L.marker([Number(p.lat), Number(p.lng)])
            .addTo(map)
            .bindPopup(p.name || 'Punto de ruta');
        });

        const polyline = L.polyline(latLngs, { color: 'blue', weight: 4 }).addTo(map);
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [points]);

  return <div ref={mapRef} className="w-full h-96 z-0" />;
}