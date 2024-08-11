"use client";

import React from "react";
import { Button } from "./ui/button";
import { deleteDocument } from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";

type Props = {
  roomIdProp: string;
  className: string;
};

const DeleteButton = ({ roomIdProp, className }: Props) => {
  const nav = useRouter()
  const handleDelete = async (
    e: React.MouseEvent,
    { roomId }: { roomId: string }
  ) => {
    e.stopPropagation();
    try {
      const deleted = await deleteDocument({ roomId });
      if(deleted) return nav.push("/")
    } catch (error) {
      console.log("Error Deleteing Document", error);
    }
  };
  return (
    <Button
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        handleDelete(e, { roomId: roomIdProp });
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="red" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
    </Button>
  );
};

export default DeleteButton;
