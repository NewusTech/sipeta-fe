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
        {foto && foto.length > 0 ? (
          foto?.map((v: any) => (
            <Image
              key={v.id}
              src={v.foto_url}
              alt="image"
              width={100}
              height={100}
            />
          ))
        ) : (
          <p>Tidak ada foto</p>
        )}
      </div>
      <h1 className="font-medium mt-7 mb-2">Sketsa Toponim</h1>
      <div className="grid grid-cols-2 gap-x-4">
        {data?.sketsa ? (
          <Image src={data?.sketsa} alt="image" width={100} height={100} />
        ) : (
          <p>Tidak ada sketsa</p>
        )}
      </div>
      <h1 className="font-medium mt-7 mb-2">Dokumen Pendukung</h1>
      <div className="grid grid-cols-2 gap-x-4">
        {data?.document ? (
          <Image
            src={data?.docpendukung}
            alt="image"
            width={100}
            height={100}
          />
        ) : (
          <p>Tidak ada dokumen pendukung</p>
        )}
      </div>
    </div>
  );
}
