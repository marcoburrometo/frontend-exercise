import React from "react";

type Props = {
  children: React.ReactNode;
};

function Card({ children }: Props) {
  // Tailwind card with shadow
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">{children}</div>
    </div>
  );
}

export default Card;
