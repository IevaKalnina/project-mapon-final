import React, { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export interface RoutePolylineProps {
  path: google.maps.LatLngLiteral[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ path }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || path.length === 0) return;

    const poly = new google.maps.Polyline({
      path,
      strokeColor: "#0077FF",
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });
    poly.setMap(map);

    const bounds = new google.maps.LatLngBounds();
    path.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds);

    return () => void poly.setMap(null);
  }, [map, path]);

  return null;
};

export default RoutePolyline;
