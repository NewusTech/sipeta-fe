"use client";

import { Button } from "../../components/ui/button";

import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  Polygon,
  StandaloneSearchBox,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import useSWR from "swr";
import { Input } from "../../components/ui/input";
import geoJson from "../../constants/data.json";
import geoJson2 from "../../constants/lamturaa.json";
import { fetcherWithoutAuth } from "../../constants/fetcher";
import LocationInfoWindow from "../../components/ui/locationdialog";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Fetch data dengan SWR berdasarkan halaman saat ini
  const { data } = useSWR<any>(
    `${apiUrl}/datatoponim/get-landing?limit=100000`,
    fetcherWithoutAuth
  );

  const result = data?.data;

  const parseLatLong = (latlong: string) => {
    const [lat, lng] = latlong.split(",").map(Number);
    console.log(lat, lng);
    // Ensure the coordinates are in the correct format
    return { lat, lng };
  };

  const [markerPosition, setMarkerPosition] = React.useState({
    lat: -4.8357, // Default latitude (Lampung Utara)
    lng: 104.9441, // Default longitude (Lampung Utara)
  });
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
    // Menambahkan data GeoJSON ke peta
    map.data.addGeoJson(geoJson);

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
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "geometry"],
    language: "id",
  });

  const searchBoxRef = React.useRef<google.maps.places.SearchBox | null>(null);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const newLat = place.geometry?.location?.lat();
      const newLng = place.geometry?.location?.lng();

      if (newLat && newLng) {
        setMarkerPosition({ lat: newLat, lng: newLng });
      }
    }
  };

  // const handleMapInteraction = (latLng: google.maps.LatLng | null) => {
  //   if (!latLng) return;

  //   const newLat = latLng.lat();
  //   const newLng = latLng.lng();

  //   if (newLat && newLng) {
  //     // Cek apakah titik berada dalam polygon geoJson
  //     const clickedPoint = new google.maps.LatLng(newLat, newLng);
  //     let isInPolygon = false;

  //     geoJson2.features.forEach((feature: any) => {
  //       const polygonCoords = feature.geometry.coordinates[0][0].map(
  //         (coord: number[]) => ({ lat: coord[1], lng: coord[0] })
  //       );
  //       const polygon = new google.maps.Polygon({
  //         paths: polygonCoords,
  //       });

  //       if (google.maps.geometry.poly.containsLocation(clickedPoint, polygon)) {
  //         isInPolygon = true;
  //       }
  //     });

  //     if (isInPolygon) {
  //       // Update marker position only if inside the polygon
  //       setMarkerPosition({ lat: newLat, lng: newLng });
  //     } else {
  //       alert("Titik Berada di Luar Wilayah Kabupaten Lampung Timur");
  //     }
  //   }
  // };

  // const onMapClick = (event: google.maps.MapMouseEvent) => {
  //   handleMapInteraction(event?.latLng);
  // };

  const LAMPUNG_UTARA = {
    lat: -4.8357, // Default center latitude (Lampung Utara)
    lng: 104.9441,
  };

  const onMapDragEnd = () => {
    setMapCenter(LAMPUNG_UTARA); // Center back to Lampung Timur after drag
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-cover">
      <div className="w-full ">
        <div className="relative">
          {/* Input search with Autocomplete */}
          <StandaloneSearchBox
            onPlacesChanged={onPlacesChanged}
            onLoad={(ref) => (searchBoxRef.current = ref)}
          >
            <Input
              type="text"
              placeholder="Search for a location"
              className="absolute z-10 left-48 mt-[10px] border-none rounded-full w-1/2 shadow"
            />
          </StandaloneSearchBox>
        </div>
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
        </GoogleMap>
      </div>
    </div>
  );
}
