import { useNavigate } from "react-router-dom";
import {
  FaPen,
  FaRegTrashCan,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";
import { toast } from "react-toastify";
import { deleteRoom, listGuestsByRoomId } from "../utils/appwriteApi";
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

  const handleToggleAccordion = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
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

  const handleCreateGuest = () => {
    navigate(`/rooms/${room.$id}/guests/create`);
  };

  useEffect(() => {
    const loadGuests = async () => {
      const guestsResponse = await listGuestsByRoomId(room.$id);
      setGuests(guestsResponse.rows);
    };

    loadGuests();
  }, []);

  return (
    <div onClick={handleCreateGuest}>
      <div className="bg-card-light p-4 rounded-lg shadow-sm flex items-center space-x-4">
        <div className="grow">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-start space-x-2">
              <h3 className="text-lg font-semibold text-light-primary">
                {room.room_no} {room.room_name && `- ${room.room_name}`}
              </h3>

              {guests.length > 0 && (
                <button
                  onClick={handleToggleAccordion}
                  className="p-1 rounded-full text-light-secondary hover:bg-gray-100"
                >
                  {isExpanded ? (
                    <FaChevronUp className="text-lg md:text-xl" />
                  ) : (
                    <FaChevronDown className="text-lg md:text-xl" />
                  )}
                </button>
              )}
            </div>

            <div className="flex space-x-3 md:space-x-5">
              <button
                onClick={handleEditRoom}
                className="p-2 rounded-full hover:bg-gray-100 text-light-secondary"
              >
                <FaPen className="text-base" />
              </button>

              <button
                onClick={handleDeleteRoom}
                className="p-2 rounded-full hover:bg-gray-100 text-light-secondary"
              >
                <FaRegTrashCan className="text-base" />
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
