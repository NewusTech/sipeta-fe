"use client";

import Cookies from "js-cookie";

export const fetcher = (url: string) => {
  const token = Cookies.get("token");
  // Atau ambil dari state/context
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      return res.json();
    })
    .catch((e) => {
      console.log(e);
    });
};

export const fetcherWithoutAuth = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
