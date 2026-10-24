import React from 'react';

export default function Modal({ header, open, onClose, onSave, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={onSave}>
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-900">{header}</h3>
            <button
              type="button"
              className="text-2xl leading-none text-gray-400 hover:text-gray-700"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          <div className="px-4 py-4">{children}</div>

          <div className="flex justify-end gap-2 border-t border-gray-200 px-4 py-3">
            <button
              type="button"
              className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
