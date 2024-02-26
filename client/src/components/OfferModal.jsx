import React from "react";

const OfferModal = ({ offer, onClose, onModify, onDelete }) => (
  <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
    <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
      <div>
        <h3 className="text-lg font-bold">{offer.title}</h3>
      </div>
      <div className="mt-4">
        <button
          className="mr-2 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={onModify}
        >
          Modify
        </button>
        <button
          className="mr-2 px-5 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={onDelete}
        >
          Delete
        </button>
        <button
          className="px-5 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default OfferModal;
