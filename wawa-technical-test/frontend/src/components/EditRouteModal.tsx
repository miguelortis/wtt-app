'use client';

import { Modal, Form, Input, notification, Space, Button } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GeoPoint } from '@/types';
import { MinusCircleOutlined, PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const InteractiveMapPicker = dynamic(() => import('@/components/InteractiveMapPicker'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-100 flex items-center justify-center rounded-lg text-slate-400">Cargando mapa interactivo...</div>
});

interface EditRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeId: string;
  initialName: string;
  initialPoints: GeoPoint[];
}

export default function EditRouteModal({ isOpen, onClose, routeId, initialName, initialPoints }: EditRouteModalProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'map' | 'manual'>('map');

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ 
        name: initialName, 
        points: initialPoints || [] 
      });
    }
  }, [isOpen, initialName, initialPoints, form]);

  const updateRoute = useMutation({
    mutationFn: async (values: { name: string; points: GeoPoint[] }) => {
      const formattedPoints = values.points.map(p => ({
        lat: Number(p.lat),
        lng: Number(p.lng),
        name: p.name || undefined
      }));
      return await api.patch(`/routes/${routeId}`, { name: values.name, points: formattedPoints });
    },
    onSuccess: () => {
      notification.success({ title: 'Ruta actualizada', description: 'Los cambios se guardaron correctamente.' });
      queryClient.invalidateQueries({ queryKey: ['route', routeId] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      onClose();
    },
    onError: () => {
      notification.error({ title: 'Error', description: 'No se pudo actualizar la ruta.' });
    }
  });

  const pointsValue = Form.useWatch('points', form) || [];

  return (
    <Modal 
      title="Editar Ruta Completa (con Mapa)" 
      open={isOpen} 
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={updateRoute.isPending}
      width={800}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={(values) => updateRoute.mutate(values)}>
        <Form.Item 
          name="name" 
          label="Nombre de la ruta" 
          rules={[{ required: true, message: 'El nombre es obligatorio' }]}
        >
          <Input size="large" placeholder="Ej: Ruta Principal" />
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
              Haz clic sobre el mapa para añadir nuevos puntos o visualizar los existentes.
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

        <label className="font-semibold mb-2 text-slate-700 flex items-center gap-2">
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