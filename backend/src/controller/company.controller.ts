import type { Request, Response } from "express"
import {createCompanyService, getCompanyService,updateCompanyService} from "../services/company.service.js";
import {createCompanySchema,updateCompanySchema} from "../types/company.schema.js"

export const createCompanyController = async (req: Request, res: Response) => {
    try{
        const userId : string = req.user.userId;
        const validatedCompanyData = createCompanySchema.safeParse(req.body);

        if(!validatedCompanyData.success) {
            return res.status(400).json({
                message: "Invalid company data",
            });
        }

        const company = await createCompanyService(userId,validatedCompanyData.data);

        return res.status(201).json({
            message: "Company created successfully",
            data : company
        })
    }catch(err:any){
        console.log(err)
        return res.status(500).json({
            message : "Error while creating company, Please try again later",
        })
    }
}

export const getCompanyController = async (req: Request, res: Response) => {
    try{
        const companyId = req.params.id;
        const company = await getCompanyService(companyId);

        return res.status(200).json({
            message: "Company data fetched successfully",
            data : company
        })
    }catch(err:any){
        console.log(err)
        return res.status(500).json({
            message : "Error while getting company, Please try again later",
        })
    }
}

export const updateCompanyController  = async (req: Request, res: Response) => {
    try{
        const companyId = req.params.id;
        const userId = req.user.userId
        if (typeof companyId !== "string") {
            return res.status(400).json({
                message: "Invalid company ID",
            });
        }
        const validatedCompanyData = updateCompanySchema.safeParse(req.body);

        if(!validatedCompanyData.success){
            return res.status(400).json({
                message: "Invalid company data",
            });
        }

        const company = await updateCompanyService(userId,companyId,validatedCompanyData.data)

        return res.status(201).json({
            message: "Company updated  successfully",
            data : company
        })
    }catch(err:any){
        console.log(err)
        return res.status(500).json({
            message : "Error while updating company, Please try again later",
        })
    }
}