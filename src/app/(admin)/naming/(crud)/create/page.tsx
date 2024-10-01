"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "../../../../../lib/utils";
import { Button } from "../../../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../components/ui/tabs";
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import { Input } from "../../../../../components/ui/input";
import geoJson from "../../../../../constants/lamtura.json";
import geoJson2 from "../../../../../constants/lamturaa.json";
import InformationForm from "../../../../../components/Form/Information";
import DetailForm from "../../../../../components/Form/Detail";
import DocumentTab from "../../../../../components/Form/Document";

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

export default function CreateNamingPage() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [onEdit, setOnEdit] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [addressInfo, setAddressInfo] = React.useState(null);
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

  if (!isLoaded) return <p>Loading ...</p>;

  return (
    <section>
      <div className="flex justify-between">
        <h1 className="text-primaryy pt-5 font-semibold">Tambah Data</h1>
      </div>
      <div className="flex justify-between space-x-4">
        <div className="mt-4 w-5/12 p-5 shadow-md rounded-xl">
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
              <InformationForm />
            </TabsContent>
            <TabsContent value="detail">
              <DetailForm />
            </TabsContent>
            <TabsContent value="document">
              <DocumentTab />
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/2 right-0 -mt-11 fixed">
          <div className="relative">
            {/* Input search with Autocomplete */}
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
          </div>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            onLoad={onLoadMap}
            zoom={10.85}
            onDragEnd={onMapDragEnd} // Menangani event drag pada peta
            onClick={onMapClick}
            // Menangani event klik pada peta
          >
            <Marker
              position={markerPosition} // Menampilkan marker pada posisi terkini
              draggable={true} // Memungkinkan marker untuk didrag
            />
          </GoogleMap>
        </div>
      </div>
    </section>
  );
}
