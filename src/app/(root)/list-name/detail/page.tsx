"use client";

import { Button } from "../../../../components/ui/button";
import { GoogleMap } from "@react-google-maps/api";
import { Download } from "lucide-react";
import Image from "next/image";

const DetailPage = () => {
  return (
    <section className="container mx-auto">
      <div className="py-10 flex space-x-5">
        <div className="w-5/12 space-y-20">
          <div className="flex space-x-10">
            <div className="font-semibold space-y-3">
              <p>ID Toponim</p>
              <p>Nomor Peta</p>
              <p>Unsur</p>
              <p>Nama</p>
              <p>Koordinat Utama</p>
              <p>Nama Lain</p>
              <p>Asal Sebelumnya</p>
              <p>Asal Bahasa</p>
              <p>Arti Nama</p>
              <p>Sejarah Nama</p>
              <p>Kecamatan</p>
              <p>Desa / Kelurahan</p>
              <p>Sumber Data</p>
              <p>Status Data</p>
            </div>
            <div className="space-y-3">
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
            </div>
          </div>
          <Button className="space-x-2 rounded-full bg-primaryy hover:bg-blue-950">
            <Download />
            <p>Download Foto dan Sketsa</p>
          </Button>
        </div>
        <div className="w-full space-y-5">
          <div className="w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63611.43474092534!2d104.8549811486088!3d-4.818976760002244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e38a8c34478c437%3A0xf70e2cc30246368!2sKotabumi%2C%20North%20Lampung%20Regency%2C%20Lampung!5e0!3m2!1sen!2sid!4v1726821963937!5m2!1sen!2sid"
              className="w-full h-[40vh]"
              // style="border:0px;"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="space-y-2">
            <h1 className="font-semibold text-xl">Foto Topmonim</h1>
            <div className="flex space-x-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="w-[174px] h-[119px]">
                  <Image
                    key={index}
                    src="/assets/images/bg-screen.jpg"
                    width={144}
                    height={144}
                    alt="photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <h1 className="font-semibold text-xl">Sketsa Toponim</h1>
            <div className="flex space-x-3">
              {Array.from({ length: 1 }).map((_, index) => (
                <div className="w-[174px] h-[119px]">
                  <Image
                    key={index}
                    src="/assets/images/bg-screen.jpg"
                    width={144}
                    height={144}
                    alt="photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailPage;
