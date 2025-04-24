import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { fetchUnits, RawUnit } from "../api/fetchUnits";
import { fetchRoutes, RawRoutePiece } from "../api/fetchRoutes";
import maponLogo from "../assets/logos/maponLogo.svg";
import Image from "../components/Logo/Logo";
import "react-calendar/dist/Calendar.css";
import RouteForm from "../components/RouteForm/RouteForm";
import Stats, { Stat } from "../components/Stats/Stats";
import Wrapper from "../components/Wrapper/Wrapper";
import Map from "../components/Map/Map";
import Footer from "../components/Footer/Footer";
import { Vehicle } from "../components/Dropdown/Dropdown";
import Loading from "../components/Loading/Loading";

export type FormValues = {
  number: string;
  fromDate: Date;
  toDate: Date;
};

const VehicleRoutes: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [statsData, setStatsData] = useState<Stat[]>([
    { value: "0.0", label: "Km driven" },
    { value: "0h 00m", label: "Driving time" },
    { value: "0h 00m", label: "Total time" },
  ]);
  const [loading, setLoading] = useState(false);
  const [routeLoaded, setRouteLoaded] = useState(false);

  const methods = useForm<FormValues>({
    defaultValues: {
      number: "",
      fromDate: new Date(),
      toDate: new Date(),
    },
  });

  const { handleSubmit, watch } = methods;
  const selectedNumber = watch("number");

  useEffect(() => {
    fetchUnits()
      .then((resp) =>
        setVehicles(
          resp.data.units.map((u: RawUnit) => ({
            unit_id: u.unit_id,
            number: u.number,
            label: u.vehicle_title || u.label,
          }))
        )
      )
      .catch(console.error);
  }, []);

  const onSubmit = async ({ number, fromDate, toDate }: FormValues) => {
    const v = vehicles.find((v) => v.number === number);
    if (!v) return console.error("Unknown vehicle:", number);

    setLoading(true);
    setRouteLoaded(false);

    try {
      const fmt = (d: Date) => d.toISOString().split(".")[0] + "Z";
      const resp = await fetchRoutes(v.unit_id, fmt(fromDate), fmt(toDate));
      const pieces: RawRoutePiece[] = resp.data.units[0]?.routes || [];

      // Build detailed path from decoded points
      const detailed = pieces.flatMap(
        (r) =>
          r.decoded_route?.points.map((p) => ({
            lat: p.lat,
            lng: p.lng,
          })) || []
      );

      // Fallback to stop locations if no decoded points
      const fallback = pieces.map((r) => ({
        lat: r.start.lat,
        lng: r.start.lng,
      }));

      const finalPath = detailed.length > 0 ? detailed : fallback;
      setPath(finalPath);

      let km = 0,
        driveMs = 0,
        idleMs = 0;
      pieces.forEach((r) => {
        if (!r.start?.time || !r.end?.time) return;
        const dur = Date.parse(r.end.time) - Date.parse(r.start.time);
        if (r.type === "route" && typeof r.distance === "number") {
          km += r.distance / 1000;
          driveMs += dur;
        } else {
          idleMs += dur;
        }
      });

      const toHhMm = (ms: number) => {
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        return `${h}h ${m.toString().padStart(2, "0")}m`;
      };

      setStatsData([
        { value: (Math.round(km * 10) / 10).toString(), label: "Km driven" },
        { value: toHhMm(driveMs), label: "Driving time" },
        { value: toHhMm(idleMs), label: "Total time" },
      ]);

      setRouteLoaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initialCenter = { lat: 56.9496488, lng: 24.1051865 };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Wrapper>
          <Image src={maponLogo} width={200} alt="Mapon logo" />

          <RouteForm vehicles={vehicles} />

          {loading && <Loading message="Loading route…" />}

          {routeLoaded && (
            <Map
              path={path}
              initialCenter={initialCenter}
              onCameraChanged={(ev: MapCameraChangedEvent) =>
                console.log("camera:", ev.detail.center, ev.detail.zoom)
              }
            />
          )}

          {routeLoaded && <Stats stats={statsData} />}

          <Footer disabled={!selectedNumber} />
        </Wrapper>
      </form>
    </FormProvider>
  );
};

export default VehicleRoutes;
