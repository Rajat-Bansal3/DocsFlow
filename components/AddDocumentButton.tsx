"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import add from "@/public/assets/icons/add.svg";
import Image from "next/image";
import { createDocument } from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

type Props = {};

const AddDocumentButton = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const room = await createDocument({ userId, email });

      if (room) {
        setLoading(false);
        router.push(`documents/${room.id}`);
      }
    } catch (error) {
      console.log("Error creating document", error);
      setLoading(false);
    }
  };
  if(loading) return <><Loader/></>
  return (
    <div>
      <Button
        onClick={handleClick}
        type='submit'
        className='gradient-blue flex gap-1 shadow-md '
      >
        <Image src={add} alt='add' width={24} height={24} />
        <p className='hidden sm:block'>Start a Blank Document</p>
      </Button>
    </div>
  );
};

export default AddDocumentButton;
