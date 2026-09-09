import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useParams } from "react-router-dom";

import { getCompany } from "../../api/company.api";
import type { CompanyWithLocations } from "../../types/company.type";

import CompanyHeader from "./components/CompanyHeader";
import CompanyTab from "./components/CompanyTabs";

function CompanyDetails() {
  const { companyId } = useParams();

  const [company, setCompany] =
    useState<CompanyWithLocations | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getCompany(companyId);

        setCompany(response.data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load company information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="
        fixed
        left-0
        top-0
        z-40
        h-screen
        w-full
        max-w-[480px]
        overflow-y-auto
        bg-white
        shadow-2xl
      "
    >
      {loading && (
        <div className="flex h-full items-center justify-center">
          <div className="text-sm text-gray-500">
            Loading company...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="flex h-full items-center justify-center px-6">
          <p className="text-center text-sm text-red-500">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && company && (
        <>
        <CompanyHeader company={company} />
        <CompanyTab company={company}/>
        </>
      )}
    </motion.aside>
  );
}

export default CompanyDetails;