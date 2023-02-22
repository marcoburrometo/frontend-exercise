import React from 'react';

type Props = {
  userName: string;
  text: string;
};

function CommentBubble({ userName, text }: Props) {
  return (
    <div className="my-2 flex items-center justify-between rounded-lg border border-solid border-gray-300 p-2 shadow-sm">
      <div className="flex items-center">
        <div className="mx-3">
          <h5 className="font-bold text-gray-900">{userName}</h5>
          <p className="text-sm text-gray-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default CommentBubble;
