import { SignUp } from "@clerk/nextjs";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <main className='auth-page'>
      <SignUp />
    </main>
  );
};

export default page;
