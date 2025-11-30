import { Client, TablesDB, ID, Query } from "appwrite";
import { getTwoHoursAgoUTC } from "./datetimeUtils";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const tablesDB = new TablesDB(client);

export const listRoomsTwoHoursAgo = async () => {
  const twoHoursAgo = getTwoHoursAgoUTC();

  return await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    queries: [
      Query.select(["$id"]),
      Query.equal("status", "booking"),
      Query.updatedBefore(twoHoursAgo),
    ],
  });
};

export const listRoomsAfterToday = async () => {
  const todayMidnightUTC =
    new Date().toISOString().split("T")[0] + "T00:00:00.000Z";

  return await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    queries: [
      Query.select(["$id"]),
      Query.equal("status", "occupied"),
      Query.lessThan("end_date", todayMidnightUTC),
    ],
  });
};

export const listRooms = async () => {
  return await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    queries: [Query.orderAsc("end_date")],
  });
};

export const getRoom = async (rowId) => {
  return await tablesDB.getRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId,
  });
};

export const createRoom = async (room) => {
  return await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
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
    tableId: TABLE_ID,
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
    tableId: TABLE_ID,
    rowId,
  });
};

export const updateGuest = async (guest) => {
  return await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: guest.roomId,
    data: {
      guest_name: guest.guestName,
      guest_phone: guest.guestPhone,
      guest_email: guest.guestEmail,
      no_of_guests: guest.noOfGuests,
      start_date: guest.startDate,
      end_date: guest.endDate,
      status: guest.status,
      guest_remarks: guest.guestRemarks,
      guest_deposit: guest.guestDeposit,
    },
  });
};

export const removeGuest = async (rowId) => {
  return await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId,
    data: {
      guest_name: null,
      guest_phone: null,
      guest_email: null,
      no_of_guests: 0,
      start_date: null,
      end_date: null,
      status: "available",
      guest_remarks: null,
      guest_deposit: 0,
    },
  });
};
