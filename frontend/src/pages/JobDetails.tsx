import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyJob } from "../api/job.api";
import type { Job } from "../types/job.type";

const label = (value: string) =>
  value.replace(/_/g, " ").toLowerCase().replace(/(^| )\w/g, (m) => m.toUpperCase());

function JobDetails() {
  const { companyId, jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId || !jobId) return;
    getCompanyJob(companyId, jobId)
      .then((response) => setJob(response.data))
      .catch((error) => console.error("Unable to load job:", error))
      .finally(() => setLoading(false));
  }, [companyId, jobId]);

  if (loading) return <div className="fixed left-0 top-0 z-50 h-screen w-full max-w-[480px] bg-white p-8 text-sm text-gray-500">Loading job...</div>;
  if (!job) return <div className="fixed left-0 top-0 z-50 h-screen w-full max-w-[480px] bg-white p-8 text-sm text-red-500">Job not found or no longer active.</div>;

  const location = job.location
    ? job.location.city + ", " + job.location.state
    : job.mode === "REMOTE" ? "Remote" : "Location not specified";

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-full max-w-[480px] overflow-y-auto bg-white shadow-2xl">
      <div className="sticky top-0 flex items-center gap-3 border-b border-gray-200 bg-white p-4">
        <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-medium text-gray-600">Job details</span>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{job.title}</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{label(job.type)}</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{label(job.mode)}</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{label(job.experienceLevel)}</span>
        </div>

        <div className="mt-5 flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} /> {location}
        </div>

        {(job.salaryMin !== null || job.salaryMax !== null) && (
          <p className="mt-3 text-sm font-medium text-gray-700">
            Salary: {job.salaryMin ?? "—"}{job.salaryMax !== null ? " - " + job.salaryMax : "+"}
          </p>
        )}

        {job.skills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span key={skill} className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600">{skill}</span>
            ))}
          </div>
        )}

        <section className="mt-7">
          <h2 className="text-sm font-semibold text-gray-900">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">{job.description}</p>
        </section>

        {job.externalLink && (
          <a
            href={job.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Apply / View listing <ExternalLink size={16} />
          </a>
        )}

        {job.source === "EXTERNAL" && (
          <p className="mt-3 text-center text-[11px] text-gray-400">External listing. Verify details on the original listing before applying.</p>
        )}
      </div>
    </aside>
  );
}

export default JobDetails;
