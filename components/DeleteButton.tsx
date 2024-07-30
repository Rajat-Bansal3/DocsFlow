"use client";

import React from "react";
import { Button } from "./ui/button";
import { deleteDocument } from "@/lib/actions/room.actions";

type Props = {
  roomIdProp: string;
  className: string;
};

const DeleteButton = ({ roomIdProp, className }: Props) => {
  const handleDelete = async ({ roomId }: { roomId: string }) => {
    try {
      const deleted = await deleteDocument({ roomId });
    } catch (error) {
      console.log("Error Deleteing Document", error);
    }
  };
  return (
    <Button
      className={className}
      onClick={(e) => {
        handleDelete({ roomId: roomIdProp });
      }}
    >
      Delete Room
    </Button>
  );
};

export default DeleteButton;
