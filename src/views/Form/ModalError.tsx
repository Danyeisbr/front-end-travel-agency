import "../../assets/styles/main.css"

interface ModalErrorProps {
  show: boolean;
  onHide: () => void;
}

function ModalError({ show, onHide }: ModalErrorProps) {
  return (
    <>
    {show && (
      <div className="modal custom-modal" role="dialog" style={{ display: 'block' }} >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header bg-primary">
              <h5 className="modal-title text-white">Error</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => onHide()}
              ></button>
            </div>
            <div className="modal-body">
              The check-out date must be after check-in date.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => onHide()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default ModalError;
