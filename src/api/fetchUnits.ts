export interface RawUnit {
  unit_id: number;
  number: string;
  label: string;
  vehicle_title?: string | null;
  [key: string]: any;
}

export interface UnitListResponse {
  data: { units: RawUnit[] };
  error?: { code: number; msg: string };
}

const MAPON_API_KEY = process.env.REACT_APP_MAPON_API_KEY;
if (!MAPON_API_KEY) {
  throw new Error("Missing REACT_APP_MAPON_API_KEY in environment");
}

export async function fetchUnits(): Promise<UnitListResponse> {
  const url = `https://mapon.com/api/v1/unit/list.json?key=${MAPON_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as UnitListResponse;
}
