// app/(admin)/master-data/district/api/geojson/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { readdir, readFile } from "fs/promises";
import { existsSync } from "fs";

export async function GET() {
  try {
    const targetDir = path.join(process.cwd(), "src/assets/district");

    // Check if directory exists
    if (!existsSync(targetDir)) {
      return NextResponse.json({ data: [] });
    }

    // Read all files in the directory
    const files = await readdir(targetDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    // Read content of each JSON file
    const geoJsonData = await Promise.all(
      jsonFiles.map(async (filename) => {
        const filePath = path.join(targetDir, filename);
        const content = await readFile(filePath, "utf-8");
        const id = filename.replace(".json", ""); // Extract ID from filename

        return {
          id,
          filegeojson: JSON.parse(content),
        };
      })
    );

    return NextResponse.json({
      data: geoJsonData,
      message: "GeoJSON data retrieved successfully",
    });
  } catch (error) {
    console.error("Error reading GeoJSON files:", error);
    return NextResponse.json(
      { message: "Failed to retrieve GeoJSON data", error: String(error) },
      { status: 500 }
    );
  }
}
