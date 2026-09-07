import type { Request, Response } from "express";
import {
  createCompanyService,
  getCompanyService,
  updateCompanyService,
  createCompanyLocationService,
  getCompanyLocationService,
  updateCompanyLocationservice,
  deleteCompanyLocationService,
} from "../services/company.service.js";
import {
  createCompanySchema,
  updateCompanySchema,
  createCompanyLocationSchema,
  updateCompanyLocationSchema,
} from "../types/company.schema.js";

export const createCompanyController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const validatedCompanyData = createCompanySchema.safeParse(req.body);
    if (!validatedCompanyData.success) {
      return res
        .status(400)
        .json({
          message: "Invalid company data",
          errors: validatedCompanyData.error.flatten().fieldErrors,
        });
    }
    const company = await createCompanyService(
      userId,
      validatedCompanyData.data,
    );
    return res
      .status(201)
      .json({ message: "Company created successfully", data: company });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: "Error while creating company, Please try again later",
      });
  }
};

export const getCompanyController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    if (typeof companyId !== "string")
      return res.status(400).json({ message: "Invalid company ID" });
    const company = await getCompanyService(companyId);
    return res
      .status(200)
      .json({ message: "Company data fetched successfully", data: company });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while getting company, Please try again later" });
  }
};

export const updateCompanyController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const userId = req.user.userId;
    if (typeof companyId !== "string")
      return res.status(400).json({ message: "Invalid company ID" });
    const validatedCompanyData = updateCompanySchema.safeParse(req.body);
    if (!validatedCompanyData.success)
      return res
        .status(400)
        .json({
          message: "Invalid company data",
          errors: validatedCompanyData.error.flatten().fieldErrors,
        });
    const company = await updateCompanyService(
      userId,
      companyId,
      validatedCompanyData.data,
    );
    return res
      .status(200)
      .json({ message: "Company updated successfully", data: company });
  } catch (err: any) {
    console.error(err);
    if (
      err.message === "You are not a member of this company" ||
      err.message === "You need authorization"
    )
      return res.status(403).json({ message: err.message });
    return res
      .status(500)
      .json({
        message: "Error while updating company, Please try again later",
      });
  }
};

export const createCompanyLocationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const companyId = req.params.companyId;
    const userId = req.user.userId;
    if (typeof companyId !== "string")
      return res.status(400).json({ message: "Invalid company ID" });
    const validatedLocationData = createCompanyLocationSchema.safeParse(
      req.body,
    );
    if (!validatedLocationData.success)
      return res
        .status(400)
        .json({
          message: "Enter valid input",
          errors: validatedLocationData.error.flatten().fieldErrors,
        });
    const location = await createCompanyLocationService(
      userId,
      companyId,
      validatedLocationData.data,
    );
    return res
      .status(201)
      .json({
        message: "Company location created successfully",
        data: location,
      });
  } catch (err: any) {
    console.error(err);
    if (err.message.startsWith("Unauthorized"))
      return res.status(403).json({ message: err.message });
    return res
      .status(500)
      .json({
        message:
          "Error while creating company location, Please try again later",
      });
  }
};

export const getCompanyLocationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string")
      return res.status(400).json({ message: "Invalid company ID" });
    const locations = await getCompanyLocationService(companyId);
    return res
      .status(200)
      .json({
        message: "Company locations fetched successfully",
        data: locations,
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message:
          "Error while getting company locations, Please try again later",
      });
  }
};

export const updateCompanyLocationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user.userId;
    const locationId = req.params.locationId;
    const companyId = req.params.companyId;
    if (typeof companyId !== "string" || typeof locationId !== "string")
      return res
        .status(400)
        .json({ message: "Invalid location or company ID" });
    const validatedLocationData = updateCompanyLocationSchema.safeParse(
      req.body,
    );
    if (!validatedLocationData.success)
      return res
        .status(400)
        .json({
          message: "Enter valid input location",
          errors: validatedLocationData.error.flatten().fieldErrors,
        });
    const updatedLocation = await updateCompanyLocationservice(
      userId,
      companyId,
      locationId,
      validatedLocationData.data,
    );
    return res
      .status(200)
      .json({
        message: "Location updated successfully",
        data: updatedLocation,
      });
  } catch (err: any) {
    console.error(err);
    if (err.message.startsWith("Unauthorized"))
      return res.status(403).json({ message: err.message });
    if (err.message === "Location not found for this company")
      return res.status(404).json({ message: err.message });
    return res
      .status(500)
      .json({
        message:
          "Error while updating company location, Please try again later",
      });
  }
};

export const deleteCompanyLocationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user.userId;
    const companyId = req.params.companyId;
    const locationId = req.params.locationId;
    if (typeof companyId !== "string" || typeof locationId !== "string")
      return res
        .status(400)
        .json({ message: "Invalid location or company ID" });
    const deletedLocation = await deleteCompanyLocationService(
      userId,
      companyId,
      locationId,
    );
    return res
      .status(200)
      .json({
        message: "Company location deleted successfully",
        data: deletedLocation,
      });
  } catch (err: any) {
    console.error(err);
    if (err.message.startsWith("Unauthorized"))
      return res.status(403).json({ message: err.message });
    if (err.message === "Location not found for this company")
      return res.status(404).json({ message: err.message });
    return res
      .status(500)
      .json({
        message:
          "Error while deleting company location, Please try again later",
      });
  }
};
