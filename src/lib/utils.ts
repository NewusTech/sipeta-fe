import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const generatedIds = new Set();

export const generateUniqueId = () => {
  let uniqueId;

  do {
    // Mengambil timestamp saat ini dalam milidetik
    const timestamp = Date.now();
    // Mengambil 6 digit terakhir dari timestamp
    const idFromTimestamp = timestamp.toString().slice(-6);
    // Menghasilkan 2 digit angka acak
    const randomNum = Math.floor(Math.random() * 100); // Angka acak 0-99
    // Menggabungkan angka dari timestamp dan angka acak
    uniqueId = (parseInt(idFromTimestamp) + randomNum).toString();
  } while (generatedIds.has(uniqueId) || uniqueId.length < 8); // Pastikan panjangnya 8 dan tidak ada duplikasi

  generatedIds.add(uniqueId); // Tambahkan ID yang dihasilkan ke Set
  return uniqueId;
};
