import type { CompanyWithLocations } from "../../../types/company.type";
import { Building2, Calendar, Users, CircleCheck } from "lucide-react";
interface AboutProp {
  company: CompanyWithLocations;
}
function About({ company }: AboutProp) {
  return (
    <section className="px-6 py-6">
      {" "}
      <h2 className="text-lg font-semibold text-gray-900"> About </h2>{" "}
      {/* Company information */}{" "}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {" "}
        {/* Industry */}{" "}
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          {" "}
          <div className="flex items-center gap-2">
            <Building2 size={15} />
            <p className="text-xs font-medium text-gray-400"> Industry </p>{" "}
          </div>
          <p className="mt-1 text-sm font-semibold text-gray-700">
            {" "}
            {company.industry}{" "}
          </p>{" "}
        </div>{" "}
        {/* Founded */}{" "}
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          {" "}
          <div className="flex items-center gap-2 ">
            <Calendar size={15} />
            <p className="text-xs font-medium text-gray-400"> Founded </p>{" "}
          </div>
          <p className="mt-1 text-sm font-semibold text-gray-700">
            {" "}
            {company.foundedYear ?? "Not Available"}{" "}
          </p>{" "}
        </div>{" "}
        {/* Company Size */}{" "}
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          {" "}
          <div className="flex items-center gap-2">
            <Users size={15} />
            <p className="text-xs font-medium text-gray-400">
              {" "}
              Company Size{" "}
            </p>{" "}
          </div>
          <p className="mt-1 text-sm font-semibold text-gray-700">
            {" "}
            {company.companySize ?? "Not Available"}{" "}
          </p>{" "}
        </div>{" "}
        {/* Status */}{" "}
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          {" "}
          <div className="flex items-center gap-2">
            <CircleCheck size={15} />
            <p className="text-xs font-medium text-gray-400"> Status </p>{" "}
          </div>
          <p
            className={`mt-1 text-sm font-semibold ${company.status === "ACTIVE" ? "text-green-600" : "text-gray-600"}`}
          >
            {" "}
            {company.status ?? "Not Available"}{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Description */}{" "}
      <div className="mt-5">
        <h2 className="text-lg font-semibold text-gray-900">Description</h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {company.description || "No description available."}
        </p>
      </div>
    </section>
  );
}
export default About;
