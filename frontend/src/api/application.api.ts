import { api } from "./axios";
import type { Application } from "../types/application.type";
export const getApplications = async ():Promise<Application[]> => (await api.get("/applications/user/applications")).data.data;
export const withdrawApplication = async (id:string) => (await api.patch(`/applications/user/applications/${id}/withdraw`)).data;
