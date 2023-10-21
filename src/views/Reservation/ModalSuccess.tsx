import "../../assets/styles/main.css";

interface ModalSuccessProps {
  show: boolean;
  onHide: () => void;
  reservationNumber?: number;
}

const ModalSuccess = ({
  show,
  onHide,
  reservationNumber,
}: ModalSuccessProps) => {
  const displayReservationNumber =
    reservationNumber !== undefined ? reservationNumber : 0;
  return (
    <>
      {show && (
        <>
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Reservation Successful!</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => onHide()}
            ></button>
          </div>
          <div className="modal-body text-center">
            <h2>Your Reservation Number:</h2>
            <h1 className="display-1 mb-4">{displayReservationNumber}</h1>
            <p>
              We have sent you a confirmation email with the details of your
              reservation.
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default ModalSuccess;