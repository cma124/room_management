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
