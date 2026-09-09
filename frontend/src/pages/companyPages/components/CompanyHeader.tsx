import { ArrowLeft, Building2, Globe, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { CompanyWithLocations } from "../../../types/company.type";

interface CompanyHeaderProps {
  company: CompanyWithLocations;
}

function CompanyHeader({ company }: CompanyHeaderProps) {
  const navigate = useNavigate();

  const primaryLocation =
    company.companyLocations.find(
      (location) => location.isPrimary
    ) ?? company.companyLocations[0];

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Top bar */}

      <div className="flex items-center px-5 py-4">
        <button
          onClick={() => navigate("/")}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-gray-600
            transition
            hover:bg-gray-100
            hover:text-gray-900
          "
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Company identity */}

      <div className="px-6 pb-6">
        <div className="flex items-start gap-4">
          {/* Logo */}

          <div
            className="
              flex
              h-20
              w-20
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-gray-50
            "
          >
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2
                size={32}
                className="text-gray-400"
              />
            )}
          </div>

          {/* Name */}

          <div className="min-w-0 pt-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {company.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {company.industry}
            </p>
          </div>
        </div>

        {/* Location */}

        {primaryLocation && (
          <div className="mt-5 flex items-start gap-2 text-sm text-gray-600">
            <MapPin
              size={17}
              className="mt-0.5 shrink-0 text-gray-400"
            />

            <div>
              <p className="font-medium text-gray-700">
                {primaryLocation.city}
                {primaryLocation.state &&
                  `, ${primaryLocation.state}`}
              </p>

              {primaryLocation.address && (
                <p className="mt-0.5 text-xs text-gray-400">
                  {primaryLocation.address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Website */}

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:text-black
            "
          >
            <Globe size={16} />

            <span className="truncate">
              Visit website
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

export default CompanyHeader;