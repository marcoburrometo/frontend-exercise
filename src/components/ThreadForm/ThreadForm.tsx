import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useCreateChartCommentThreadMutation,
  useGetChartCommentThreadQuery,
  useGetChartCommentThreadsQuery,
  useGetChartDataQuery,
  useRespondToChartCommentThreadMutation,
} from "../../store/queries/chart";
import { ChartDataPoint } from "../../types/data";
import classNames from "../../utils/classNames";
import CommentBubble from "../CommentBubble/CommentBubble";

export type ThreadFormData = {
  dataPoint: ChartDataPoint;
  title: string;
  threadId?: string;
};

type Props = ThreadFormData & {
  onClose: () => void;
};

function ThreadForm({
  dataPoint,
  title,
  threadId: propsThreadId,
  onClose,
}: Props) {
  const [fadeIn, setFadeIn] = useState(false);
  const [comment, setComment] = useState("");
  const [threadId, setThreadId] = useState(propsThreadId);
  const { data: threadData } = useGetChartCommentThreadQuery(threadId || "", {
    skip: !threadId,
  });

  const { refetch } = useGetChartCommentThreadsQuery();
  const [addNewComment] = useRespondToChartCommentThreadMutation();

  const [addNewThread, { data: addNewThreadResponse, isLoading }] =
    useCreateChartCommentThreadMutation();

  useEffect(() => {
    requestAnimationFrame(() => {
      setFadeIn(true);
    });
  }, []);

  useEffect(() => {
    if (addNewThreadResponse) {
      // New thread created; set threadId and refetch data
      setThreadId(addNewThreadResponse.id);
      refetch();
    }
  }, [addNewThreadResponse]);

  const addComment = useCallback(() => {
    if (threadId) {
      addNewComment({
        threadId: threadId,
        body: {
          comment: {
            text: comment,
            user_name: "Anonymous",
          },
        },
      });
    } else {
      addNewThread({
        comment: {
          text: comment,
          user_name: "Anonymous",
        },
        data_point: dataPoint,
      });
    }
    setComment("");
  }, [addNewComment, comment, threadId]);

  const commentsList = useMemo(() => {
    return (
      <div className="mt-2">
        <div className="text-sm text-gray-500">
          {threadData?.commentsCount ? (
            <span>Comments: {threadData?.commentsCount}</span>
          ) : (
            <span>No comments yet</span>
          )}
          {threadData?.comments.map((c, i) => (
            <CommentBubble
              key={i} // Should be c.id
              userName={c.userName}
              text={c.text}
            />
          ))}
        </div>
      </div>
    );
  }, [threadData]);

  const newCommentForm = useMemo(() => {
    return (
      <div className="mt-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="comment"
          >
            Add a comment
          </label>
          <textarea
            onChange={(e) => setComment(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="comment"
            placeholder="Enter your comment"
            value={comment}
          ></textarea>
          <button
            onClick={addComment}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add comment {isLoading && "Adding..."}
          </button>
        </div>
      </div>
    );
  }, [addNewComment, addComment, comment, isLoading, threadId]);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className={classNames(
            "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full",
            {
              "opacity-0 scale-95": !fadeIn,
            }
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  {title}
                </h3>
                <hr className="my-4" />
                {commentsList}
                <hr className="my-4" />
                {newCommentForm}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreadForm;
