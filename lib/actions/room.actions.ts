"use server";

import { revalidatePath } from "next/cache";
import { liveblocks } from "../liveblocks";
import { nanoid } from "nanoid";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from "next/navigation";

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
      defaultAccesses: [],
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

    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) throw new Error("Unauthorised");

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
export const deleteDocument = async ({ roomId }: { roomId: string }) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath("/");
    return true;
  } catch (error) {
    console.log("Error deleting room", error);
  }
};
export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy
}: ShareDocumentParams) => {
  console.log(userType);
  try {
    const roomAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses: roomAccesses,
    });

    if (room) {
      const notId = nanoid();
      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: '$documentAccess',
        subjectId: notId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email
        },
        roomId
      })

      return;
    }

    revalidatePath(`document/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log("Error updating room access", error);
  }
};
export const removeCollab = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw new Error("cant remove yourself");
    }

    const _room = await liveblocks.updateRoom(roomId, {
      usersAccesses: { [email]: null },
    });
    revalidatePath(`documents/${roomId}`);
    return parseStringify(_room);
  } catch (error) {
    console.log(`Error Removing collaborator ${error}`);
  }
};
