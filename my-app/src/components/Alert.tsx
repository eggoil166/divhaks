import React from "react";

interface AlertProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-2">Success!</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Alert;
