import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useCreateChartCommentThreadMutation,
  useGetChartCommentThreadQuery,
  useGetChartCommentThreadsQuery,
  useRespondToChartCommentThreadMutation,
} from "../../store/queries/chart";
import { ChartDataPoint } from "../../types/data";
import classNames from "../../utils/classNames";
import CommentBubble from "../CommentBubble/CommentBubble";
import Modal from "../Modal/Modal";

export type ThreadFormData = {
  dataPoint: ChartDataPoint;
  title: string;
  threadId?: string;
};

type Props = ThreadFormData & {
  onClose: () => void;
};

function ThreadModal({
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
            disabled={isLoading || !comment?.length}
            className={classNames(
              "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4",
              {
                "opacity-50 cursor-not-allowed": isLoading || !comment?.length,
              }
            )}
          >
            Add comment {isLoading && "Adding..."}
          </button>
        </div>
      </div>
    );
  }, [addNewComment, addComment, comment, isLoading, threadId]);

  return (
    <Modal onClose={onClose} title={title}>
      {commentsList}
      <hr className="my-4" />
      {newCommentForm}
    </Modal>
  );
}

export default ThreadModal;
