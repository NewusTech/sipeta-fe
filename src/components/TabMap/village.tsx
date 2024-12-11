"use client";

import {
  GoogleMap,
  Marker,
  Polygon,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { fetcherWithoutAuth } from "constants/fetcher";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import LocationInfoWindow from "../ui/locationdialog";

export default function TabMapVillage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [geoJsonData, setGeoJsonData] = useState<any[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );

  useEffect(() => {
    const fetchGeoJsonData = async () => {
      try {
        const response = await fetch("/master-data/village/api/get-all");
        if (!response.ok) {
          throw new Error("Failed to fetch GeoJSON data");
        }
        const { data } = await response.json();
        console.log(data);
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
      }
    };

    fetchGeoJsonData();
  }, []);

  // Fetch data dengan SWR berdasarkan halaman saat ini
  const { data } = useSWR<any>(
    `${apiUrl}/datatoponim/get-landing?limit=100000`,
    fetcherWithoutAuth
  );

  const result = data?.data;
  const [mapCenter, setMapCenter] = useState({
    lat: -4.8357, // Default center latitude (Lampung Utara)
    lng: 104.9441, // Default center longitude (Lampung Utara)
  });

  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };

  const onLoadMap = useCallback((map: google.maps.Map) => {
    // Menambahkan data GeoJSON ke peta
    setMap(map);

    setIsMapReady(true);
    // map.data.addGeoJson(one);

    // Fungsi untuk menghitung centroid dari poligon
  }, []);

  useEffect(() => {
    if (!isMapReady || !map || geoJsonData.length === 0) {
      return;
    }

    const infowindow = new google.maps.InfoWindow();
    setInfoWindow(infowindow);

    geoJsonData.forEach((geoData) => {
      try {
        if (
          geoData.filegeojson &&
          geoData.filegeojson.type === "FeatureCollection"
        ) {
          console.log("Adding GeoJSON Data:", geoData.filegeojson);
          map.data.addGeoJson(geoData.filegeojson);
        } else {
          console.error("Invalid GeoJSON format:", geoData.filegeojson);
        }
      } catch (error) {
        console.error("Error adding GeoJSON:", error);
      }
    });

    map.data.setStyle((feature) => {
      // const namobj: any = feature.getProperty("namobj");
      const fillColor = "#7295FF"; // Default warna jika tidak ada dalam colorMap
      return {
        fillColor: fillColor,
        strokeColor: "#000",
        strokeWeight: 0.3,
        fillOpacity: 0.5,
        clickable: true,
      };
    });

    const calculateCentroid = (coordinates: number[][]) => {
      let totalX = 0,
        totalY = 0;
      coordinates.forEach((coord) => {
        totalX += coord[0];
        totalY += coord[1];
      });
      const centerX = totalX / coordinates.length;
      const centerY = totalY / coordinates.length;
      return { lat: centerY, lng: centerX };
    };

    // Membuat custom OverlayView untuk menampilkan teks di tengah poligon
    class LabelOverlay extends google.maps.OverlayView {
      private position: google.maps.LatLng;
      private text: string;
      private div: HTMLElement | null = null;

      constructor(position: google.maps.LatLng, text: string) {
        super();
        this.position = position;
        this.text = text;
      }

      onAdd() {
        this.div = document.createElement("div");
        this.div.style.position = "absolute";
        this.div.style.color = "black";
        this.div.style.fontSize = "12px";
        this.div.style.fontWeight = "bold";
        this.div.style.whiteSpace = "nowrap";
        this.div.innerText = this.text;

        const panes = this.getPanes();
        panes?.overlayLayer.appendChild(this.div);
      }

      draw() {
        const overlayProjection = this.getProjection();
        const position = overlayProjection.fromLatLngToDivPixel(this.position);

        if (this.div && position) {
          this.div.style.left = position.x - 30 + "px";
          this.div.style.top = position.y + "px";
        }
      }

      onRemove() {
        if (this.div) {
          this.div.parentNode?.removeChild(this.div);
          this.div = null;
        }
      }
    }

    // Loop melalui semua fitur untuk mendapatkan centroid dan menampilkan label
    map.data.forEach((feature) => {
      const geometry: any = feature.getGeometry();

      if (geometry.getType() === "Polygon") {
        const polygon = geometry as google.maps.Data.Polygon;
        const path = polygon.getArray()[0]; // Ambil array pertama sebagai poligon utama

        // Hitung centroid
        const centroid = calculateCentroid(
          path.getArray().map((coord) => [coord.lng(), coord.lat()])
        );

        // Ambil nilai dari "namobj"
        const name: any = feature.getProperty("NAMOBJ");

        // Membuat LabelOverlay di tengah poligon
        const overlay = new LabelOverlay(
          new google.maps.LatLng(centroid.lat, centroid.lng),
          name
        );
        overlay.setMap(map);
      }
    });

    // Mengatur opsi tampilan peta
    map.setOptions({
      styles: [
        {
          featureType: "administrative.province",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#FFEEEE" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ visibility: "on" }],
        },
      ],
    });

    map.data.addListener("mouseover", (event: any) => {
      const feature = event.feature;
      const name = feature.getProperty("namobj");
      const population = feature.getProperty("jumlahpenduduk");

      // Format popup content
      const content = `Area: ${name}<br>Jumlah Penduduk: ${population}`;

      if (content) {
        const position = event.latLng;

        infowindow.setContent(content);
        infowindow.setPosition(position);
        infowindow.open(map);
      }
    });

    // Add mouseout listener to close the InfoWindow
    map.data.addListener("mouseout", () => {
      infowindow.close();
    });
  }, [map, isMapReady, geoJsonData]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "geometry", "drawing"],
    language: "id",
  });

  const LAMPUNG_UTARA = {
    lat: -4.8357, // Default center latitude (Lampung Utara)
    lng: 104.9441,
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full py-2">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        onLoad={onLoadMap}
        zoom={10.85}
        // onDragEnd={onMapDragEnd} // Menangani event drag pada peta
        // onClick={onMapClick}
      >
        {result?.map((location: any, index: number) => {
          const { latlong, tipe_geometri } = location;

          const coordinates = latlong?.split(";").map((coord: string) => {
            const [lat, lng] = coord?.split(",").map(Number);
            return { lat, lng };
          });

          if (tipe_geometri === 1) {
            const { lat, lng } = coordinates[0];
            console.log(lat, lng);
            return (
              <Marker
                key={index}
                position={{ lat, lng }}
                onClick={() => setSelectedLocation(location)}
              />
            );
          } else if (tipe_geometri === 3) {
            return (
              <Polyline
                key={index}
                path={coordinates}
                options={{
                  strokeColor: "green",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                }}
                onClick={() => setSelectedLocation(location)}
              />
            );
          } else if (tipe_geometri === 2) {
            return (
              <Polygon
                key={index}
                paths={coordinates}
                options={{
                  fillColor: "lightgreen",
                  fillOpacity: 0.4,
                  strokeOpacity: 0.5,
                  strokeWeight: 0.5,
                }}
                onClick={() => setSelectedLocation(location)}
              />
            );
          }
          return null;
        })}

        {selectedLocation && (
          <LocationInfoWindow
            location={selectedLocation}
            onCloseClick={() => setSelectedLocation(null)}
          />
        )}
      </GoogleMap>
    </div>
  );
}
