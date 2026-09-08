import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from "react-router-dom";

import { calculateDistance } from "../utils/distance";
import { getCompanies } from "../api/company.api";
import type { CompanyWithLocations } from "../types/company.type";

function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const companyMarkersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  const userLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const distanceCacheRef = useRef<Map<string, number>>(new Map());

  const [companies, setCompanies] = useState<CompanyWithLocations[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const navigate = useNavigate();

  // --------------------------------------------------
  // Initialize map
  // --------------------------------------------------

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
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
      zoom: 11,
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // --------------------------------------------------
  // Fetch companies
  // --------------------------------------------------

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getCompanies();

        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // --------------------------------------------------
  // Get user's current location
  // --------------------------------------------------

  const locateUser = () => {
    if (!mapRef.current) return;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const location = {
          latitude,
          longitude,
        };

        setUserLocation(location);
        userLocationRef.current = location;

        // Clear cached distances because user's position changed
        distanceCacheRef.current.clear();

        // Remove previous user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        // Create user marker
        const markerElement = document.createElement("div");

        markerElement.style.width = "18px";
        markerElement.style.height = "18px";
        markerElement.style.borderRadius = "50%";
        markerElement.style.backgroundColor = "#2563eb";
        markerElement.style.border = "3px solid white";
        markerElement.style.boxShadow =
          "0 2px 8px rgba(0, 0, 0, 0.3)";

        const marker = new maplibregl.Marker({
          element: markerElement,
        })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current!);

        userMarkerRef.current = marker;

        // Move map to user's location
        mapRef.current!.flyTo({
          center: [longitude, latitude],
          zoom: 13,
          essential: true,
        });
      },
      (error) => {
        console.error("Location error:", error);

        alert(
          "Unable to get your location. Please allow location access."
        );
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  // --------------------------------------------------
  // Create company markers
  // --------------------------------------------------

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    // Remove old company markers
    companyMarkersRef.current.forEach((marker) => {
      marker.remove();
    });

    companyMarkersRef.current = [];

    companies.forEach((company) => {
      company.companyLocations.forEach((location) => {
        if (
          location.latitude === null ||
          location.longitude === null
        ) {
          return;
        }

        const latitude = location.latitude;
        const longitude = location.longitude;

        // ----------------------------------------------
        // Calculate distance
        // ----------------------------------------------

        let distance: number | null = null;

        if (userLocationRef.current) {
          const cachedDistance =
            distanceCacheRef.current.get(location.id);

          if (cachedDistance !== undefined) {
            distance = cachedDistance;
          } else {
            distance = calculateDistance(
              userLocationRef.current.latitude,
              userLocationRef.current.longitude,
              latitude,
              longitude
            );

            distanceCacheRef.current.set(
              location.id,
              distance
            );
          }
        }

        // ----------------------------------------------
        // Create marker
        // ----------------------------------------------

        const markerElement = document.createElement("div");

        markerElement.className = "company-marker";

        markerElement.innerHTML = `
          <div
            style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: white;
              border: 2px solid #111827;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              cursor: pointer;
              font-size: 14px;
              font-weight: 700;
            "
          >
            ${company.name.charAt(0).toUpperCase()}
          </div>
        `;

        // ----------------------------------------------
        // Popup HTML
        // ----------------------------------------------

        const logoHtml = company.logoUrl
          ? `
            <img
              src="${company.logoUrl}"
              alt="${company.name}"
              style="
                width: 48px;
                height: 48px;
                border-radius: 10px;
                object-fit: cover;
                border: 1px solid #e5e7eb;
              "
            />
          `
          : `
            <div
              style="
                width: 48px;
                height: 48px;
                border-radius: 10px;
                background: #f3f4f6;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-weight: 700;
                color: #111827;
              "
            >
              ${company.name.charAt(0).toUpperCase()}
            </div>
          `;

        const distanceHtml =
          distance !== null
            ? `
              <div
                style="
                  font-size: 12px;
                  color: #6b7280;
                  margin-top: 4px;
                "
              >
                ${distance.toFixed(1)} km away
              </div>
            `
            : "";

        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: true,
          maxWidth: "320px",
        }).setHTML(`
          <div
            class="discover-popup"
            style="
              width: 260px;
              padding: 4px;
            "
          >
            <!-- Company header -->

            <div
              style="
                display: flex;
                gap: 12px;
                align-items: center;
                margin-bottom: 12px;
              "
            >
              ${logoHtml}

              <div style="min-width: 0;">
                <div
                  style="
                    font-size: 16px;
                    font-weight: 700;
                    color: #111827;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  ${company.name}
                </div>

                <div
                  style="
                    font-size: 12px;
                    color: #6b7280;
                    margin-top: 2px;
                  "
                >
                  ${company.industry}
                </div>
              </div>
            </div>

            <!-- Location -->

            <div
              style="
                font-size: 13px;
                color: #374151;
                margin-bottom: 4px;
              "
            >
              📍 ${location.name}
            </div>

            <div
              style="
                font-size: 12px;
                color: #6b7280;
              "
            >
              ${location.city}, ${location.state}
            </div>

            ${distanceHtml}

            <!-- View company -->

            <button
              class="view-company-btn"
              data-company-id="${company.id}"
              style="
                width: 100%;
                margin-top: 14px;
                padding: 9px 12px;
                border: none;
                border-radius: 8px;
                background: #111827;
                color: white;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
              "
            >
              View Company
            </button>
          </div>
        `);

        // ----------------------------------------------
        // Popup button navigation
        // ----------------------------------------------

        popup.on("open", () => {
          const popupElement = popup.getElement();

          if (!popupElement) return;

          const button =
            popupElement.querySelector<HTMLButtonElement>(
              ".view-company-btn"
            );

          if (!button) return;

          button.addEventListener("click", () => {
            navigate(`/company/${company.id}`);
          });
        });

        // ----------------------------------------------
        // Create marker
        // ----------------------------------------------

        const marker = new maplibregl.Marker({
          element: markerElement,
        })
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(map);

        companyMarkersRef.current.push(marker);
      });
    });
  }, [companies, navigate, userLocation]);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="relative h-full w-full">
      {/* Map */}

      <div
        ref={mapContainer}
        className="h-full w-full"
      />

      {/* Locate me button */}

      <button
        onClick={locateUser}
        className="
          absolute
          bottom-6
          right-6
          z-10
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-2xl
          border
          border-gray-200
          bg-white
          text-gray-800
          shadow-lg
          transition
          hover:bg-gray-50
        "
        title="Locate me"
      >
        📍
      </button>
    </div>
  );
}

export default MapView;