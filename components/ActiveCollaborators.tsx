"use client"

import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";
import React from "react";

type Props = {};

const ActiveCollaborators = async (props: Props) => {
  const other = useOthers();

  const collabs = other.map((per) => per.info);

  return (
    <ul className='collaborators-list'>
      {collabs.map((coll) => {
        return (
          <li key={coll.id}>
            <Image
              src={coll.avatar}
              width={10}
              height={10}
              alt={coll.name}
              className='inline-block size-8 rounded-full ring-2 ring-dark-100'
              style={{ border: `3px solid ${coll.color}` }}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default ActiveCollaborators;
