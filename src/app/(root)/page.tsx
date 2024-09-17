import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function Home() {
  return (
    <div className="-mt-28 bg-[url('/assets/images/bg-screen.jpg')] flex justify-center items-center w-screen h-screen bg-cover">
      <div className="rounded-full bg-white flex justify-between pl-1 w-1/2">
        <Input
          className="bg-white border-none rounded-full w-full"
          placeholder="Daftar Wilayah"
        />
        <Button className="bg-primaryy text-white rounded-r-full px-6 py-1">
          Cari
        </Button>
      </div>
    </div>
  );
}
