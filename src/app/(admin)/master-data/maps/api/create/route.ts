import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

export const POST = async (req: any) => {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json(
      { error: "File or ID not received." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `data-maps.json`; // Hanya menggunakan id sebagai nama file
  const targetDir = path.join(process.cwd(), "src/assets/regency");
  const filePath = path.join(targetDir, filename);

  try {
    // Pastikan folder target ada
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    // Mengecek apakah file sudah ada
    const isUpdate = existsSync(filePath);

    // Simpan atau update file
    await writeFile(filePath, buffer);
    const message = isUpdate
      ? "File updated successfully"
      : "File created successfully";

    return NextResponse.json({ message, filename, status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Failed", status: 500 });
  }
};
