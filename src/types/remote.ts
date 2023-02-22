import {
  Country,
  ChartDataFeature,
  CommentThread,
  ChartDataPoint,
  Comment,
  CommentRequest
} from './data';

// ### `GET /chart/data`
// Returns chart data formatted to be ready-for-consumption.
export type ChartDataResponse = Array<
  {
    [key in ChartDataFeature]: number;
  } & {
    country: Country;
  }
>;

// ### `GET /chart/comment_threads`
// Returns a list of comment threads,
export type CommentThreadsResponse = CommentThread[];

// ### `GET /chart/comment_threads/:thread_id`
// Returns a list of comments in a thread
export type CommentThreadResponse = CommentThread & {
  comments: Comment[];
};

// ### `POST /chart/comment_threads`
// Creates a new comment thread, responds with `CommentThreadResponse`
export type CreateThreadRequest = {
  comment: CommentRequest;
  data_point: ChartDataPoint;
};

// ### `POST /chart/comment_threads/:thread_id/respond`
// Posts a new comment to a thread, responds with `CommentThreadResponse`

export type RespondToCommentThreadRequest = {
  comment: CommentRequest;
};

// ### `GET /share`
// Returns a shareable link for a chart

export type ShareResponse = {
  token: string;
};

// ### `GET /chart/shared/:share_id`
// Returns chart data by token, responds with `ChartDataResponse`

/**
 * TODO: env var
 */
export const API_BASE_URL = 'http://localhost:8000';
