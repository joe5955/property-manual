import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

// Load Google Maps script
function loadMapScript() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    const existingScript = document.querySelector(`script[src*="${MAPS_PROXY_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      return;
    }

    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve(window.google.maps);
    script.onerror = (e) => {
      console.error("Failed to load Google Maps script", e);
      reject(e);
    };
    document.head.appendChild(script);
  });
}

export interface MapMarker {
  id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  description?: string;
}

interface InteractiveMapProps {
  className?: string;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: MapMarker[];
  activeMarkerId?: string | null;
  onMarkerClick?: (markerId: string) => void;
}

export function InteractiveMap({
  className,
  center = { lat: 48.618, lng: -123.005 }, // Default to Deer Harbor area
  zoom = 18,
  markers = [],
  activeMarkerId,
  onMarkerClick,
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      await loadMapScript();
      
      if (!isMounted || !mapContainer.current) return;

      if (!mapInstance.current) {
        mapInstance.current = new window.google.maps.Map(mapContainer.current, {
          center,
          zoom,
          mapId: "PROPERTY_MAP_ID", // Required for Advanced Markers
          mapTypeId: "satellite",
          tilt: 0,
        });
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstance.current || !window.google?.maps?.marker?.AdvancedMarkerElement) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.map = null);
    markersRef.current.clear();

    // Add new markers
    markers.forEach((markerData) => {
      const pinElement = new google.maps.marker.PinElement({
        background: activeMarkerId === markerData.id ? "#EF4444" : "#10B981",
        borderColor: "#FFFFFF",
        glyphColor: "#FFFFFF",
        scale: activeMarkerId === markerData.id ? 1.2 : 1,
      });

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance.current,
        position: markerData.position,
        title: markerData.title,
        content: pinElement.element,
      });

      marker.addListener("click", () => {
        onMarkerClick?.(markerData.id);
      });

      markersRef.current.set(markerData.id, marker);
    });
  }, [markers, activeMarkerId, onMarkerClick]);

  // Pan to active marker
  useEffect(() => {
    if (activeMarkerId && mapInstance.current) {
      const activeMarker = markers.find(m => m.id === activeMarkerId);
      if (activeMarker) {
        mapInstance.current.panTo(activeMarker.position);
        mapInstance.current.setZoom(19);
      }
    }
  }, [activeMarkerId, markers]);

  return <div ref={mapContainer} className={cn("w-full h-full min-h-[400px] rounded-lg shadow-md", className)} />;
}
