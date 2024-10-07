import Image from "next/image";

export default function DocumentTabDetail({
  data,
  foto,
}: {
  data: any;
  foto: any;
}) {
  return (
    <div className="mt-4">
      <h1 className="font-medium mb-2">Foto Toponim</h1>
      <div className="grid grid-cols-2 gap-4">
        {foto?.map((v: any) => (
          <Image
            key={v.id}
            src={v.foto_url}
            alt="image"
            width={100}
            height={100}
          />
        ))}
      </div>
      <h1 className="font-medium mt-7 mb-2">Sketsa Toponim</h1>
      <div className="grid grid-cols-2 gap-x-4">
        <Image src={data.sketsa} alt="image" width={100} height={100} />
      </div>
      <h1 className="font-medium mt-7 mb-2">Dokumen Pendukung</h1>
      <div className="grid grid-cols-2 gap-x-4">
        <Image src={data.docpendukung} alt="image" width={100} height={100} />
      </div>
    </div>
  );
}
