import {
  API_BASE_URL,
  ChartDataResponse,
  CommentThreadResponse,
  CommentThreadsResponse,
  CreateThreadRequest,
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
    getSharedChartData: builder.query<ChartDataResponse, string>({
      query: (token) => `shared/${token}`,
    }),
    getChartCommentThreads: builder.query<CommentThreadsResponse, void>({
      query: () => "comment_threads",
    }),
    getChartCommentThread: builder.query<CommentThreadResponse, string>({
      query: (threadId) => `comment_threads/${threadId}`,
    }),
    createChartCommentThread: builder.mutation<
      CommentThreadResponse,
      CreateThreadRequest
    >({
      query: (thread) => ({
        url: "comment_threads",
        method: "POST",
        body: thread,
      }),
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
            (draft) => {
              draft.comments.push({
                text: patch.body.comment.text,
                userName: patch.body.comment.user_name,
              });
              Object.assign(draft, patch);
            }
          )
        );

        try {
          await queryFulfilled;
          // Update the comment count on the comments thread list
          dispatch(
            chartDataApi.util.updateQueryData(
              "getChartCommentThreads",
              undefined,
              (draft) => {
                const thread = draft.find((t) => t.id === threadId);
                if (thread) {
                  thread.commentsCount += 1;
                }
              }
            )
          );
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
  useGetSharedChartDataQuery,
  useGetChartCommentThreadsQuery,
  useGetChartCommentThreadQuery,
  useCreateChartCommentThreadMutation,
  useRespondToChartCommentThreadMutation,
} = chartDataApi;
