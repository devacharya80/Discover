import { useEffect, useState } from "react";
import { ArrowLeft, Briefcase, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApplications, withdrawApplication } from "../../../api/application.api";
import type { Application } from "../../../types/application.type";
const label=(v:string)=>v.replace(/_/g," ").toLowerCase().replace(/(^| )\w/g,m=>m.toUpperCase());
export default function Applications(){
 const navigate=useNavigate(); const [items,setItems]=useState<Application[]>([]); const [loading,setLoading]=useState(true);
 const load=()=>getApplications().then(setItems).catch(console.error).finally(()=>setLoading(false)); useEffect(()=>{load()},[]);
 return <div className="p-6"><header className="flex items-center gap-3"><button onClick={()=>navigate("/profile")} className="rounded-full p-2 hover:bg-gray-100"><ArrowLeft size={20}/></button><h1 className="text-2xl font-bold">Applications</h1></header>
 {loading?<p className="mt-8 text-sm text-gray-500">Loading applications...</p>:!items.length?<div className="mt-12 text-center"><Briefcase className="mx-auto text-gray-300" size={40}/><p className="mt-3 font-medium">No applications yet</p><p className="mt-1 text-sm text-gray-500">Apply to an active Discover job to track it here.</p></div>:
 <div className="mt-6 space-y-3">{items.map(a=><div key={a.id} className="rounded-2xl border border-gray-200 p-4">
 <button onClick={()=>navigate("/company/"+a.job.companyId+"/job/"+a.job.id)} className="w-full text-left"><h2 className="font-semibold">{a.job.title}</h2><p className="mt-1 text-sm text-gray-500">{a.job.company?.name ?? "Company"}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">{label(a.status)}</span><span className="text-xs text-gray-400">{new Date(a.appliedAt).toLocaleDateString()}</span></div></button>
 {a.status!=="WITHDRAWN" && !["REJECTED","HIRED"].includes(a.status) && <button onClick={async()=>{await withdrawApplication(a.id);load()}} className="mt-3 text-xs font-medium text-red-600 hover:underline">Withdraw</button>}
 {a.job.externalLink && <a href={a.job.externalLink} target="_blank" rel="noreferrer" className="ml-4 text-xs text-gray-500 hover:underline">Listing <ExternalLink size={12} className="inline"/></a>}
 </div>)}</div>}
 </div>
}
