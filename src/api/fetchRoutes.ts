export interface RoutePoint {
  gmt: string;
  lat: number;
  lng: number;
  speed: number;
}

export interface RawRoutePiece {
  type: "route" | "stop";
  decoded_route?: { points: RoutePoint[] };
  [key: string]: any;
}

export interface RouteListResponse {
  data: {
    units: Array<{ unit_id: number; routes: RawRoutePiece[] }>;
  };
  error?: { code: number; msg: string };
}

function stripMs(iso: string): string {
  return iso.replace(/\.\d{1,}Z$/, "Z");
}

const MAPON_API_KEY = process.env.REACT_APP_MAPON_API_KEY;
if (!MAPON_API_KEY) {
  throw new Error("Missing REACT_APP_MAPON_API_KEY in environment");
}

export async function fetchRoutes(
  unit_id: number,
  from: string,
  till: string
): Promise<RouteListResponse> {
  const cleanFrom = stripMs(from);
  const cleanTill = stripMs(till);
  const url =
    `https://mapon.com/api/v1/route/list.json` +
    `?key=${MAPON_API_KEY}` +
    `&unit_id=${unit_id}` +
    `&from=${encodeURIComponent(cleanFrom)}` +
    `&till=${encodeURIComponent(cleanTill)}` +
    `&include[]=decoded_route`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as RouteListResponse;
}
