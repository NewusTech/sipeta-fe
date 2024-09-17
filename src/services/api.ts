"use client";

import useSWR from "swr";
import { fetcher, fetcherWithoutAuth } from "@/constants/fetcher";

// get

export function useCarousel() {
  const { data, isLoading } = useSWR(
    `${process.env.EXPO_PUBLIC_API_URL}/carousel/get`,
    fetcher,
  );

  return {
    data,
    isLoading,
  };
}

// post
export const loginUser = async ({ nik, password }: LoginType) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nik, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
