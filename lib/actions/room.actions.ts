"use server";

import { revalidatePath } from "next/cache";
import { liveblocks } from "../liveblocks";
import { nanoid } from "nanoid";
import { parseStringify } from "../utils";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metaData = {
      creatorID: userId,
      email,
      title: "Untitled",
    };

    const userAccess: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata: metaData,
      usersAccesses: userAccess,
      defaultAccesses: ["room:write"],
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.log("Error creating room: ", error);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (!room) throw new Error("room not found");

//WIP:DO ACCESS MANAGEMENT

    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    // if (!hasAccess) throw new Error("Unauthorised");

    return parseStringify(room);
  } catch (error) {
    console.log("error while getting room: ", error);
  }
};
export const updateTitleAction = async ({
  roomId,
  title,
}: {
  roomId: string;
  title: string;
}) => {
  try {
    const room = await liveblocks.updateRoom(roomId, { metadata: { title } });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(error);
  }
};
export const getDocuments = async ({ userId }: { userId: string }) => {
  try {
    const rooms = await liveblocks.getRooms({ userId });
    if (rooms) {
      revalidatePath("/");
      return parseStringify(rooms);
    }
  } catch (error) {
    console.log("Error fetching rooms", error);
  }
};
export const deleteDocument =async ({ roomId }: { roomId: string }) => {
  try {
    
    await liveblocks.deleteRoom(roomId)
    return true

  } catch (error) {
    console.log("Error deleting room" , error)
  }
}