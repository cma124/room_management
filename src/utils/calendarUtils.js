import moment from "moment";

export const transformGuestToEvent = (guest) => {
  const startDate = moment(guest.start_date).toDate();
  const endDate = moment(guest.end_date).toDate();

  const color =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");

  return {
    id: guest.$id,
    title: guest.guest_name,
    start: startDate,
    end: endDate,
    allDay: false,
    resourceId: guest.room_id,
    backgroundColor: color,
    borderColor: color,
    extendedProps: {
      status: guest.status,
      room_no: guest.room_no,
    },
  };
};

export const checkBookingConflict = (
  newStart,
  newEnd,
  existingGuests,
  guestIdToExclude = null
) => {
  const proposedStart = moment(newStart);
  const proposedEnd = moment(newEnd);

  for (const existingGuest of existingGuests) {
    if (guestIdToExclude && existingGuest.$id === guestIdToExclude) {
      continue;
    }

    const existingStart = moment(existingGuest.start_date);
    const existingEnd = moment(existingGuest.end_date);

    const nonOverlap1 = proposedEnd.isSameOrBefore(existingStart, "day");
    const nonOverlap2 = proposedStart.isSameOrAfter(existingEnd, "day");

    const isConflict = !(nonOverlap1 || nonOverlap2);

    if (isConflict) {
      return existingGuest;
    }
  }

  return null;
};
