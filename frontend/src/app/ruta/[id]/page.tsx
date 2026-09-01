"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  notification,
  Spin,
  List,
  Tag,
  Popconfirm,
  Listy,
} from "antd";
import {
  ArrowLeftOutlined,
  CarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import EditRouteModal from "@/components/EditRouteModal";
import { ApiError, CreateDutyValues, Duty } from "@/types";

const DynamicMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-50 flex items-center justify-center rounded-xl border border-slate-200">
      <Spin />
    </div>
  ),
});

const { RangePicker } = DatePicker;

export default function RouteDetail() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: route, isLoading: routeLoading } = useQuery({
    queryKey: ["route", routeId],
    queryFn: async () => (await api.get(`/routes/${routeId}`)).data,
  });

  const { data: duties, isLoading: dutiesLoading } = useQuery({
    queryKey: ["duties", routeId],
    queryFn: async () => (await api.get(`/duties/route/${routeId}`)).data,
  });

  const deleteRoute = useMutation({
    mutationFn: async () => await api.delete(`/routes/${routeId}`),
    onSuccess: () => {
      notification.success({
        title: "Ruta eliminada",
        description: "La ruta y su historial de duties han sido eliminados.",
      });
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      router.push("/");
    },
    onError: () => {
      notification.error({
        title: "Error",
        description: "No se pudo eliminar la ruta.",
      });
    },
  });

  const createDuty = useMutation({
    mutationFn: async (values: CreateDutyValues) => {
      const payload = {
        routeId,
        unitId: values.unitId,
        startTime: values.timeRange[0].toISOString(),
        endTime: values.timeRange[1].toISOString(),
      };
      return await api.post("/duties", payload);
    },
    onSuccess: () => {
      notification.success({
        title: "Asignación exitosa",
        description: "El duty ha sido registrado correctamente.",
      });
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["duties", routeId] });
    },
    onError: (error: ApiError) => {
      if (error.response?.status === 409) {
        notification.error({
          title: "Error de Solapamiento",
          description:
            error?.response?.data?.message ||
            "La unidad ya tiene una asignación en ese horario.",
          placement: "topRight",
        });
      } else {
        notification.error({
          title: "Error",
          description: "Hubo un problema al procesar la solicitud.",
        });
      }
    },
  });

  const deleteDuty = useMutation({
    mutationFn: async (dutyId: string) => await api.delete(`/duties/${dutyId}`),
    onSuccess: () => {
      notification.success({
        title: "Asignación eliminada",
        description: "El vehículo ha sido liberado de este horario.",
      });
      queryClient.invalidateQueries({ queryKey: ["duties", routeId] });
    },
    onError: () => {
      notification.error({
        title: "Error",
        description: "No se pudo eliminar la asignación.",
      });
    },
  });

  if (routeLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  if (!route)
    return (
      <div className="p-10 text-center text-red-500">Ruta no encontrada</div>
    );

  const items: Array<{ id: number; content: React.ReactNode }> = duties.map(
    (duty: Duty, index: number) => ({
      id: index,
      content: (
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-slate-800">
              <CarOutlined className="mr-2" />
              {duty?.unitId}
            </span>
            <Tag color="blue">Asignado</Tag>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-slate-500 flex flex-col gap-1 mt-2">
              <span>
                <strong>Inicio:</strong>{" "}
                {dayjs(duty?.startTime).format("DD MMM YYYY, HH:mm")}
              </span>
              <span>
                <strong>Fin:</strong>{" "}
                {dayjs(duty?.endTime).format("DD MMM YYYY, HH:mm")}
              </span>
            </div>
            <div>
              <Popconfirm
                key="delete"
                title="¿Liberar esta unidad?"
                description="Se eliminará este duty del historial."
                onConfirm={() => deleteDuty.mutate(duty._id)}
                okText="Sí, eliminar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          </div>
        </div>
      ),
    }),
  );
  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/"
            className="text-slate-500 hover:text-blue-600 transition flex items-center gap-2 mb-4 w-fit"
          >
            <ArrowLeftOutlined /> Volver al panel
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-800">{route.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="default"
            icon={<EditOutlined />}
            size="large"
            onClick={() => setIsEditModalOpen(true)}
          >
            Editar Ruta
          </Button>

          <Popconfirm
            title="¿Eliminar toda la ruta?"
            description="Se borrará la ruta y todo el historial de duties asociado."
            onConfirm={() => deleteRoute.mutate()}
            okText="Sí, eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              size="large"
              loading={deleteRoute.isPending}
            >
              Eliminar Ruta
            </Button>
          </Popconfirm>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <EnvironmentOutlined className="text-blue-600" /> Recorrido
              Geográfico
            </h2>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <DynamicMap points={route.points} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Asignar Unidad (Duty)
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              El sistema validará que no existan solapamientos de horario para
              la misma unidad.
            </p>

            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => createDuty.mutate(values)}
            >
              <Form.Item
                name="unitId"
                label="ID de la Unidad (Vehículo)"
                rules={[
                  { required: true, message: "Ingresa el ID de la unidad" },
                ]}
              >
                <Input
                  prefix={<CarOutlined className="text-slate-400" />}
                  placeholder="Ej: VW-GOL-01"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="timeRange"
                label="Ventana Horaria (Inicio - Fin)"
                rules={[
                  { required: true, message: "Selecciona el rango de tiempo" },
                ]}
              >
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  size="large"
                  className="w-full"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                loading={createDuty.isPending}
              >
                Registrar Asignación
              </Button>
            </Form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ClockCircleOutlined className="text-blue-600" /> Historial de
              Asignaciones
            </h2>
            <Listy
              items={items}
              height={400}
              rowKey="id"
              itemRender={(item) => item.content}
            />
          </div>
        </div>
      </div>

      <EditRouteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        routeId={routeId}
        initialName={route.name}
        initialPoints={route.points}
      />
    </main>
  );
}
