import { formatDate } from "@/lib/utils";

describe("formatDate", () => {
  it("should format the date as YYYY-MM-DD", () => {
    const date = new Date(2000, 0, 1); // 1 Januari 2000
    expect(formatDate(date)).toBe("2000-01-01");
  });

  it("should handle single-digit months and days correctly", () => {
    const date = new Date(2024, 8, 5); // 5 September 2024
    expect(formatDate(date)).toBe("2024-09-05");
  });

  it("should handle current date correctly", () => {
    const date = new Date(); // Current date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    expect(formatDate(date)).toBe(`${year}-${month}-${day}`);
  });
});
