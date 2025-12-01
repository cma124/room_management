import { Client, TablesDB, ID, Query } from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ROOMS_TABLE_ID = import.meta.env.VITE_APPWRITE_ROOMS_TABLE_ID;
const GUESTS_TABLE_ID = import.meta.env.VITE_APPWRITE_GUESTS_TABLE_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const tablesDB = new TablesDB(client);

export const listRooms = async () => {
  return await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: ROOMS_TABLE_ID,
    queries: [Query.orderAsc("room_no"), Query.orderAsc("room_name")],
  });
};

export const getRoom = async (rowId) => {
  return await tablesDB.getRow({
    databaseId: DATABASE_ID,
    tableId: ROOMS_TABLE_ID,
    rowId,
  });
};

export const createRoom = async (room) => {
  return await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: ROOMS_TABLE_ID,
    rowId: ID.unique(),
    data: {
      room_no: room.roomNo,
      room_name: room.roomName,
      room_size: room.roomSize,
      room_remarks: room.roomRemarks,
    },
  });
};

export const updateRoom = async (room) => {
  return await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: ROOMS_TABLE_ID,
    rowId: room.roomId,
    data: {
      room_no: room.roomNo,
      room_name: room.roomName,
      room_size: room.roomSize,
      room_remarks: room.roomRemarks,
    },
  });
};

export const deleteRoom = async (rowId) => {
  return await tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId: ROOMS_TABLE_ID,
    rowId,
  });
};

export const listGuestsByRoomId = async (roomId) => {
  return await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: GUESTS_TABLE_ID,
    queries: [Query.equal("room_id", [roomId]), Query.orderAsc("start_date")],
  });
};

export const listGuestsAfterToday = async () => {
  const todayMidnightUTC =
    new Date().toISOString().split("T")[0] + "T00:00:00.000Z";

  return await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: GUESTS_TABLE_ID,
    queries: [
      Query.select(["$id"]),
      Query.equal("status", "occupied"),
      Query.lessThan("end_date", todayMidnightUTC),
    ],
  });
};

export const getGuest = async (rowId) => {
  return await tablesDB.getRow({
    databaseId: DATABASE_ID,
    tableId: GUESTS_TABLE_ID,
    rowId,
  });
};

export const createGuest = async (guest) => {
  return await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: GUESTS_TABLE_ID,
    rowId: ID.unique(),
    data: {
      guest_name: guest.guestName,
      guest_phone: guest.guestPhone,
      guest_email: guest.guestEmail,
      no_of_guests: guest.noOfGuests,
      start_date: guest.startDate,
      end_date: guest.endDate,
      guest_deposit: guest.guestDeposit,
      guest_remarks: guest.guestRemarks,
      status: guest.status,
      room_id: guest.roomId,
    },
  });
};

export const updateGuest = async (guest) => {
  return await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: GUESTS_TABLE_ID,
    rowId: guest.guestId,
    data: {
      guest_name: guest.guestName,
      guest_phone: guest.guestPhone,
      guest_email: guest.guestEmail,
      no_of_guests: guest.noOfGuests,
      start_date: guest.startDate,
      end_date: guest.endDate,
      guest_deposit: guest.guestDeposit,
      guest_remarks: guest.guestRemarks,
      status: guest.status,
    },
  });
};

export const deleteGuest = async (rowId) => {
  return await tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId: GUESTS_TABLE_ID,
    rowId,
  });
};
