import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, MapPin, Globe, Building2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getCompany } from "../../api/company.api";
import type { CompanyWithLocations } from "../../types/company.type";

function CompanyDetails() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<CompanyWithLocations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!companyId) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCompany(companyId);

        setCompany(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load company details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  const handleClose = () => {
    navigate("/");
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="fixed left-0 top-0 z-40 h-screen w-full max-w-[480px] overflow-y-auto border-r border-white/10 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur">
          <button
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <span className="text-sm font-medium text-gray-500">
            Company
          </span>

          <div className="w-10" />
        </div>

        {/* Content */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-sm text-gray-500">
              Loading company...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
            <p className="text-sm text-red-500">
              {error}
            </p>

            <button
              onClick={handleClose}
              className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Back to Map
            </button>
          </div>
        )}

        {!loading && !error && company && (
          <div className="px-6 pb-10">

            {/* Company identity */}
            <div className="pt-8">

              <div className="flex items-center gap-4">

                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-black text-2xl font-bold text-white">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {company.name}
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    {company.industry}
                  </p>
                </div>

              </div>

            </div>

            {/* Quick information */}
            <div className="mt-7 space-y-3">

              {company.companyLocations.length > 0 && (
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 text-gray-500"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      {company.companyLocations[0].city}
                    </p>

                    <p className="text-xs text-gray-500">
                      {company.companyLocations[0].state},{" "}
                      {company.companyLocations[0].country}
                    </p>
                  </div>
                </div>
              )}

              {company.website && (
                <div className="flex items-center gap-3">
                  <Globe
                    size={18}
                    className="text-gray-500"
                  />

                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visit website
                  </a>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Building2
                  size={18}
                  className="text-gray-500"
                />

                <p className="text-sm">
                  {company.companySize}
                </p>
              </div>

            </div>

            {/* Tabs */}
            <div className="mt-8 flex gap-7 border-b border-gray-200">
              <button className="border-b-2 border-black pb-3 text-sm font-semibold">
                About
              </button>

              <button className="pb-3 text-sm font-medium text-gray-500">
                Jobs
              </button>

              <button className="pb-3 text-sm font-medium text-gray-500">
                People
              </button>
            </div>

            {/* About */}
            <section className="pt-6">

              <h2 className="text-lg font-semibold">
                About
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {company.description ||
                  "No company description available."}
              </p>

            </section>

          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}

export default CompanyDetails;