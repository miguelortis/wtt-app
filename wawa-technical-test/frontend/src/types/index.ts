import dayjs from "dayjs";

export interface GeoPoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface Route {
  _id: string;
  name: string;
  points: GeoPoint[];
  createdAt: string;
  updatedAt: string;
}

export interface Duty {
  _id: string;
  routeId: string;
  unitId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateDutyValues = {
  unitId: string;
  timeRange: [dayjs.Dayjs, dayjs.Dayjs];
};


export type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};