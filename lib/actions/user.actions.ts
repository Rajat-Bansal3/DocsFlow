"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";
import { Romanesco } from "next/font/google";

const client = clerkClient();

export const getUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const { data } = await client.users.getUserList({
      emailAddress: userIds,
    });

    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));

    const sortedUsers = userIds.map((email) =>
      users.find((user) => user.email === email)
    );

    return parseStringify(sortedUsers);
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
  }
};

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );

    if (text.length >= 1) {
      const _text = text.toLowerCase();
      const filteredUsers = users.filter((email: string) =>
        text.toLowerCase().includes(_text)
      );

      return parseStringify(filteredUsers);
    }
    return parseStringify(users);
  } catch (error) {
    console.log(`Error fetching Document users: ${error}`);
  }
};
