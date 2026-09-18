import { useState } from "react";
import type { CompanyWithLocations } from "../../../types/company.type";
import About from "./About";
import People from "./People";
import Jobs from "./Jobs";

type CompanyTab = "about" | "jobs" | "people";

interface CompanyTabProps {
  company: CompanyWithLocations;
}

function CompanyTabs({ company }: CompanyTabProps) {
  const [activeTab, setActiveTab] = useState<CompanyTab>("about");

  return (
    <div>
      <div className="flex border-b border-gray-200 px-6">
        {(["about", "jobs", "people"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              "relative border-b-2 px-4 py-3 text-sm font-medium transition " +
              (activeTab === tab
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-900")
            }
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "about" && <About company={company} />}
      {activeTab === "jobs" && <Jobs />}
      {activeTab === "people" && <People />}
    </div>
  );
}

export default CompanyTabs;
