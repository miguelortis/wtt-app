'use client';

import { Modal, Form, Input, notification } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useEffect } from 'react';

interface EditRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeId: string;
  initialName: string;
}

export default function EditRouteModal({ isOpen, onClose, routeId, initialName }: EditRouteModalProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ name: initialName });
    }
  }, [isOpen, initialName, form]);

  const updateRoute = useMutation({
    mutationFn: async (values: { name: string }) => await api.patch(`/routes/${routeId}`, values),
    onSuccess: () => {
      notification.success({ title: 'Ruta actualizada', description: 'El nombre se guardó correctamente.' });
      queryClient.invalidateQueries({ queryKey: ['route', routeId] });
      onClose();
    },
    onError: () => {
      notification.error({ title: 'Error', description: 'No se pudo actualizar el nombre de la ruta.' });
    }
  });

  return (
    <Modal 
      title="Editar Nombre de la Ruta" 
      open={isOpen} 
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={updateRoute.isPending}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={(values) => updateRoute.mutate(values)}>
        <Form.Item 
          name="name" 
          label="Nombre de la ruta" 
          rules={[{ required: true, message: 'El nombre no puede estar vacío' }]}
        >
          <Input size="large" placeholder="Ej: Ruta Centro - Sur" />
        </Form.Item>
      </Form>
    </Modal>
  );
}