"use client"

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getDocumentUsers, getUsers } from "@/lib/actions/user.actions";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";

type Props = {};

const Provider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useUser();

  return (
    <LiveblocksProvider
      authEndpoint='/api/liveblocks-auth'
      resolveUsers={async ({ userIds }) => {
        const users = await getUsers({ userIds });
        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          text,
          currentUser: clerkUser?.emailAddresses[0].emailAddress!,
        });
        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
