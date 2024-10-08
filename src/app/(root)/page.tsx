"use client";

import { Button } from "../../components/ui/button";

import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useLoadScript,
  InfoWindow
} from "@react-google-maps/api";
import useSWR from "swr";
import { Input } from "../../components/ui/input";
import geoJson from "../../constants/lamtura.json";
import geoJson2 from "../../constants/lamturaa.json";
import { fetcherWithoutAuth } from "../../constants/fetcher";

export default function Home() {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Fetch data dengan SWR berdasarkan halaman saat ini
  const { data } = useSWR<any>(
    `${apiUrl}/datatoponim/get`,
    fetcherWithoutAuth
  );

  const result = data?.data;

  const parseLatLong = (latlong: string) => {
    const [lat, lng] = latlong.split(",").map(Number);
    console.log(lat, lng)
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

  const onLoadMap = React.useCallback((map: google.maps.Map) => {
    // Menambahkan data GeoJSON ke peta
    map.data.addGeoJson(geoJson);

    // Mengatur tampilan visual untuk wilayah choropleth
    map.data.setStyle((feature) => {
      return {
        fillColor: "#7295FF",
        strokeColor: "#000",
        strokeWeight: 0.1,
        fillOpacity: 0.3,
        clickable: false,
      };
    });

    map.setOptions({
      styles: [
        {
          featureType: "administrative.province",
          elementType: "labels",
          stylers: [{ visibility: "off" }], // Tampilkan hanya nama provinsi
        },
        {
          featureType: "administrative.locality",
          elementType: "labels",
          stylers: [{ visibility: "off" }], // Tampilkan nama kabupaten (locality)
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }], // Sembunyikan semua point of interest (kantor, masjid, dll.)
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#FFEEEE" }], // Warna lebih terang untuk daratan di luar GeoJSON
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ visibility: "off" }], // Menyembunyikan jalan agar lebih fokus ke daratan/laut
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

  const handleMapInteraction = (latLng: google.maps.LatLng | null) => {
    if (!latLng) return;

    const newLat = latLng.lat();
    const newLng = latLng.lng();

    if (newLat && newLng) {
      // Cek apakah titik berada dalam polygon geoJson
      const clickedPoint = new google.maps.LatLng(newLat, newLng);
      let isInPolygon = false;

      geoJson2.features.forEach((feature: any) => {
        const polygonCoords = feature.geometry.coordinates[0][0].map(
          (coord: number[]) => ({ lat: coord[1], lng: coord[0] })
        );
        const polygon = new google.maps.Polygon({
          paths: polygonCoords,
        });

        if (google.maps.geometry.poly.containsLocation(clickedPoint, polygon)) {
          isInPolygon = true;
        }
      });

      if (isInPolygon) {
        // Update marker position only if inside the polygon
        setMarkerPosition({ lat: newLat, lng: newLng });
      } else {
        alert("Titik Berada di Luar Wilayah Kabupaten Lampung Timur");
      }
    }
  };

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    handleMapInteraction(event?.latLng);
  };

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
        // Menangani event klik pada peta
        >
          {result?.map((location: any, index: number) => {
            const { lat, lng } = parseLatLong(location.latlong);
            return (
              <Marker
                key={index}
                position={{ lat, lng }}
                onClick={() => setSelectedLocation(location)}
              />
            );
          })}

          {selectedLocation && (
            <InfoWindow
              position={parseLatLong(selectedLocation.latlong)}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div className="max-h-[400px] overflow-auto space-y-3">
                <h1 className="font-bold text-[16px]">{selectedLocation.nama_lokal}</h1>
                <p><strong>Nama Lokal:</strong> {selectedLocation.nama_lokal}</p>
                <p><strong>Nama Spesifik:</strong> {selectedLocation.nama_spesifik}</p>
                <p><strong>Nama Peta:</strong> {selectedLocation.nama_peta}</p>
                <p><strong>Klasifikasi:</strong> {selectedLocation.Klasifikasi?.name}</p>
                <p><strong>Unsur:</strong> {selectedLocation.Unsur?.name}</p>
                <p><strong>Kecamatan:</strong> {selectedLocation.Kecamatan?.name}</p>
                <p><strong>Desa:</strong> {selectedLocation.Desa?.name}</p>
                <p><strong>Koordinat:</strong> {selectedLocation.koordinat}</p>
                <p><strong>Kepala:</strong> {selectedLocation.kepala}</p>
                <p><strong>Telp:</strong> {selectedLocation.telp}</p>
                <p><strong>Email:</strong> {selectedLocation.email}</p>
                <p><strong>Verified at:</strong> {new Date(selectedLocation.verifiedat).toLocaleString()}</p>

                {/* Display additional Detailtoponim data if exists */}
                {selectedLocation.Detailtoponim && (
                  <>
                    <h1 className="font-bold text-[16px]">Detail Toponim</h1>
                    <p><strong>Zona UTM:</strong> {selectedLocation.Detailtoponim.zona_utm}</p>
                    <p><strong>NLP:</strong> {selectedLocation.Detailtoponim.nlp}</p>
                    <p><strong>L-Code:</strong> {selectedLocation.Detailtoponim.lcode}</p>
                    <p><strong>Nama Gazeter:</strong> {selectedLocation.Detailtoponim.nama_gazeter}</p>
                    <p><strong>Nama Lain:</strong> {selectedLocation.Detailtoponim.nama_lain}</p>
                    <p><strong>Arti Nama:</strong> {selectedLocation.Detailtoponim.arti_nama}</p>
                    <p><strong>Sejarah Nama:</strong> {selectedLocation.Detailtoponim.sejarah_nama}</p>
                  </>
                )}

                {/* Display any Fototoponims */}
                {selectedLocation.Fototoponims.length > 0 && (
                  <>
                    <h1 className="font-bold text-[16px]">Foto Toponim</h1>
                    {selectedLocation.Fototoponims.map((foto: any, idx: number) => (
                      <div key={idx}>
                        <img src={foto.foto_url} alt={`Foto ${idx}`} width="100" height="100" />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
