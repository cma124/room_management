import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getGuest,
  updateGuest,
  deleteGuest,
  createGuest,
  getRoom,
} from "../utils/appwriteApi";
import {
  checkInputDates,
  calculateTimeRemaining,
  formatTime,
} from "../utils/datetimeUtils";

const GuestPage = () => {
  const navigate = useNavigate();
  const { id, guestId } = useParams();

  const [room, setRoom] = useState(null);
  const [guest, setGuest] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  const guestForm = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    switch (
      checkInputDates(
        guestForm.current.start_date.value,
        guestForm.current.end_date.value
      )
    ) {
      case "start_date end_date < today":
        toast.warning(
          "Start Date and End Date must be today or later than today"
        );
        return;

      case "start_date < today":
        toast.warning("Start Date must be today or later than today");
        return;

      case "end_date < today":
        toast.warning("End Date must be today or later than today");
        return;

      case "end_date < start_date":
        toast.warning("End Date must be later than or equal to Start Date");
        return;

      case null:
        console.error("Input Dates error");
        return;
    }

    if (!guestId) {
      try {
        await createGuest({
          guestName: guestForm.current.guest_name.value,
          guestPhone: guestForm.current.guest_phone.value,
          guestEmail: guestForm.current.guest_email.value,
          startDate: guestForm.current.start_date.value,
          endDate: guestForm.current.end_date.value,
          noOfGuests: parseInt(guestForm.current.no_of_guests.value),
          guestDeposit: parseInt(guestForm.current.guest_deposit.value),
          guestRemarks: guestForm.current.guest_remarks.value,
          status: guestForm.current.status.value,
          roomId: id,
        });

        toast.success("Booking is saved successfully");
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await updateGuest({
          guestId,
          guestName: guestForm.current.guest_name.value,
          guestPhone: guestForm.current.guest_phone.value,
          guestEmail: guestForm.current.guest_email.value,
          startDate: guestForm.current.start_date.value,
          endDate: guestForm.current.end_date.value,
          noOfGuests: parseInt(guestForm.current.no_of_guests.value),
          guestDeposit: parseInt(guestForm.current.guest_deposit.value),
          guestRemarks: guestForm.current.guest_remarks.value,
          status: guestForm.current.status.value,
        });

        toast.success("Booking is updated successfully");
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();

    try {
      await deleteGuest(guestId);

      toast.success("Booking is cleared successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Only run timer if guest data is loaded AND an end_date exists
    if (!guest || !guest.$updatedAt || guest.status !== "booking") {
      setTimeRemaining({ hours: 0, minutes: 0, seconds: 0, expired: true });
      return;
    }

    const timer = setInterval(() => {
      if (guest.status === "booking") {
        const remainingTime = calculateTimeRemaining(guest.$updatedAt);
        setTimeRemaining(remainingTime);

        // If time has expired, stop the timer
        if (remainingTime.expired) {
          clearInterval(timer);
        }
      } else {
        // If status is 'available', stop timer
        clearInterval(timer);
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0, expired: true });
      }
    }, 1000); // Update every 1 second

    // Cleanup function: important to stop the interval when the component unmounts
    return () => clearInterval(timer);
  }, [guest]);

  useEffect(() => {
    const loadGuest = async () => {
      try {
        if (guestId) {
          const guestResponse = await getGuest(guestId);
          setGuest(guestResponse);

          const roomReponse = await getRoom(id);
          setRoom(roomReponse);

          guestForm.current.guest_name.value = guestResponse.guest_name;
          guestForm.current.guest_phone.value = guestResponse.guest_phone;
          guestForm.current.guest_email.value = guestResponse.guest_email;
          guestForm.current.start_date.value =
            guestResponse.start_date && guestResponse.start_date.split("T")[0];
          guestForm.current.end_date.value =
            guestResponse.end_date && guestResponse.end_date.split("T")[0];
          guestForm.current.no_of_guests.value = guestResponse.no_of_guests;
          guestForm.current.status.value =
            guestResponse.status === null ? "booking" : guestResponse.status;
          guestForm.current.guest_deposit.value = guestResponse.guest_deposit;
          guestForm.current.guest_remarks.value = guestResponse.guest_remarks;
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (guestId) {
      loadGuest();
    }
  }, []);

  return (
    <div className="mx-auto md:mx-5 mt-4 min-h-screen flex flex-col p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-navy">
          {!guestId && "Create New Booking"}
          {guestId && room && `${room.room_no} `}
          {guestId && room && room.room_name && `- ${room.room_name}`}
        </h1>

        {guest && guest.$updatedAt && guest.status === "booking" && (
          <div className="mt-5 p-3 border-l-4 border-primary bg-blue-50">
            <p className="text-sm font-semibold text-gray-600">
              Booking Time Remaining
            </p>

            <p
              className={`font-mono text-4xl ${
                timeRemaining.expired ? "text-red-600" : "text-primary"
              }`}
            >
              {timeRemaining.expired ? (
                "EXPIRED"
              ) : (
                <>
                  <span className="tabular-nums">
                    {formatTime(timeRemaining.hours)}
                  </span>
                  :
                  <span className="tabular-nums">
                    {formatTime(timeRemaining.minutes)}
                  </span>
                  :
                  <span className="tabular-nums">
                    {formatTime(timeRemaining.seconds)}
                  </span>
                </>
              )}
            </p>
          </div>
        )}
      </header>

      <main>
        <form
          ref={guestForm}
          onSubmit={handleSubmit}
          className="grow space-y-6"
          id="guest-form"
        >
          <div className="space-y-3">
            <label
              className="text-sm font-bold text-gray-700"
              htmlFor="guest-name"
            >
              Guest Name
            </label>
            <input
              className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              id="guest-name"
              placeholder="Enter guest's name"
              type="text"
              name="guest_name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700" htmlFor="phone">
              Phone
            </label>
            <input
              className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              id="phone"
              inputMode="numeric"
              placeholder="e.g., 09 987 654 321"
              type="tel"
              name="guest_phone"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              id="email"
              inputMode="email"
              placeholder="example@email.com"
              type="email"
              name="guest_email"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-sm font-bold text-gray-700"
                htmlFor="start-date"
              >
                Start Date
              </label>
              <input
                className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                id="start-date"
                type="date"
                name="start_date"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-bold text-gray-700"
                htmlFor="end-date"
              >
                End Date
              </label>
              <input
                className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                id="end-date"
                type="date"
                name="end_date"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-sm font-bold text-gray-700"
                htmlFor="num-guests"
              >
                Number of Guests
              </label>
              <input
                className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                id="num-guests"
                inputMode="numeric"
                placeholder="e.g., 2"
                type="number"
                name="no_of_guests"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-bold text-gray-700"
                htmlFor="status"
              >
                Status
              </label>
              <select
                className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                id="status"
                name="status"
              >
                <option value="booking">Booking</option>
                <option className="text-coral" value="occupied">
                  Occupied
                </option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-bold text-gray-700"
              htmlFor="guest-deposit"
            >
              Deposit Amount
            </label>
            <input
              className="text-base w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              id="guest-deposit"
              placeholder="e.g., 300000"
              type="text"
              name="guest_deposit"
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
              placeholder="Add any special requests or notes ..."
              rows="4"
              name="guest_remarks"
            ></textarea>
          </div>

          <div className="mt-8 flex flex-col space-y-5 md:flex-row md:space-x-5">
            <button
              type="submit"
              className="w-full h-14 bg-primary text-white font-bold text-lg rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-primary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Save Booking
            </button>

            {guest && guest.status !== "available" && (
              <button
                onClick={handleClear}
                type="button"
                className="w-full h-14 bg-forest text-white font-bold text-lg rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-forest transition-colors"
              >
                Clear Booking
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default GuestPage;
