'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function Home() {
  const queryClient = useQueryClient();

  const { data: routes, isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const res = await api.get('/routes');
      return res.data;
    },
  });

  const createMockRoute = useMutation({
    mutationFn: async () => {
      return api.post('/routes', {
        name: 'Ruta Centro - Norte',
        points: [
          { lat: 11.404, lng: -69.673, name: 'Punto A (Inicio)' },
          { lat: 11.410, lng: -69.670, name: 'Punto B' },
          { lat: 11.415, lng: -69.665, name: 'Punto C (Destino)' }
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    }
  });

  if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando rutas...</div>;

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rutas de Transporte</h1>
        <button 
          onClick={() => createMockRoute.mutate()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Crear Ruta de Prueba
        </button>
      </div>

      {routes?.length === 0 ? (
        <p className="text-gray-500 border-2 border-dashed border-gray-300 p-10 text-center rounded-lg">
          No hay rutas creadas. Usa el botón de arriba para generar una.
        </p>
      ) : (
        <div className="grid gap-4">
          {routes?.map((route: any) => (
            <div key={route._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{route.name}</h2>
                <p className="text-sm text-gray-500">{route.points.length} puntos geográficos</p>
              </div>
              <Link 
                href={`/ruta/${route._id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                Ver Mapa y Duties &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}