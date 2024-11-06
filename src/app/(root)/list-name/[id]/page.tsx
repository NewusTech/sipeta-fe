"use client";

import {
  GoogleMap,
  Marker,
  Polygon,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { fetcherWithoutAuth } from "../../../../constants/fetcher";
import Image from "next/image";
import useSWR from "swr";
import React, { useEffect } from "react";
import geoJson from "../../../../constants/data.json";

const DetailPage = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/get/${params.id}`,
    fetcherWithoutAuth
  );

  const result = data?.data;
  console.log(result);

  const photo = result?.Fototoponims;
  const detail = result?.Detailtoponim;
  const latlong = result?.latlong;

  const [markerPosition, setMarkerPosition] = React.useState({
    lat: -4.8357, // Default latitude (Lampung Utara)
    lng: 104.9441, // Default longitude (Lampung Utara)
  });
  const [mapCenter, setMapCenter] = React.useState({
    lat: -4.8357, // Default center latitude (Lampung Utara)
    lng: 104.9441, // Default center longitude (Lampung Utara)
  });
  const [typeGeometry, setTypeGeometry] = React.useState(0);

  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };

  const mapContainerStyle2 = {
    width: "100%",
    height: "50vh",
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

  const latLong = result?.latlong;
  const polyString = latLong?.split(";").map((coord: string) => {
    const [lat, lng] = coord?.split(",").map(Number);
    return { lat, lng };
  });

  useEffect(() => {
    if (result) {
      setTypeGeometry(result?.tipe_geometri);
      const latitude = parseFloat(result.lintang);
      const longitude = parseFloat(result.bujur);

      if (typeGeometry === 1) {
        setMarkerPosition({
          lat: latitude,
          lng: longitude,
        });
      }
      setMapCenter({
        lat: latitude,
        lng: longitude,
      });
    }
  }, [result]);

  console.log(typeGeometry);

  if (!isLoaded) return <p>Loading ...</p>;

  return (
    <section className="container mx-auto">
      <div className="py-10 flex flex-col md:flex-row md:space-x-5 space-y-5">
        <div className="w-full md:w-5/12 space-y-20">
          <div className="flex space-x-10">
            <div className="space-y-3 text-sm md:text-[16px]">
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">ID Toponim</p>
                <p>{result?.id_toponim}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Nomor Peta</p>
                <p>{result?.nomor_peta || "-"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Unsur</p>
                <p>{result?.Unsur?.name || "-"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Nama</p>
                <p>{result?.nama_lokal || "-"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Koordinat Utama</p>
                <p>{result?.koordinat || "-"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Nama Lain</p>
                <p>{result?.nama_peta || "-"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Nama Sebelumnya</p>
                <p>{detail?.nama_sebelumnya || "-"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Asal Bahasa</p>
                <p>{detail?.asal_bahasa || "-"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Arti Nama</p>
                <p>{detail?.arti_nama || "-"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Sejarah Nama</p>
                <p>{detail?.sejarah_nama || "-"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Kecamatan</p>
                <p>{result?.Kecamatan?.name}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Desa / Kelurahan</p>
                <p>{result?.Desa?.name}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="w-24 font-semibold">Sumber Data</p>
                <p>{detail?.sumber_data || "-"}</p>
              </div>
            </div>
          </div>
          {/* <Button className="hidden md:flex space-x-2 rounded-full bg-primaryy hover:bg-blue-950">
            <Download />
            <p>Download Foto dan Sketsa</p>
          </Button> */}
        </div>
        <div className="w-full space-y-5">
          <div className="w-full">
            {/* <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63611.43474092534!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e38a8c34478c437%3A0xf70e2cc30246368!2sKotabumi%2C%20North%20Lampung%20Regency%2C%20Lampung!5e0!3m2!1sen!2sid!4v1726821963937!5m2!1sen!2sid`}
              className="w-full h-[40vh]"
              // style="border:0px;"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe> */}
            <GoogleMap
              mapContainerStyle={mapContainerStyle2}
              center={mapCenter}
              onLoad={onLoadMap}
              zoom={10.85}
              // onDragEnd={onMapDragEnd} // Menangani event drag pada peta
              // Menangani event klik pada peta
            >
              {(() => {
                switch (typeGeometry.toString()) {
                  case "1":
                    return (
                      <Marker
                        position={markerPosition} // Menampilkan marker pada posisi terkini
                      />
                    );
                  case "2":
                    return (
                      <Polygon
                        paths={polyString}
                        options={{
                          fillColor: "red",
                          fillOpacity: 0.4,
                          strokeOpacity: 0.5,
                          strokeWeight: 0.5,
                        }}
                      />
                    );
                  case "3":
                    return (
                      <Polyline
                        path={polyString}
                        options={{
                          strokeColor: "green",
                          strokeOpacity: 1,
                          strokeWeight: 2,
                        }}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </GoogleMap>
          </div>
          <div className="space-y-2">
            <h1 className="font-semibold text-xl">Foto Topmonim</h1>
            <div className="md:flex grid grid-cols-2 gap-3">
              {photo?.length === 0 ? (
                <p className="text-slate-400">Tidak ada foto</p>
              ) : (
                photo?.map((item: any, index: number) => (
                  <div key={index} className="w-[174px] h-[119px]">
                    <Image
                      src={item.image}
                      width={144}
                      height={144}
                      alt="photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              )}
            </div>
            <h1 className="font-semibold text-xl">Sketsa Toponim</h1>
            <div className="md:flex grid grid-cols-2 gap-3">
              {result?.sketsa ? (
                <div className="w-[174px] h-[119px]">
                  <Image
                    src={result?.sketsa}
                    width={144}
                    height={144}
                    alt="photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <p className="text-slate-400">Tidak ada sketsa</p>
              )}
            </div>
          </div>
        </div>
        {/* <Button className="flex md:hidden space-x-2 rounded-full bg-primaryy hover:bg-blue-950">
          <Download />
          <p>Download Foto dan Sketsa</p>
        </Button> */}
      </div>
    </section>
  );
};

export default DetailPage;
