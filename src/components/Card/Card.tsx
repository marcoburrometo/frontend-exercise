import React from 'react';
import classNames from '../../utils/classNames';

type Props = {
  children: React.ReactNode;
  className?: string;
};

function Card({ children, className }: Props) {
  return (
    <div className={classNames('overflow-hidden bg-white shadow sm:rounded-lg', className || '')}>
      <div className="px-4 py-5 sm:px-6">{children}</div>
    </div>
  );
}

export default Card;
