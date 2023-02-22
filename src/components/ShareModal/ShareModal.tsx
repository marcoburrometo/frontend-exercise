import React from 'react';
import { useGetShareLinkQuery } from '../../store/queries/share';
import Modal from '../Modal/Modal';

type Props = {
  onClose: () => void;
};

function ShareModal({ onClose }: Props) {
  const { data } = useGetShareLinkQuery();

  return (
    <Modal title="Share" onClose={onClose}>
      <p className="text-gray-500">
        Share this link with others to let them view this chart. Click on the input to copy the link
      </p>
      <div className="mt-4">
        <input
          onClick={(e) => {
            e.currentTarget.select();
            //  Copy to clipboard
            document.execCommand('copy');
          }}
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          value={window.location.origin + '/public-chart/' + data?.token}
          readOnly
        />
      </div>
    </Modal>
  );
}

export default ShareModal;
