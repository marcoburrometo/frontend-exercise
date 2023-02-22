type Props = {
  userName: string;
  text: string;
};

function CommentBubble({ userName, text }: Props) {
  return (
    <div className="flex items-center justify-between p-2 my-2 border-gray-300 border-solid border rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="mx-3">
          <h5 className="text-gray-900 font-bold">{userName}</h5>
          <p className="text-gray-600 text-sm">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default CommentBubble;
