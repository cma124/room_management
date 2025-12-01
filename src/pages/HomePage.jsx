import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRotateRight } from "react-icons/fa6";
import Spinner from "../components/Spinner";
import RoomCard from "../components/RoomCard";
import NavBar from "../components/NavBar";
import {
  listRooms,
  listGuestsAfterToday,
  deleteGuest,
} from "../utils/appwriteApi";

const HomePage = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRooms = async () => {
    setLoading(true);

    try {
      const guestsAfterToday = await listGuestsAfterToday();
      if (guestsAfterToday.rows.length) {
        const guestsCleanupPromises = guestsAfterToday.rows.map((guest) =>
          deleteGuest(guest.$id)
        );

        await Promise.all(guestsCleanupPromises);
      }

      const roomsResponse = await listRooms();
      setRooms(roomsResponse.rows);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <>
      <div className="mx-auto min-h-screen flex flex-col md:mx-5 mt-4 pb-30">
        <header className="p-6 pb-4 bg-background-light">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-black overflow-hidden">
                <img
                  alt="Shwe Myint Moe Dream Logo"
                  className="w-full h-full object-cover"
                  src="/ShweMyintMoeDream_Logo.jpg"
                />
              </div>

              <div>
                <h1 className="mb-1 font-header text-2xl text-primary">
                  Shwe Myint Moe Dream
                </h1>
                <p className="font-header text-light-secondary text-lg">
                  Inn Pyin Home
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="grow px-6 pt-4 overflow-y-auto">
          <h2 className="text-3xl font-bold text-light-primary mb-2">
            Room Status
          </h2>

          <div className="flex justify-between items-center mb-6">
            <p className="text-base text-light-secondary">
              Overview of room availability
            </p>

            <button onClick={loadRooms} className="me-4">
              <FaArrowRotateRight className="text-2xl md:text-3xl" />
            </button>
          </div>

          <div className="space-y-5">
            {loading ? (
              <Spinner />
            ) : rooms.length ? (
              rooms.map((room) => (
                <RoomCard key={room.$id} room={room} loadRooms={loadRooms} />
              ))
            ) : (
              <h2 className="text-xl text-center text-primary mt-30">
                No rooms yet
              </h2>
            )}
          </div>
        </main>

        <div className="fixed bottom-24 right-8">
          <button
            onClick={() => navigate("/rooms/create")}
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <span className="text-3xl">+</span>
          </button>
        </div>
      </div>

      <NavBar />
    </>
  );
};

export default HomePage;
