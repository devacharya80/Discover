import { api } from "./axios";
import type {
  ApiResponse,
  Company,
  CompanyLocation,
  CompanyWithLocations,
  CreateCompanyType,
  UpdateCompanyType,
  CreateCompanyLocationType,
  UpdateCompanyLocationType,
} from "../types/company.type";

// ==========================================
// Company Operations
// ==========================================

export const createCompany = async (
  data: CreateCompanyType
): Promise<ApiResponse<Company>> => {
  const response = await api.post<ApiResponse<Company>>("/company", data);
  return response.data;
};

export const getCompany = async (
  companyId: string
): Promise<ApiResponse<CompanyWithLocations>> => {
  const response = await api.get<ApiResponse<CompanyWithLocations>>(
    `/company/${companyId}`
  );
  return response.data;
};

export const updateCompany = async (
  companyId: string,
  data: UpdateCompanyType
): Promise<ApiResponse<Company>> => {
  const response = await api.patch<ApiResponse<Company>>(
    `/company/${companyId}`,
    data
  );
  return response.data;
};

// ==========================================
// Company Location Operations
// ==========================================

export const getCompanyLocations = async (
  companyId: string
): Promise<ApiResponse<CompanyLocation[]>> => {
  const response = await api.get<ApiResponse<CompanyLocation[]>>(
    `/company/${companyId}/locations`
  );
  return response.data;
};

export const createCompanyLocation = async (
  companyId: string,
  data: CreateCompanyLocationType
): Promise<ApiResponse<CompanyLocation>> => {
  const response = await api.post<ApiResponse<CompanyLocation>>(
    `/company/${companyId}/locations`,
    data
  );
  return response.data;
};

export const updateCompanyLocation = async (
  companyId: string,
  locationId: string,
  data: UpdateCompanyLocationType
): Promise<ApiResponse<CompanyLocation>> => {
  const response = await api.patch<ApiResponse<CompanyLocation>>(
    `/company/${companyId}/locations/${locationId}`,
    data
  );
  return response.data;
};

export const deleteCompanyLocation = async (
  companyId: string,
  locationId: string
): Promise<ApiResponse<CompanyLocation>> => {
  const response = await api.delete<ApiResponse<CompanyLocation>>(
    `/company/${companyId}/locations/${locationId}`
  );
  return response.data;
};