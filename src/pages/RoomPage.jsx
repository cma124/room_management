import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRoom, createRoom, updateRoom } from "../utils/appwriteApi";

const RoomPage = () => {
  const roomForm = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      try {
        await createRoom({
          roomNo: roomForm.current.room_no.value,
          roomName: roomForm.current.room_name.value,
          roomSize: roomForm.current.room_size.value,
          roomRemarks: roomForm.current.room_remarks.value,
        });

        toast.success("Room is created successfully");
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await updateRoom({
          roomId: id,
          roomNo: roomForm.current.room_no.value,
          roomName: roomForm.current.room_name.value,
          roomSize: roomForm.current.room_size.value,
          roomRemarks: roomForm.current.room_remarks.value,
        });

        toast.success("Room is updated successfully");
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const loadRoom = async () => {
    try {
      const roomResponse = await getRoom(id);

      roomForm.current.room_no.value = roomResponse.room_no;
      roomForm.current.room_name.value = roomResponse.room_name;
      roomForm.current.room_size.value = roomResponse.room_size;
      roomForm.current.room_remarks.value = roomResponse.room_remarks;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      loadRoom();
    }
  }, []);

  return (
    <div className="mx-auto md:mx-5 mt-4 min-h-screen flex flex-col p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-navy">
          {!id ? "Create New Room" : "Edit Room"}
        </h1>
      </header>

      <main>
        <form
          ref={roomForm}
          onSubmit={handleSubmit}
          className="grow space-y-6"
          id="room-form"
        >
          <div className="space-y-2">
            <label
              className="text-sm font-bold text-gray-700"
              htmlFor="room-no"
            >
              Room No.
            </label>
            <input
              className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              id="room-no"
              placeholder="e.g., 101"
              type="text"
              name="room_no"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-bold text-gray-700"
              htmlFor="room-name"
            >
              Room Name
            </label>
            <input
              className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              id="room-name"
              placeholder="e.g., Deluxe"
              type="text"
              name="room_name"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-bold text-gray-700"
              htmlFor="room-size"
            >
              Room Size
            </label>
            <input
              className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              id="room-size"
              placeholder="e.g., 20 sq ft"
              type="text"
              name="room_size"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-bold text-gray-700"
              htmlFor="remarks"
            >
              Remarks
            </label>
            <textarea
              className="text-base w-full p-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              id="remarks"
              placeholder="Add any notes ..."
              rows="4"
              name="room_remarks"
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-8 w-full h-14 bg-primary text-white font-bold text-lg rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-primary transition-colors"
          >
            {!id ? "Create" : "Update"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default RoomPage;
