// // Modal.jsx
// import React from "react";

// const Modal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
//       <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
//         <button onClick={onClose} className="float-right font-bold">
//           X
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Modal;
import React, { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(); // Reference to the modal content

  // Effect to handle clicks outside the modal content
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Call the onClose function if the click is outside the modal
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]); // Depend on onClose to re-attach if it changes

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div
        className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full"
        ref={modalRef}
      >
        <button onClick={onClose} className="float-right font-bold">
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
