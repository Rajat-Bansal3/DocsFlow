"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import { cn } from "@/lib/utils";
import Header from "./Header";
import ActiveCollaborators from "./ActiveCollaborators";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import edit from "@/public/assets/icons/edit.svg";
import { updateTitleAction } from "@/lib/actions/room.actions";
import ShareModel from "./ShareModel";

type CollaborativeRoomProps = {
  className?: string;
  roomId: string;
  roomMetadata: {
    title: string;
    creatorId: string;
    email:string
  };
  currentUserType: string;
  users: any[];
};

const CollabRoom = ({
  className,
  roomId,
  roomMetadata,
  currentUserType,
  users,
}: CollaborativeRoomProps) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(roomMetadata.title);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitle = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      setLoading(true);
      try {
        if (title !== roomMetadata.title) {
          const doc = await updateTitleAction({ roomId, title });
          if (doc) {
            setEditing(false);
          }
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        updateTitleAction({ roomId, title });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [roomId, title]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <div>
      <RoomProvider id={`${roomId}`}>
        <ClientSideSuspense fallback={<Loader />}>
          <div className={cn("collaborative-room", className)}>
            <Header>
              <div
                className='flex w-fit items-center justify-center gap-2'
                ref={containerRef}
              >
                {editing && !loading ? (
                  <Input
                    type='text'
                    value={title}
                    ref={inputRef}
                    placeholder='Enter title'
                    onChange={handleChange}
                    onKeyDown={updateTitle}
                    disabled={!editing}
                    className='document-title-input'
                  />
                ) : (
                  <>
                    <p className='document-title'>{title}</p>
                  </>
                )}
                {currentUserType === "editor" && !editing && (
                  <Image
                    src={edit}
                    width={24}
                    height={24}
                    alt='edit'
                    onClick={() => {
                      setEditing(true);
                    }}
                    className='cursor-pointer'
                  />
                )}
                {currentUserType !== "editor" && !editing && (
                  <p className='view-only'>View Only</p>
                )}

              </div>
              <div className='flex w-full flex-1 justify-end gap-2'>
                <ActiveCollaborators />
                <ShareModel
                  roomId={roomId}
                  collabs={users}
                  creatorId={roomMetadata.creatorId}
                  currentUserType={currentUserType as UserType}
                />
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </Header>
            <Editor roomId={roomId} currentUserType={currentUserType} />
          </div>
        </ClientSideSuspense>
      </RoomProvider>
    </div>
  );
};

export default CollabRoom;
