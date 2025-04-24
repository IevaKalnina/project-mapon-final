import React, { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export interface RoutePolylineProps {
  path: google.maps.LatLngLiteral[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ path }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || path.length === 0) return;

    const glow = new google.maps.Polyline({
      path,
      strokeColor: "#0077FF",
      strokeOpacity: 0.8,
      strokeWeight: 5,
      map,
    });

    const arrow: google.maps.Symbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 4,
      strokeColor: "#055cc0",
    };

    const line = new google.maps.Polyline({
      path,
      strokeOpacity: 0,
      icons: [{ icon: arrow, offset: "0%", repeat: "30px" }],
      map,
    });

    const bounds = new google.maps.LatLngBounds();
    path.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds);

    return () => {
      glow.setMap(null);
      line.setMap(null);
    };
  }, [map, path]);

  return null;
};

export default RoutePolyline;
