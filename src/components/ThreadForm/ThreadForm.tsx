import { useEffect, useState } from "react";
import { useGetChartCommentThreadQuery } from "../../store/queries/chart";
import { ChartDataPoint, CommentThread } from "../../types/data";
import classNames from "../../utils/classNames";

export type ThreadFormData = {
  commentThread: CommentThread;
  chartDataPont: ChartDataPoint;
};

type Props = {
  data: ThreadFormData;
  onClose: () => void;
};

function ThreadForm({ data, onClose }: Props) {
  const [fadeIn, setFadeIn] = useState(false);
  const { isLoading, data: threadData } = useGetChartCommentThreadQuery(
    data.commentThread?.id,
    {
      skip: !data.commentThread?.id,
    }
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      setFadeIn(true);
    });
  }, []);

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
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  {data.chartDataPont.country} - {data.chartDataPont.feature}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {threadData?.commentsCount ? (
                      <span>comments: {threadData?.commentsCount}</span>
                    ) : (
                      <span>No comments yet</span>
                    )}
                    {threadData?.comments.map((c) => (
                      // Tailwind comment bubble
                      <div
                        className="flex items-center justify-between p-2 my-2 bg-gray-200 rounded-lg shadow-sm"
                        key={c.user_name + " - " + c.text}
                      >
                        <div className="flex items-center">
                          <div className="mx-3">
                            <h5 className="text-gray-900 font-bold">
                              {c.user_name}
                            </h5>
                            <p className="text-gray-600 text-sm">{c.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              test
            </button>
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
