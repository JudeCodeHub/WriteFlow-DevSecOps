import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <HiOutlineExclamationTriangle size={28} className="modal-icon" />
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete post
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
