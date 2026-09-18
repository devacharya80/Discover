export interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  created: string;
  redirect_url: string;
  company: { display_name: string };
  location: { display_name: string; area: string[] };
  category: { label: string; tag: string };
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: number | string;
  contract_type?: string;
  contract_time?: string;
  latitude?: number;
  longitude?: number;
}

export interface AdzunaSearchResponse {
  results: AdzunaJob[];
  count: number;
}
