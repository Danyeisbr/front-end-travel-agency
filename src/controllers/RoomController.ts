// Contains the room control logic (handling requests to the server).
import axios from "../services/databaseService";
import { Room } from "../models/RoomModel";

export const getRoomsController = async (): Promise<Room[]> => {
  const response = await axios.get("/rooms");
  return response.data;
};

export const getRoomByIdController = async (id: string): Promise<Room> => {
  const response = await axios.get("/rooms/" + id);
  return response.data;
};

export const createRoomController = async (
  newRoom: Room
): Promise<Room> => {
  const response = await axios.post("/rooms", newRoom);
  return response.data;
};

export const updateRoomController = async (
  RoomId: string,
  updatedRoom: Room
): Promise<Room> => {
  const response = await axios.put("/rooms/" + RoomId, updatedRoom);
  await axios.put("/rooms/" + RoomId, updatedRoom);
  return response.data;
};

export const deleteRoomController = async (
  RoomId: string
): Promise<Room> => {
  const response = await axios.delete("/rooms/" + RoomId);
  return response.data;
};
