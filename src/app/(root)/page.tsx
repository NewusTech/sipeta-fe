"use client";

import React, { useState } from "react";
import { GoogleMap, Marker, Polyline, Polygon, useLoadScript, InfoWindow, DistanceMatrixService } from "@react-google-maps/api";
import useSWR from "swr";
import geoJson1 from "../../constants/feature_1.json";
import geoJson2 from "../../constants/feature_2.json";
import geoJson3 from "../../constants/feature_3.json";
import geoJson4 from "../../constants/feature_4.json";
import geoJson5 from "../../constants/feature_5.json";
import geoJson6 from "../../constants/feature_6.json";
import geoJson7 from "../../constants/feature_7.json";
import geoJson8 from "../../constants/feature_8.json";
import geoJson9 from "../../constants/feature_9.json";
import geoJson10 from "../../constants/feature_10.json";
import geoJson11 from "../../constants/feature_11.json";
import geoJson12 from "../../constants/feature_12.json";
import geoJson13 from "../../constants/feature_13.json";
import geoJson14 from "../../constants/feature_14.json";
import geoJson15 from "../../constants/feature_15.json";
import geoJson16 from "../../constants/feature_16.json";
import geoJson17 from "../../constants/feature_17.json";
import geoJson18 from "../../constants/feature_18.json";
import geoJson19 from "../../constants/feature_19.json";
import geoJson20 from "../../constants/feature_20.json";
import geoJson21 from "../../constants/feature_21.json";
import geoJson22 from "../../constants/feature_22.json";
import geoJson23 from "../../constants/feature_23.json";
import { fetcherWithoutAuth } from "../../constants/fetcher";
import LocationInfoWindow from "../../components/ui/locationdialog";

export default function Home() {

  const geoJsonFiles = [
    geoJson1,
    geoJson2,
    geoJson3,
    geoJson4,
    geoJson5,
    geoJson6,
    geoJson7,
    geoJson8,
    geoJson9,
    geoJson10,
    geoJson11,
    geoJson12,
    geoJson13,
    geoJson14,
    geoJson15,
    geoJson16,
    geoJson17,
    geoJson18,
    geoJson19,
    geoJson20,
    geoJson21,
    geoJson22,
    geoJson23,
  ];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

    // State to store selected points for distance calculation
    const [selectedPoints, setSelectedPoints] = useState<google.maps.LatLng[]>([]);
    const [distance, setDistance] = useState<string | null>(null);

  const { data } = useSWR<any>(
    `${apiUrl}/datatoponim/get-landing?limit=100000`,
    fetcherWithoutAuth
  );

  const result = data?.data;

  const [mapCenter, setMapCenter] = React.useState({
    lat: -4.8357, // Default center latitude (Lampung Utara)
    lng: 104.9441, // Default center longitude (Lampung Utara)
  });

  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const onLoadMap = React.useCallback((map: google.maps.Map) => {
    const infowindow = new google.maps.InfoWindow();
    setInfoWindow(infowindow);
    // Menambahkan data GeoJSON ke peta
    geoJsonFiles.forEach((geoData) => {
      map.data.addGeoJson(geoData);
    });

    // Fungsi untuk menghitung centroid dari poligon
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

    // Peta warna berdasarkan properti tertentu, misalnya `namobj`
    // const colorMap = {
    //   "Sungkai Utara": "#FF21A0", // Warna untuk Sungkai Utara
    //   "Bukit Kemuning": "#FF0000", // Warna untuk Bukit Kemuning
    //   "Abung Tinggi": "#00FF00",
    //   "Abung Surakarta": "#0000FF",
    //   "Abung Semuli": "#FFFF00",
    //   "Abung Timur": "#FF00FF",
    //   "Abung Kunang": "#00FFFF",
    //   Kotabumi: "#FFA500",
    //   "Kotabumi Selatan": "#800080",
    //   "Kotabumi Utara": "#008000",
    //   "Tanjung Raja": "#10FF40", // Warna untuk Tanjung Raja
    //   "Muara Sungkai": "#FFC0CB",
    //   "Bunga Mayang": "#C0C0C0",
    //   "Abung Selatan": "#A52A2A",
    //   "Hulu Sungkai": "#D2691E",
    //   "Lampung Utara": "#FF4500",
    //   "Sungkai Barat": "#CD5C5C",
    //   "Sungkai Selatan": "#F08080",
    //   "Sungkai Tengah": "#FF6347",
    //   "Tanjung Sari": "#B22222",
    //   "Abung Tengah": "#FFD700",
    //   "Sungkai Jaya": "#9ACD32",
    //   "Abung Barat": "#ADFF2F",
    //   "Blambangan Pagar": "#32CD32",
    //   "Abung Pekurun": "#fff",
    //   // Tambahkan warna lain sesuai kebutuhan
    // };

    // Mengatur tampilan visual untuk setiap poligon
    map.data.setStyle((feature) => {
      // const namobj: any = feature.getProperty("namobj");
      const fillColor = "#7295FF"; // Default warna jika tidak ada dalam colorMap
      return {
        fillColor: fillColor,
        strokeColor: "#000",
        strokeWeight: 0.3,
        fillOpacity: 0.5,
        clickable: false, // Agar tidak bisa diklik
      };
    });

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
        const name: any = feature.getProperty("namobj");

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

    // map.data.addListener("mouseover", (event: any) => {
    //   const feature = event.feature;
    //   const name = feature.getProperty("namobj");
    //   const population = feature.getProperty("jumlahpenduduk");

    //   // Format popup content
    //   const content = `Area: ${name}<br>Jumlah Penduduk: ${population}`;

    //   if (content) {
    //     const position = event.latLng;

    //     infowindow.setContent(content);
    //     infowindow.setPosition(position);
    //     infowindow.open(map);
    //   }
    // });

    // // Add mouseout listener to close the InfoWindow
    // map.data.addListener("mouseout", () => {
    //   infowindow.close();
    // });
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "geometry"],
    language: "id",
  });

  const searchBoxRef = React.useRef<google.maps.places.SearchBox | null>(null);

  const LAMPUNG_UTARA = {
    lat: -4.8357,
    lng: 104.9441,
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedPoints((prevPoints: any) => {
        const updatedPoints = [...prevPoints, event.latLng];
        if (updatedPoints.length === 2) {
          calculateDistance(updatedPoints[0], updatedPoints[1]);
        }
        return updatedPoints.slice(-2); // Only keep the last two points
      });
    }
  };

  const calculateDistance = (pointA: google.maps.LatLng, pointB: google.maps.LatLng) => {
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [pointA],
        destinations: [pointB],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK" && response?.rows[0].elements[0].status === "OK") {
          const distanceText = response?.rows[0].elements[0].distance.text;
          setDistance(distanceText);
        }
      }
    );
  };

  return (
    <div className="flex justify-center items-center  bg-cover">
      <div className="w-full">
      {distance && (
          <div className="m-auto rounded">
            <button>Jarak antara titik yang dipilih: {distance}</button>
          </div>
        )}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          onLoad={onLoadMap}
           onClick={handleMapClick}
          zoom={10.85}
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
                    strokeColor: getRandomColor(),
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
                    fillColor: getRandomColor(),
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

{selectedPoints.map((point, index) => (
            <Marker key={index} position={point} />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}
