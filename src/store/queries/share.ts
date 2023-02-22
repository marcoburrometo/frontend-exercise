import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, ShareResponse } from "../../types/remote";

// Define a service using a base URL and expected endpoints
export const shareApi = createApi({
  reducerPath: "shareApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL + "/share" }),
  endpoints: (builder) => ({
    getShareLink: builder.query<ShareResponse, void>({
      query: () => "",
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetShareLinkQuery } = shareApi;
