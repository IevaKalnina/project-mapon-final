import React from "react";
import {
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import RoutePolyline from "./RoutePolyline";
import styles from "./map.module.scss";

export interface MapProps {
  path: google.maps.LatLngLiteral[];
  initialCenter: google.maps.LatLngLiteral;
  onCameraChanged?: (ev: MapCameraChangedEvent) => void;
}

const Map: React.FC<MapProps> = ({ path, initialCenter, onCameraChanged }) => {
  return (
    <GoogleMap
      className={styles.map}
      mapId="MAP_ID"
      defaultCenter={initialCenter}
      defaultZoom={13}
      onCameraChanged={onCameraChanged}
    >
      <RoutePolyline path={path} />

      {path.length > 0 && (
        <>
          <AdvancedMarker position={path[0]}>
            <Pin scale={1.2} />
          </AdvancedMarker>
          <AdvancedMarker position={path[path.length - 1]}>
            <Pin scale={1.2} />
          </AdvancedMarker>
        </>
      )}
    </GoogleMap>
  );
};

export default Map;
