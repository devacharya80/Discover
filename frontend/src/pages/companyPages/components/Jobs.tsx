import { useEffect, useState } from "react";
import { Briefcase, ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyJobs } from "../../../api/job.api";
import type { Job } from "../../../types/job.type";

const label = (value: string) =>
  value.replace(/_/g, " ").toLowerCase().replace(/(^| )\w/g, (m) => m.toUpperCase());

function Jobs() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    getCompanyJobs(companyId, { limit: 20 })
      .then((response) => setJobs(response.data))
      .catch((error) => console.error("Unable to load jobs:", error))
      .finally(() => setLoading(false));
  }, [companyId]);

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading jobs...</div>;

  if (!jobs.length) {
    return (
      <div className="p-6 text-center">
        <Briefcase className="mx-auto text-gray-300" size={34} />
        <p className="mt-3 text-sm font-medium text-gray-700">No active jobs right now</p>
        <p className="mt-1 text-xs text-gray-400">Check back later for new opportunities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-5">
      {jobs.map((job) => {
        const location = job.location
          ? job.location.city + ", " + job.location.state
          : job.mode === "REMOTE" ? "Remote" : "Location not specified";

        return (
          <button
            key={job.id}
            onClick={() => navigate("/company/" + companyId + "/job/" + job.id)}
            className="group w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="rounded-full bg-gray-100 px-2 py-1">{label(job.type)}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-1">{label(job.mode)}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-1">{label(job.experienceLevel)}</span>
                </div>
              </div>
              <ChevronRight size={18} className="shrink-0 text-gray-400 transition group-hover:translate-x-1" />
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={14} />
              {location}
            </div>

            {job.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.skills.slice(0, 6).map((skill) => (
                  <span key={skill} className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {job.source === "EXTERNAL" && (
              <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-400">
                <ExternalLink size={12} /> External listing
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Jobs;
