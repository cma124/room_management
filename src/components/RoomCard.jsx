import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaPen,
  FaRegTrashCan,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  deleteRoom,
  listGuestsByRoomId,
  deleteGuest,
} from "../utils/appwriteApi";
import { useEffect, useState } from "react";
import RoomCardBar from "./RoomCardBar";

const RoomCard = ({ room, loadRooms }) => {
  const navigate = useNavigate();

  const [guests, setGuests] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const availableContent = (
    <>
      <p className="text-base text-pine-green font-medium mb-4">Available</p>
      <div className="h-3 w-full bg-pine-green rounded-full"></div>
    </>
  );

  const guestsContent = (
    <div className="space-y-5">
      {guests.map((guest) => (
        <RoomCardBar key={guest.$id} guest={guest} />
      ))}
    </div>
  );

  const handleToggleAccordion = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCreateGuest = (e) => {
    e.stopPropagation();
    navigate(`/rooms/${room.$id}/guests/create`);
  };

  const handleEditRoom = (e) => {
    e.stopPropagation();
    navigate(`/rooms/${room.$id}/edit`);
  };

  const handleDeleteRoom = async (e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Are you sure you want to delete your room? This will delete ALL associated guests bookings."
      )
    ) {
      return false;
    }

    try {
      const guestsResponse = await listGuestsByRoomId(room.$id);
      const guestIds = guestsResponse.rows.map((row) => row.$id);

      if (guestIds && guestIds.length > 0) {
        await Promise.all(guestIds.map((guestId) => deleteGuest(guestId)));
      }

      await deleteRoom(room.$id);
      toast.success("Room is deleted successfully");
      loadRooms();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadGuests = async () => {
      const guestsResponse = await listGuestsByRoomId(room.$id);
      setGuests(guestsResponse.rows);
    };

    loadGuests();
  }, []);

  return (
    <div onClick={handleToggleAccordion}>
      <div className="bg-card-light p-4 rounded-lg shadow-sm flex items-center space-x-4">
        <div className="grow">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-light-primary">
                {room.room_no} {room.room_name && `- ${room.room_name}`}
              </h3>

              {guests.length > 0 &&
                (isExpanded ? (
                  <FaChevronUp className="text-lg md:text-xl" />
                ) : (
                  <FaChevronDown className="text-lg md:text-xl" />
                ))}
            </div>

            <div className="flex space-x-1 sm:space-x-3 md:space-x-5">
              <button
                onClick={handleCreateGuest}
                className="p-2 rounded-full hover:bg-gray-100 text-light-secondary"
              >
                <FaPlus className="text-base sm:text-lg md:text-xl" />
              </button>

              <button
                onClick={handleEditRoom}
                className="p-2 rounded-full hover:bg-gray-100 text-light-secondary"
              >
                <FaPen className="text-base sm:text-lg md:text-xl" />
              </button>

              <button
                onClick={handleDeleteRoom}
                className="p-2 rounded-full hover:bg-gray-100 text-light-secondary"
              >
                <FaRegTrashCan className="text-base sm:text-lg md:text-xl" />
              </button>
            </div>
          </div>

          {guests.length === 0 ? (
            availableContent
          ) : (
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isExpanded ? "max-h-screen" : "max-h-0"
              }`}
            >
              {guestsContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
