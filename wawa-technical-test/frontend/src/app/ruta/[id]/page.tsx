'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const DynamicMap = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 flex animate-pulse items-center justify-center rounded-lg">Cargando mapa...</div>
});

export default function RouteDetail() {
  const params = useParams();
  const routeId = params.id as string;

  const { data: route, isLoading } = useQuery({
    queryKey: ['route', routeId],
    queryFn: async () => {
      const res = await api.get(`/routes/${routeId}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando detalle de la ruta...</div>;
  if (!route) return <div className="p-10 text-center text-red-500">Ruta no encontrada</div>;

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/" className="text-gray-500 hover:text-gray-800 mb-4 inline-block">&larr; Volver a rutas</Link>
        <h1 className="text-3xl font-bold text-gray-800">{route.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recorrido</h2>
            
            <DynamicMap points={route.points} />
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Duties Asignados</h2>
            <p className="text-sm text-gray-500 mb-6">Gestiona las unidades y ventanas horarias de esta ruta.</p>
            
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-400">
              Aquí implementaremos el formulario de asignación y la lista de duties.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}