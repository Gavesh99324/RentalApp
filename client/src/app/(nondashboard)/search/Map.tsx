"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";

// Set Mapbox token if available; otherwise warn and defer map rendering.
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
} else {
  // Leave accessToken empty (Mapbox will complain if we try to instantiate without one)
  console.warn(
    "Mapbox access token missing: set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env.local",
  );
}

const Map = () => {
  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  useEffect(() => {
    if (isLoading || isError || !properties) return;
    if (!MAPBOX_TOKEN) return; // Do not attempt map without token
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: filters.coordinates || [-74.5, 40],
      zoom: 9,
    });

    properties.forEach((property) => {
      const marker = createPropertyMarker(property, map);
      const markerElement = marker.getElement();
      const path = markerElement.querySelector("path[fill='#3FB1CE']");
      if (path) path.setAttribute("fill", "#000000");
    });

    setTimeout(() => map.resize(), 700);
    return () => map.remove();
  }, [isLoading, isError, properties, filters.coordinates]);

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;
  if (!MAPBOX_TOKEN)
    return (
      <div className="p-4 rounded-md bg-yellow-50 text-yellow-800 text-sm">
        Map unavailable: add <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to
        <code>.env.local</code> and restart.
      </div>
    );

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `,
      ),
    )
    .addTo(map);
  return marker;
};

export default Map;
