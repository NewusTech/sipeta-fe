"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronLeft } from "lucide-react";

import { cn } from "../../../../../../lib/utils";
import { Button } from "../../../../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../../components/ui/popover";
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
import geoJson from "../../../../../../constants/lamtura.json";
import geoJson2 from "../../../../../../constants/lamturaa.json";
import InformationForm from "../../../../../../components/Form/Information";
import DetailForm from "../../../../../../components/Form/Detail";
import DocumentTab from "../../../../../../components/Form/Document";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import InformationFormUpdate from "@/components/Form/Information/update";
import useSWR from "swr";
import { fetcher } from "constants/fetcher";
import DetailFormUpdate from "@/components/Form/Detail/update";
import DocumentTabUpdate from "@/components/Form/Document/update";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function UpdateNamingPage({
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
  const [typeGeometry, setTypeGeometry] = React.useState(0);

  const handleTypeGeometryChange = (newType: string) => {
    setTypeGeometry(Number(newType));
    console.log("Selected Type Geometry:", newType); // You can also do more here.
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

    // Mengatur tampilan visual untuk wilayah choropleth
    map.data.setStyle((feature) => {
      // const color = getColorForFeature(feature); // Fungsi untuk mengatur warna berdasarkan data
      return {
        fillColor: "#7295FF",
        // fillColor: "#A7E9C6",
        strokeColor: "#000",
        strokeWeight: 0.1,
        fillOpacity: 0.3,
        clickable: false,
      };
    });

    map.data.addListener("click", (event: any) => {
      const feature = event.feature;
      console.log("Feature clicked:", feature);
      // Lakukan sesuatu ketika fitur di klik, misalnya highlight atau update form
    });

    map.setOptions({
      styles: [
        // {
        //   featureType: "all",
        //   elementType: "geometry",
        //   // stylers: [{ color: "#FFCCCC" }] // Warna merah redup di luar GeoJSON
        // },
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
        // {
        //   featureType: "road",
        //   elementType: "geometry",
        //   stylers: [{ visibility: "on" }], // Sembunyikan jalan
        // },
        // {
        //   featureType: "water",
        //   elementType: "geometry",
        //   stylers: [{ color: "#A1CAF1" }] // Warna biru muda untuk laut
        // },
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
    libraries: ["places", "geometry", "drawing"],
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

  const LAMPUNG_UTARA = {
    lat: -4.8357, // Default center latitude (Lampung Utara)
    lng: 104.9441,
  };

  const onMapDragEnd = () => {
    setMapCenter(LAMPUNG_UTARA); // Center back to Lampung Timur after drag
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
      id,
      id_toponim,
      tipe_geometri,
      klasifikasi_id,
      unsur_id,
      Kecamatan: { name: kecamatanName },
      Desa: { name: desaName },
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
      Detailtoponim: {
        akurasi,
        arti_nama,
        asal_bahasa,
        catatan,
        datatoponim_id,
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
      },
      sketsa,
      docpendukung,
    } = resultData;

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
      datatoponim_id,
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

  const onPolygonComplete = (polygon: any) => {
    const polygonPath = polygon.getPath();
    const polygonLatLngs = polygonPath.getArray().map((latLng: any) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));
    const polygonString = polygonLatLngs
      .map((latLng: any) => `${latLng.lat}, ${latLng.lng}`)
      .join("; ");

    // Menyimpan string ke dalam state
    setPolygonString(polygonString);
    handleReverseGeocoding(polygonLatLngs[0].lat, polygonLatLngs[0].lng);
    console.log("Polygon coordinates:", polygonLatLngs);
  };

  const onPolylineComplete = (polyline: any) => {
    const polylinePath = polyline.getPath();
    const polylineLatLngs = polylinePath.getArray().map((latLng: any) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));
    const polylineString = polylineLatLngs
      .map((latLng: any) => `${latLng.lat}, ${latLng.lng}`)
      .join("; ");

    // Menyimpan string ke dalam state
    setPolylineString(polylineString);
    handleReverseGeocoding(polylineLatLngs[0].lat, polylineLatLngs[0].lng);
    console.log("Polyline coordinates:", polylineLatLngs);
  };

  console.log(polygonString);

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
        <div className="flex md:flex-row md:space-x-2 space-y-2 mb-2 md:mb-0 flex-col md:items-center">
          <h1 className="text-primaryy pt-5 font-semibold text-xl">
            Ubah Data
          </h1>
        </div>
        <div className="flex md:flex-row flex-col md:justify-between md:space-x-4">
          <div className="w-full block md:hidden ">
            {/* <div className="relative">
              Input search with Autocomplete
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
              mapContainerStyle={mapContainerStyle2}
              center={mapCenter}
              onLoad={onLoadMap}
              zoom={10.85} // Menangani event drag pada peta
              onClick={onMapClick}
              // Menangani event klik pada peta
            >
              {typeGeometry === 1 && (
                <Marker
                  position={markerPosition} // Menampilkan marker pada posisi terkini
                  draggable={true} // Memungkinkan marker untuk didrag
                />
              )}

              {typeGeometry !== 1 && (
                <DrawingManager
                  options={{
                    drawingControl: true,
                    drawingControlOptions: {
                      drawingModes: [
                        typeGeometry === 2
                          ? ("polygon" as google.maps.drawing.OverlayType)
                          : typeGeometry === 3
                            ? ("polyline" as google.maps.drawing.OverlayType)
                            : ("marker" as google.maps.drawing.OverlayType),
                      ],
                    },
                    polygonOptions: {
                      fillColor: "#FF0000",
                      fillOpacity: 0.5,
                      strokeWeight: 2,
                      clickable: true,
                      editable: true,
                      draggable: true,
                    },
                    polylineOptions: {
                      strokeColor: "#0000FF",
                      strokeOpacity: 0.5,
                      strokeWeight: 2,
                      clickable: true,
                      editable: true,
                      draggable: true,
                    },
                  }}
                  onPolygonComplete={onPolygonComplete} // Menangani event polygon selesai digambar
                  onPolylineComplete={onPolylineComplete}
                />
              )}
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
                <InformationFormUpdate
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
                <DetailFormUpdate data={resultDetail} id={params.id} />
              </TabsContent>
              <TabsContent value="document">
                <DocumentTabUpdate
                  data={resultDocument}
                  foto={resultFoto}
                  id={params.id}
                />
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-1/2 right-0 -mt-[100px] md:fixed md:block hidden">
            {/* <div className="relative">
              Input search with Autocomplete
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
              zoom={10.85} // Menangani event drag pada peta
              onClick={onMapClick}
              // Menangani event klik pada peta
            >
              {typeGeometry === 1 && (
                <Marker
                  position={markerPosition} // Menampilkan marker pada posisi terkini
                  draggable={true} // Memungkinkan marker untuk didrag
                />
              )}

              {typeGeometry !== 1 && (
                <DrawingManager
                  options={{
                    drawingControl: true,
                    drawingControlOptions: {
                      drawingModes: [
                        typeGeometry === 2
                          ? ("polygon" as google.maps.drawing.OverlayType)
                          : typeGeometry === 3
                            ? ("polyline" as google.maps.drawing.OverlayType)
                            : ("marker" as google.maps.drawing.OverlayType),
                      ],
                    },
                    polygonOptions: {
                      fillColor: "#FF0000",
                      fillOpacity: 0.5,
                      strokeWeight: 2,
                      clickable: true,
                      editable: true,
                      draggable: true,
                    },
                    polylineOptions: {
                      strokeColor: "#0000FF",
                      strokeOpacity: 0.5,
                      strokeWeight: 2,
                      clickable: true,
                      editable: true,
                      draggable: true,
                    },
                  }}
                  onPolygonComplete={onPolygonComplete} // Menangani event polygon selesai digambar
                  onPolylineComplete={onPolylineComplete}
                />
              )}
            </GoogleMap>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
