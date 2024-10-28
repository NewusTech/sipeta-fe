"use client";

import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  Polygon,
  useLoadScript,
  InfoWindow,
  DistanceMatrixService,
} from "@react-google-maps/api";
import useSWR from "swr";
import geoJson1 from "../../constants/feature_1.json";
import geoJson2 from "../../constants/feature_2.json";
import { fetcherWithoutAuth } from "../../constants/fetcher";
import LocationInfoWindow from "../../components/ui/locationdialog";

export default function Home() {
  const geoJsonFiles = [geoJson1, geoJson2];
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

  const [mapCenter, setMapCenter] = useState({
    lat: -4.8357,
    lng: 104.9441,
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
    geoJsonFiles.forEach((geoData) => {
      map.data.addGeoJson(geoData);
    });

    map.data.setStyle(() => ({
      fillColor: "#7295FF",
      strokeColor: "#000",
      strokeWeight: 0.3,
      fillOpacity: 0.5,
      clickable: true,
    }));

    map.data.addListener("mouseover", (event: any) => {
      const feature = event.feature;
      const name = feature.getProperty("namobj");
      const population = feature.getProperty("jumlahpenduduk");

      const content = `Area: ${name}<br>Jumlah Penduduk: ${population}`;
      if (content) {
        infowindow.setContent(content);
        infowindow.setPosition(event.latLng);
        infowindow.open(map);
      }
    });

    map.data.addListener("mouseout", () => {
      infowindow.close();
    });
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "geometry"],
    language: "id",
  });

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
    <div className="flex justify-center items-center bg-cover">
        {distance && (
          <div className="m-auto rounded">
            <button>Jarak antara titik yang dipilih: {distance}</button>
          </div>
        )}
      <div className="w-full">
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
              return (
                <Marker
                  key={index}
                  position={coordinates[0]}
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
