import ActiveCollaborators from "@/components/ActiveCollaborators";
import CollabRoom from "@/components/collabRoom";
import { Editor } from "@/components/editor/Editor";
import Header from "@/components/Header";
import { getDocument } from "@/lib/actions/room.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const Document = async ({ params: { id } }: SearchParamProps) => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const room = await getDocument({
    roomId: id,
    userId: user.emailAddresses[0].emailAddress,
  });

  const userIds = Object.keys(room.usersAccesses);
  const users = await getUsers({ userIds });

  const usersData = users.map((user: User) =>
    // console.log(user)
    ({
      ...user,
      userType: room.usersAccesses[user.email]?.includes("room:write")
        ? "editor"
        : "viewer",
    })
  );
  const currentUserType = room.usersAccesses[
    user.emailAddresses[0].emailAddress
  ]?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <div>
      <CollabRoom
        className='flex w-full flex-col items-center'
        roomId={`${room.id}`}
        roomMetadata={{
          creatorId: room.metadata.creatorID,
          email: room.metadata.email,
          title: room.metadata.title,
        }}
        users={usersData}
        currentUserType={`editor`}
      />
    </div>
  );
};

export default Document;
