'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Spin, Empty } from 'antd';
import { PlusOutlined, EnvironmentOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Route } from '@/types';
import CreateRouteModal from '@/components/CreateRouteModal';

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: routes, isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const res = await api.get('/routes');
      return res.data;
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spin size="large" /></div>;

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Panel de Rutas</h1>
          <p className="text-slate-500 mt-1">Gestiona los trayectos y asignaciones de la flota.</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Crear Nueva Ruta
        </Button>
      </div>

      {!routes || routes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100">
          <Empty description="No hay rutas configuradas en el sistema" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route: Route) => (
            <div key={route._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <EnvironmentOutlined className="text-xl" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">{route.name}</h2>
              <p className="text-sm text-slate-500 mb-6">{route.points.length} puntos geográficos registrados</p>
              
              <Link href={`/ruta/${route._id}`}>
                <Button type="default" className="w-full flex items-center justify-between group-hover:text-blue-600 group-hover:border-blue-400">
                  <span>Gestionar Duties</span>
                  <ArrowRightOutlined />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Creación Modular */}
      <CreateRouteModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </main>
  );
}