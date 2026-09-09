import { useState } from "react";
import type { CompanyWithLocations } from "../../../types/company.type";

import About from "./About";
import People from "./People";

type CompanyTab = "about" | "jobs" | "people";

interface CompanyTabProps{
  company : CompanyWithLocations;
}

function 
CompanyTabs({company} : CompanyTabProps) {
  const [activeTab, setActiveTab] = useState<CompanyTab>("about");

  const tabs: { id: CompanyTab; label: string }[] = [
    {
      id: "about",
      label: "About",
    },
    {
      id: "jobs",
      label: "Jobs",
    },
    {
      id: "people",
      label: "People",
    },
  ];

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
                relative
                border-b-2
                px-4
                py-3
                text-sm
                font-medium
                transition
                ${
                activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "about" && <About company={company}/>}
        {activeTab === "jobs" && <div>Jobs Content</div>}
        {activeTab === "people" && <People count={0}/>}
      </div>
    </div>
  );
}

export default CompanyTabs;
