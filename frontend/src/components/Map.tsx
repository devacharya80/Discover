import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { startups } from "../utils/helper.ts";
import { calculateDistance } from "../utils/distance.ts";

function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const userLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const distanceCache = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,

      style: {
        version: 8,

        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
          },
        },

        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },

      center: [77.5946, 12.9716],
      zoom: 10,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current = map;

    startups.forEach((startup) => {
      const marker = new maplibregl.Marker().setLngLat([
        startup.longitude,
        startup.latitude,
      ]);

      marker.getElement().addEventListener("click", () => {
  const location = userLocationRef.current;

  if (!location) {
    console.log("User location unavailable");
    return;
  }

  let distance = distanceCache.current.get(startup.id);

  if (distance === undefined) {
    distance = calculateDistance(
      location.latitude,
      location.longitude,
      startup.latitude,
      startup.longitude,
    );

    distanceCache.current.set(startup.id, distance);

    console.log("Calculated distance:", distance);
  } else {
    console.log("Using cached distance:", distance);
  }

  marker.setPopup(
    new maplibregl.Popup().setHTML(`
      <div>
        <h3>${startup.name}</h3>
        <p>${startup.industry}</p>
        <p>📍 Bengaluru</p>
        <p>📏 ${distance.toFixed(1)} km away</p>
        <button>View Company</button>
      </div>
    `),
  );
});

      marker
        .setPopup(
          new maplibregl.Popup().setHTML(`
        <div>
          <h3>${startup.name}</h3>
          <p>${startup.industry}</p>
          <p>📍 Bengaluru</p>
          <p>📏 Distance unavailable</p>
          <button>View Company</button>
        </div>
      `),
        )
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;

        setUserLocation({
          latitude,
          longitude,
        });

        userLocationRef.current = {
          latitude,
          longitude,
        };

        const map = mapRef.current;

        if (!map) return;

        map.flyTo({
          center: [longitude, latitude],
          zoom: 14,
        });

        new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(map);
      },

      () => {
        alert("Unable to get your location.");
      },
    );
  };

  return (
    <>
      <button
        className="absolute bottom-4 right-4 z-10 rounded-xl bg-green-500 px-4 py-2 text-white shadow-xl"
        onClick={locateUser}
      >
        📍Me
      </button>

      {userLocation && (
        <div className="absolute left-4 top-4 z-10 rounded-xl bg-white p-4 shadow-xl">
          <p>Latitude: {userLocation.latitude}</p>

          <p>Longitude: {userLocation.longitude}</p>
        </div>
      )}

      <div ref={mapContainer} className="h-screen w-full" />
    </>
  );
}

export default MapView;
