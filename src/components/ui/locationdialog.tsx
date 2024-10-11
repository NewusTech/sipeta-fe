import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import Image from "next/image";

const parseLatLong = (latlong: string) => {
  const [lat, lng] = latlong.split(",").map(Number);
  return { lat, lng };
};

interface LocationDialogProps {
  location: any;
  onCloseClick: () => void;
}

const LocationDialog: React.FC<LocationDialogProps> = ({
  location,
  onCloseClick,
}) => {
  return (
    <InfoWindow
      position={parseLatLong(location.latlong)}
      onCloseClick={onCloseClick}
    >
      <div className="max-h-[700px] md:w-[600px] overflow-auto">
        <h1 className="font-bold text-[16px] mt-1 mb-2">
          {location.nama_lokal.toUpperCase()}
        </h1>
        <div className="grid grid-cols-3 gap-1">
          <div className="space-y-2">
            <p>
              <strong>Nama Lokal</strong>
            </p>
            <p>
              <strong>Nama Spesifik</strong>
            </p>
            <p>
              <strong>Nama Peta</strong>
            </p>
            <p>
              <strong>Klasifikasi</strong>
            </p>
            <p>
              <strong>Unsur</strong>
            </p>
            <p>
              <strong>Kecamatan</strong>
            </p>
            <p>
              <strong>Desa</strong>
            </p>
            <p>
              <strong>Koordinat</strong>
            </p>
            <p>
              <strong>Kepala</strong>
            </p>
            <p>
              <strong>Telp</strong>
            </p>
            <p>
              <strong>Email</strong>
            </p>
            <p>
              <strong>Verified at</strong>
            </p>
          </div>
          <div className="space-y-2 col-span-2">
            <p>: {location.nama_lokal}</p>
            <p>: {location.nama_spesifik}</p>
            <p>: {location.nama_peta}</p>
            <p>: {location.Klasifikasi?.name}</p>
            <p>: {location.Unsur?.name}</p>
            <p>: {location.Kecamatan?.name}</p>
            <p>: {location.Desa?.name}</p>
            <p>: {location.koordinat}</p>
            <p>: {location.kepala}</p>
            <p>: {location.telp}</p>
            <p>: {location.email}</p>
            <p>: {new Date(location.verifiedat).toLocaleString()}</p>
          </div>
        </div>

        {location.Detailtoponim && (
          <>
            <h1 className="font-bold text-[16px] mt-6 mb-2">Detail Toponim</h1>
            <div className="grid grid-cols-3 gap-1">
              <div className="space-y-2">
                <p>
                  <strong>Nama Gazeter</strong>
                </p>
                <p>
                  <strong>Nama Lain</strong>
                </p>
                <p>
                  <strong>Arti Nama</strong>
                </p>

                <p>
                  <strong>Klasifikasi</strong>
                </p>
                <p>
                  <strong>Unsur</strong>
                </p>
                <p>
                  <strong>Zona UTM</strong>
                </p>
                <p>
                  <strong>NLP</strong>
                </p>
                <p>
                  <strong>L-Code</strong>
                </p>
                <p>
                  <strong>Sejarah Nama</strong>
                </p>
              </div>
              <div className="space-y-2 col-span-2">
                <p>: {location.Detailtoponim.nama_gazeter}</p>
                <p>: {location.Detailtoponim.nama_lain}</p>
                <p>: {location.Detailtoponim.arti_nama}</p>

                <p>: {location.Klasifikasi?.name}</p>
                <p>: {location.Unsur?.name}</p>
                <p>: {location.Detailtoponim.zona_utm}</p>
                <p>: {location.Detailtoponim.nlp}</p>
                <p>: {location.Detailtoponim.lcode}</p>
                <p>: {location.Detailtoponim.sejarah_nama}</p>
              </div>
            </div>
          </>
        )}

        {/* Display any Fototoponims */}
        {location.Fototoponims.length > 0 && (
          <>
            <h1 className="font-bold text-[16px] mt-6 mb-2">Foto Toponim</h1>
            {location.Fototoponims.map((foto: any, idx: number) => (
              <div key={idx} className="w-full">
                <Image
                  src={foto.foto_url}
                  alt={`Foto ${idx}`}
                  width={400}
                  height={400}
                  className="w-full"
                />
              </div>
            ))}
          </>
        )}
      </div>
    </InfoWindow>
  );
};

export default LocationDialog;
