import { useState } from 'react';

export default function Modal({
  open: initOpen,
  content,
  onClose,
}: {
  open: boolean;
  content: React.ReactNode;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(initOpen);

  const onBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
      onClose();
    }
  };

  return open ? (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div
          className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          onClick={onBackgroundClick}
        >
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
