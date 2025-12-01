import { useNavigate } from "react-router-dom";
import { formatDate, getDaysDifference } from "../utils/datetimeUtils";

const RoomCardBar = ({ guest }) => {
  const navigate = useNavigate();

  const daysDifference = getDaysDifference(guest.start_date, guest.end_date);

  const barStyle = () => {
    if (guest.status === "booking") {
      return "h-3 w-full bg-light-secondary rounded-full";
    } else {
      return "h-3 w-full bg-primary rounded-full";
    }
  };

  const handleEditGuest = (e) => {
    e.stopPropagation();
    navigate(`/rooms/${guest.room_id}/guests/${guest.$id}/edit`);
  };

  return (
    <div>
      {guest.status === "booking" && (
        <p className="text-base text-light-secondary font-medium mb-4">
          Booking by {guest.guest_name}
        </p>
      )}

      {guest.status === "occupied" && (
        <p className="text-base text-primary font-medium mb-4">
          Occupied by {guest.guest_name}
        </p>
      )}

      <div onClick={handleEditGuest} className={barStyle()}></div>

      <div className="flex justify-between items-center mt-3">
        <span className="text-xs sm:text-base text-light-secondary">
          {formatDate(guest.start_date)}
        </span>

        <span className="text-xs sm:text-base font-bold">{daysDifference}</span>

        <span className="text-xs sm:text-base text-light-secondary">
          {formatDate(guest.end_date)}
        </span>
      </div>
    </div>
  );
};

export default RoomCardBar;
