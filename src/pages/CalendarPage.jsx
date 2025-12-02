import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { toast } from "react-toastify";
import { listGuests, listRooms } from "../utils/appwriteApi";
import { transformGuestToEvent } from "../utils/calendarUtils";
import Spinner from "../components/Spinner";

const CalendarPage = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [allGuests, setAllGuests] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [guestsResponse, roomsResponse] = await Promise.all([
          listGuests(),
          listRooms(),
        ]);

        setAllRooms(roomsResponse.rows);
        setAllGuests(guestsResponse.rows);

        if (roomsResponse.rows.length > 0) {
          setSelectedRoomId(roomsResponse.rows[0].$id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load room and guest data.");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Filter and transform data whenever the selectedRoomId or allGuests changes
  useEffect(() => {
    if (selectedRoomId && allGuests.length > 0) {
      // Filter guests by the selected room ID
      const filteredGuests = allGuests.filter(
        (guest) =>
          guest.room_id === selectedRoomId &&
          guest.status !== "available" &&
          guest.start_date &&
          guest.end_date
      );

      // Transform filtered guests into FullCalendar events
      const transformedEvents = filteredGuests.map((guest) =>
        transformGuestToEvent(guest)
      );

      setEvents(transformedEvents);
    } else {
      // If no room is selected or no data exists, clear events
      setEvents([]);
    }
  }, [selectedRoomId, allGuests]);

  // Handler for the room dropdown change
  const handleRoomChange = (e) => {
    setSelectedRoomId(e.target.value);
  };

  return (
    <div className="h-screen mx-auto md:mx-5">
      <header className="shrink-0 px-6 pt-12 pb-4 mb-1">
        <h1 className="text-3xl font-bold text-slate-900">
          Room Booking Calendar
        </h1>
      </header>

      <div className="mb-6 flex items-center bg-white p-4 rounded-lg shadow-md">
        <label
          htmlFor="room-select"
          className="mr-3 font-semibold text-gray-700"
        >
          Select Room:
        </label>

        <select
          id="room-select"
          value={selectedRoomId}
          onChange={handleRoomChange}
          className="p-2 border border-indigo-300 rounded-lg shadow-inner focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
        >
          {allRooms.map((room) => (
            <option key={room.$id} value={room.$id}>
              {room.room_no}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200 p-4">
          <div style={{ height: "75vh", minHeight: "600px" }}>
            {selectedRoomId ? (
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                events={events}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "",
                }}
                eventContent={(eventInfo) => (
                  <div
                    className="text-xs p-2"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <p className="font-semibold">{eventInfo.event.title}</p>
                  </div>
                )}
                nowIndicator={true}
                expandRows={true}
                height="100%"
              />
            ) : (
              <div className="text-center p-20 text-xl text-gray-500">
                No rooms available or selected.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
