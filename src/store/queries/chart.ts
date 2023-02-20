import {
  API_BASE_URL,
  ChartDataResponse,
  CommentThreadResponse,
  CommentThreadsResponse,
  RespondToCommentThreadRequest,
} from "../../types/remote";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const chartDataApi = createApi({
  reducerPath: "chartDataApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL + "/chart" }),
  endpoints: (builder) => ({
    getChartData: builder.query<ChartDataResponse, void>({
      query: () => "data",
    }),
    getChartCommentThreads: builder.query<CommentThreadsResponse, void>({
      query: () => "comment_threads",
    }),
    getChartCommentThread: builder.query<CommentThreadResponse, string>({
      query: (threadId) => `comment_threads/${threadId}`,
    }),
    createChartCommentThread: builder.mutation<
      CommentThreadResponse,
      CommentThreadResponse
    >({
      query: (thread) => ({
        url: "comment_threads",
        method: "POST",
        body: thread,
      }),
      // Optimistic update -> https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#optimistic-updates
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          chartDataApi.util.updateQueryData(
            "getChartCommentThread",
            id,
            (draft: object) => {
              Object.assign(draft, patch);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    respondToChartCommentThread: builder.mutation<
      CommentThreadResponse,
      { body: RespondToCommentThreadRequest; threadId: string }
    >({
      query: (req) => ({
        url: `comment_threads/${req.threadId}/respond`,
        method: "POST",
        body: req.body,
      }),
      async onQueryStarted(
        { threadId, ...patch },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          chartDataApi.util.updateQueryData(
            "getChartCommentThread",
            threadId,
            (draft: object) => {
              Object.assign(draft, patch);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetChartDataQuery,
  useGetChartCommentThreadsQuery,
  useGetChartCommentThreadQuery,
  useCreateChartCommentThreadMutation,
  useRespondToChartCommentThreadMutation,
} = chartDataApi;
