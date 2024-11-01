"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronLeft, X } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../../components/ui/tabs";
import {
  DrawingManager,
  GoogleMap,
  Marker,
  Polygon,
  Polyline,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import { Input } from "../../../../../../components/ui/input";
import geoJson from "../../../../../../constants/data.json";
import geoJson2 from "../../../../../../constants/lamturaa.json";
import InformationForm from "../../../../../../components/Form/Information";
import DetailForm from "../../../../../../components/Form/Detail";
import DocumentTab from "../../../../../../components/Form/Document";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import InformationFormDetail from "@/components/Form/Information/detail";
import useSWR from "swr";
import { fetcher } from "constants/fetcher";
import DetailFormDetail from "@/components/Form/Detail/detail";
import DocumentTabDetail from "@/components/Form/Document/detail";
import ModalVerif from "@/components/Dialog/verif";
import ModalDecline from "@/components/Dialog/decline";

export default function DetailNamingPage({
  params,
}: {
  params: { id: number };
}) {
  const [polygonString, setPolygonString] = React.useState<string>("");
  const [polylineString, setPolylineString] = React.useState<string>("");
  const [locationDetails, setLocationDetails] = React.useState({
    kecamatan: "",
    desa: "",
    dms: "",
    lat: "",
    lng: "",
  });
  const [markerPosition, setMarkerPosition] = React.useState({
    lat: -4.8357, // Default latitude (Lampung Utara)
    lng: 104.9441, // Default longitude (Lampung Utara)
  });
  const [mapCenter, setMapCenter] = React.useState({
    lat: -4.8357, // Default center latitude (Lampung Utara)
    lng: 104.9441, // Default center longitude (Lampung Utara)
  });
  const [typeGeometry, setTypeGeometry] = React.useState(0);

  const handleTypeGeometryChange = (newType: string) => {
    setTypeGeometry(Number(newType));
    console.log("Selected Type Geometry:", newType); // You can also do more here.
  };

  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };

  const mapContainerStyle2 = {
    width: "100%",
    height: "30vh",
  };

  const convertToDMS = (coordinate: number): string => {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = Math.round((absolute - degrees - minutes / 60) * 3600);

    const direction =
      coordinate >= 0
        ? coordinate === absolute
          ? "N"
          : "E"
        : coordinate === absolute
          ? "S"
          : "W";

    return `${degrees}°${minutes}'${seconds}" ${direction}`;
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

  const handleReverseGeocoding = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const latLng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results) {
        const addressComponents = results[0].address_components;

        // Ekstrak kecamatan dan desa dari komponen alamat
        const kecamatan = addressComponents.find((component) =>
          component.types.includes("administrative_area_level_3")
        )?.long_name;

        const desa = addressComponents.find((component) =>
          component.types.includes("administrative_area_level_4")
        )?.long_name;

        setLocationDetails({
          kecamatan: kecamatan || "",
          desa: desa || "",
          dms: `${convertToDMS(lat)} - ${convertToDMS(lng)}` || "",
          lat: lat.toString(),
          lng: lng.toString(),
        });
      }
    });
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
    const latLng = event.latLng;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      handleReverseGeocoding(lat, lng);
    }
  };

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/get/${params.id}`,
    fetcher
  );

  const resultData = data?.data;
  const resultFoto = data?.data?.Fototoponims;

  let resultInformation = {};
  let resultDetail = {};
  let resultDocument = {};

  if (resultData) {
    const {
      id_toponim,
      tipe_geometri,
      klasifikasi_id,
      unsur_id,
      Kecamatan,
      Desa,
      nama_lokal,
      nama_spesifik,
      nama_peta,
      koordinat,
      bujur,
      lintang,
      kepala,
      sekretaris,
      email,
      telp,
      Detailtoponim,
      sketsa,
      docpendukung,
    } = resultData;

    const kecamatanName = Kecamatan?.name || "N/A"; // Optional chaining
    const desaName = Desa?.name || "N/A"; // Optional chaining
    const {
      akurasi,
      arti_nama,
      asal_bahasa,
      catatan,
      id,
      ejaan,
      lcode,
      nama_gazeter,
      nama_lain,
      nama_rekomendasi,
      nama_sebelumnya,
      narasumber,
      nilai_ketinggian,
      nlp,
      sejarah_nama,
      sumber_data,
      ucapan,
      zona_utm,
    } = Detailtoponim || {}; // Optional chaining untuk Detailtoponim

    resultInformation = {
      id,
      id_toponim,
      tipe_geometri,
      klasifikasi_id,
      unsur_id,
      kecamatanName,
      desaName,
      nama_lokal,
      nama_spesifik,
      nama_peta,
      koordinat,
      bujur,
      lintang,
      kepala,
      sekretaris,
      email,
      telp,
    };

    resultDocument = {
      sketsa,
      docpendukung,
    };

    resultDetail = {
      id,
      akurasi,
      arti_nama,
      asal_bahasa,
      catatan,
      ejaan,
      lcode,
      nama_gazeter,
      nama_lain,
      nama_rekomendasi,
      nama_sebelumnya,
      narasumber,
      nilai_ketinggian,
      nlp,
      sejarah_nama,
      sumber_data,
      ucapan,
      zona_utm,
    };
  }

  // const resultInformation = resultData?.map(
  //   (item: { id: number; name: string }) => ({
  //     value: item.id, // id masuk ke value
  //     label: item.name, // name masuk ke label
  //   })
  // );

  // const onMapDragEnd = () => {
  //   setMapCenter(LAMPUNG_UTARA); // Center back to Lampung Timur after drag
  // };

  const latLong = resultData?.latlong;
  const polyString = latLong?.split(";").map((coord: string) => {
    const [lat, lng] = coord?.split(",").map(Number);
    return { lat, lng };
  });

  React.useEffect(() => {
    if (resultData) {
      setTypeGeometry(resultData?.tipe_geometri);
      setPolygonString(resultData?.latlong);
      setPolylineString(resultData?.latlong);
      const latitude = parseFloat(resultData.lintang);
      const longitude = parseFloat(resultData.bujur);

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
  }, [resultData]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  console.log("Result Data:", polygonString);

  if (!isLoaded) return <p>Loading ...</p>;

  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "Surveyor"]}>
      <section className="md:pl-32 pl-10 pr-10 md:pr-0 pb-20 md:pb-0">
        <div className="flex items-center text-primaryy mt-4">
          <Link href="/naming" className="cursor-pointer">
            <ChevronLeft className="w-7 h-7" />
          </Link>
          <h4>Kembali</h4>
        </div>
        <div className="flex md:flex-row w-full md:w-[40%] md:space-x-2 justify-start items-start md:items-center md:justify-between space-y-2 mb-2 md:mb-0 flex-col md:items-center">
          <h1 className="text-primaryy pt-5 font-semibold text-xl">Detail</h1>
          <div className="flex space-x-2">
            <ModalVerif id={params.id} />
            <ModalDecline id={params.id} />
          </div>
        </div>
        <div className="flex md:flex-row flex-col md:justify-between md:space-x-4">
          <div className="w-full block md:hidden ">
            <GoogleMap
              mapContainerStyle={mapContainerStyle2}
              center={mapCenter}
              onLoad={onLoadMap}
              zoom={10.85}
              // onDragEnd={onMapDragEnd} // Menangani event drag pada peta
              // Menangani event klik pada peta
            >
              {(() => {
                switch (typeGeometry) {
                  case 1:
                    return (
                      <Marker
                        position={markerPosition} // Menampilkan marker pada posisi terkini
                      />
                    );
                  case 3:
                    return (
                      <Polyline
                        path={polyString}
                        options={{
                          strokeColor: getRandomColor(),
                          strokeOpacity: 1,
                          strokeWeight: 2,
                        }}
                      />
                    );
                  case 2:
                    return (
                      <Polygon
                        paths={polyString}
                        options={{
                          fillColor: getRandomColor(),
                          fillOpacity: 0.4,
                          strokeOpacity: 0.5,
                          strokeWeight: 0.5,
                        }}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </GoogleMap>
          </div>
          <div className="mt-4 md:w-[38%] w-full p-5 shadow-md rounded-xl">
            <Tabs defaultValue="information">
              <TabsList className="w-full rounded-full border bg-slate-100 space-x-2">
                <TabsTrigger
                  className="w-full px-2 rounded-full text-black data-[state=active]:bg-primaryy  data-[state=active]:text-white"
                  value="information"
                >
                  Informasi
                </TabsTrigger>
                <TabsTrigger
                  className="w-full px-2 rounded-full text-black data-[state=active]:bg-primaryy  data-[state=active]:text-white"
                  value="detail"
                >
                  Detail
                </TabsTrigger>
                <TabsTrigger
                  className="w-full px-2 rounded-full text-black data-[state=active]:bg-primaryy  data-[state=active]:text-white"
                  value="document"
                >
                  Dokumen
                </TabsTrigger>
              </TabsList>
              <TabsContent value="information">
                <InformationFormDetail
                  data={resultInformation}
                  locationDetails={locationDetails}
                  polyString={
                    typeGeometry === 2
                      ? polygonString
                      : typeGeometry === 3
                        ? polylineString
                        : ""
                  }
                  onTypeGeometryChange={handleTypeGeometryChange}
                />
              </TabsContent>
              <TabsContent value="detail">
                <DetailFormDetail data={resultDetail} />
              </TabsContent>
              <TabsContent value="document">
                <DocumentTabDetail data={resultDocument} foto={resultFoto} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-1/2 right-0 -mt-[100px] md:fixed md:block hidden">
            {/* <div className="relative">
              <StandaloneSearchBox
                onPlacesChanged={onPlacesChanged}
                onLoad={(ref) => (searchBoxRef.current = ref)}
              >
                <Input
                  type="text"
                  placeholder="Search for a location"
                  className="absolute z-10 left-48 mt-[10px] border-none rounded-full w-[40%] shadow"
                />
              </StandaloneSearchBox>
            </div> */}
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              onLoad={onLoadMap}
              zoom={10.85}
              // onDragEnd={onMapDragEnd} // Menangani event drag pada peta
              // Menangani event klik pada peta
            >
              {(() => {
                switch (typeGeometry) {
                  case 1:
                    return (
                      <Marker
                        position={markerPosition} // Menampilkan marker pada posisi terkini
                      />
                    );
                  case 3:
                    return (
                      <Polyline
                        path={polyString}
                        options={{
                          strokeColor: getRandomColor(),
                          strokeOpacity: 1,
                          strokeWeight: 2,
                        }}
                      />
                    );
                  case 2:
                    return (
                      <Polygon
                        paths={polyString}
                        options={{
                          fillColor: getRandomColor(),
                          fillOpacity: 0.4,
                          strokeOpacity: 0.5,
                          strokeWeight: 0.5,
                        }}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </GoogleMap>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
