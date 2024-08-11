"use client";

import { useSelf } from "@liveblocks/react/suspense";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Copy } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import { Label } from "./ui/label";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";

const ShareModel = ({
  roomId,
  collabs,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) => {
  const user = useSelf();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [type, setType] = useState<UserType>("viewer");

  const shareDocumentHandler = async (type: string) => {
    setLoading(true);

    await updateDocumentAccess({
      roomId,
      email,
      userType: type as UserType,
      updatedBy: user.info,
    });

    setLoading(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className='gradient-blue flex h-9 gap-1 px-4'
            disabled={loading || currentUserType !== "editor"}
          >
            <Image
              src={"/assets/icons/share.svg"}
              alt='share'
              width={20}
              height={20}
              className='min-w-4 md:size-5'
            />
            <p className='mr-1 hidden sm:block'>Share</p>{" "}
          </Button>
        </DialogTrigger>
        <DialogContent className='shad-dialog'>
          <DialogHeader>
            <DialogTitle>Manage Who Can View This Project</DialogTitle>
            <DialogDescription>
              Select Which Users Can View Or Edit Document
            </DialogDescription>
          </DialogHeader>

          <Label htmlFor='email' className='mt-6 text-blue-100'>
            Email Address
          </Label>
          <div className='flex items-center gap-3'>
            <div className='flex flex-1 rounded-md bg-dark-400'>
              <Input
                id='email'
                placeholder='Enter Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='share-input'
              />
              <UserTypeSelector userType={type} setUserType={setType} />
            </div>
            <Button
              type='submit'
              disabled={loading}
              onClick={() => shareDocumentHandler(type)}
              className='gradient-blue flex h-full gap-1 px-5'
            >
              {loading ? "Sending..." : "Invite"}
            </Button>
          </div>
          <div className='my-2 space-y-2'>
            <ul className='flex flex-col'>
              {collabs.map((collab) => {
                return (
                  <Collaborator
                    key={collab.id}
                    roomId={roomId}
                    email={collab.email}
                    collaborator={collab}
                    user={user.info}
                    creatorId={creatorId}
                  />
                );
              })}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShareModel;
