'use client';

import { Modal, Form, Input, notification, Space, Button } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useEffect } from 'react';
import { GeoPoint } from '@/types';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ 
        name: initialName, 
        points: initialPoints 
      });
    }
  }, [isOpen, initialName, initialPoints, form]);

  const updateRoute = useMutation({
    mutationFn: async (values: { name: string; points: GeoPoint[] }) => {
      // Aseguramos que lat y lng sean números limpios
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

  return (
    <Modal 
      title="Editar Ruta Completa" 
      open={isOpen} 
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={updateRoute.isPending}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={(values) => updateRoute.mutate(values)}>
        <Form.Item 
          name="name" 
          label="Nombre de la ruta" 
          rules={[{ required: true, message: 'El nombre es obligatorio' }]}
        >
          <Input size="large" placeholder="Ej: Ruta Principal" />
        </Form.Item>

        <label className="block font-semibold mb-2 text-slate-700">Puntos Geográficos (Ordenados)</label>
        
        <Form.List name="points">
          {(fields, { add, remove }) => (
            <div className="space-y-3 max-h-87.5 overflow-y-auto pr-2">
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'lat']}
                    rules={[{ required: true, message: 'Falta lat' }]}
                  >
                    <Input placeholder="Latitud (ej: 11.404)" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'lng']}
                    rules={[{ required: true, message: 'Falta lng' }]}
                  >
                    <Input placeholder="Longitud (ej: -69.673)" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                  >
                    <Input placeholder="Nombre del punto (opcional)" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} className="text-red-500 cursor-pointer" />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Añadir Punto Geográfico
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}