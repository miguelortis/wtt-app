'use client';

import { Modal, Form, Input, notification, Space, Button } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GeoPoint } from '@/types';
import { MinusCircleOutlined, PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Importación dinámica del mapa interactivo para evitar problemas de SSR con Leaflet
const InteractiveMapPicker = dynamic(() => import('@/components/InteractiveMapPicker'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-100 flex items-center justify-center rounded-lg text-slate-400">Cargando mapa interactivo...</div>
});

interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRouteModal({ isOpen, onClose }: CreateRouteModalProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'map' | 'manual'>('map');

  const createRoute = useMutation({
    mutationFn: async (values: { name: string; points: GeoPoint[] }) => {
      const formattedPoints = values.points.map(p => ({
        lat: Number(p.lat),
        lng: Number(p.lng),
        name: p.name || undefined
      }));
      return await api.post('/routes', { name: values.name, points: formattedPoints });
    },
    onSuccess: () => {
      notification.success({ title: 'Ruta creada', description: 'La nueva ruta se ha registrado exitosamente.' });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      form.resetFields();
      onClose();
    },
    onError: () => {
      notification.error({ title: 'Error', description: 'No se pudo crear la ruta. Verifica los datos.' });
    }
  });

  const pointsValue = Form.useWatch('points', form) || [];

  return (
    <Modal 
      title="Crear Nueva Ruta con Selector de Mapa" 
      open={isOpen} 
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createRoute.isPending}
      width={800}
      destroyOnClose
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={(values) => createRoute.mutate(values)}
        initialValues={{ points: [] }}
      >
        <Form.Item 
          name="name" 
          label="Nombre de la ruta" 
          rules={[{ required: true, message: 'El nombre es obligatorio' }]}
        >
          <Input size="large" placeholder="Ej: Ruta Norte - Sur" />
        </Form.Item>

        <div className="flex gap-2 mb-4">
          <Button 
            type={activeTab === 'map' ? 'primary' : 'default'} 
            onClick={() => setActiveTab('map')}
          >
            Seleccionar en el Mapa
          </Button>
          <Button 
            type={activeTab === 'manual' ? 'primary' : 'default'} 
            onClick={() => setActiveTab('manual')}
          >
            Ingresar Coordenadas Manuales
          </Button>
        </div>

        {activeTab === 'map' && (
          <div className="mb-6">
            <p className="text-xs text-slate-500 mb-2">
              Haz clic sobre el mapa para ir agregando los puntos de la ruta en orden correlativo.
            </p>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <InteractiveMapPicker 
                points={pointsValue} 
                onAddPoint={(lat, lng) => {
                  const currentPoints = form.getFieldValue('points') || [];
                  form.setFieldsValue({
                    points: [...currentPoints, { lat: lat.toFixed(6), lng: lng.toFixed(6), name: `Punto ${currentPoints.length + 1}` }]
                  });
                }} 
              />
            </div>
          </div>
        )}

        <label className="block font-semibold mb-2 text-slate-700 flex items-center gap-2">
          <EnvironmentOutlined className="text-blue-600" /> Puntos Geográficos Registrados ({pointsValue.length})
        </label>
        
        <Form.List name="points">
          {(fields, { add, remove }) => (
            <div className="space-y-3 max-h-62.5 overflow-y-auto pr-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {fields.length === 0 && (
                <p className="text-center text-slate-400 py-4 text-sm">
                  Aún no hay puntos. Haz clic en el mapa o añade coordenadas manualmente.
                </p>
              )}
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'lat']}
                    rules={[{ required: true, message: 'Falta lat' }]}
                  >
                    <Input placeholder="Latitud" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'lng']}
                    rules={[{ required: true, message: 'Falta lng' }]}
                  >
                    <Input placeholder="Longitud" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                  >
                    <Input placeholder="Nombre (opcional)" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} className="text-red-500 cursor-pointer" />
                </Space>
              ))}
              {activeTab === 'manual' && (
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Añadir Punto Manualmente
                  </Button>
                </Form.Item>
              )}
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}