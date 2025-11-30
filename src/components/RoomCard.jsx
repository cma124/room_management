import { useNavigate } from "react-router-dom";
import { FaPen, FaRegTrashCan } from "react-icons/fa6";
import { toast } from "react-toastify";
import { deleteRoom } from "../utils/appwriteApi";
import { formatDate, getDaysDifference } from "../utils/datetimeUtils";

const RoomCard = ({ room, loadRooms }) => {
  const navigate = useNavigate();

  const daysDifference = getDaysDifference(room.start_date, room.end_date);

  const barStyle = () => {
    if (room.status === "available") {
      return "h-3 w-full bg-pine-green rounded-full";
    } else if (room.status === "booking") {
      return "h-3 w-full bg-light-secondary rounded-full";
    } else {
      return "h-3 w-full bg-primary rounded-full";
    }
  };

  const handleEditGuest = () => {
    navigate(`/rooms/${room.$id}`);
  };

  const handleEditRoom = (e) => {
    e.stopPropagation();
    navigate(`/rooms/${room.$id}/edit`);
  };

  const handleDeleteRoom = async (e) => {
    e.stopPropagation();

    try {
      await deleteRoom(room.$id);
      toast.success("Room is deleted successfully");
      loadRooms();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div onClick={handleEditGuest}>
      <div className="bg-card-light p-4 rounded-lg shadow-sm flex items-center space-x-4">
        <div className="grow">
          <h3 className="text-lg font-semibold text-light-primary mb-2">
            {room.room_no} {room.room_name && `- ${room.room_name}`}
          </h3>

          {room.status === "available" && (
            <p className="text-base text-pine-green font-medium mb-4">
              Available
            </p>
          )}

          {room.status === "booking" && (
            <p className="text-base text-light-secondary font-medium mb-4">
              Booking by {room.guest_name}
            </p>
          )}

          {room.status === "occupied" && (
            <p className="text-base text-primary font-medium mb-4">
              Occupied by {room.guest_name}
            </p>
          )}

          <div>
            <div className={barStyle()}></div>

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs sm:text-base text-light-secondary">
                {formatDate(room.start_date)}
              </span>

              <span className="text-xs sm:text-base font-bold">
                {daysDifference}
              </span>

              <span className="text-xs sm:text-base text-light-secondary">
                {formatDate(room.end_date)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-5">
          <button
            onClick={(e) => handleEditRoom(e)}
            className="p-2 rounded-full hover:bg-gray-100 text-light-secondary"
          >
            <FaPen className="text-base" />
          </button>

          <button
            onClick={(e) => handleDeleteRoom(e)}
            className="p-2 rounded-full hover:bg-gray-100 text-light-secondary"
          >
            <FaRegTrashCan className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
