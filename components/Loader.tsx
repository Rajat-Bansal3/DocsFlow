import Image from "next/image";
import React from "react";
import loader from "../public/assets/icons/loader.svg";

type Props = {};

const Loader = (props: Props) => {
  return (
    <div className='loader'>
      <Image
        src={loader}
        height={32}
        width={32}
        className='animate-spin'
        alt='loader'
      />
      Loading...
    </div>
  );
};

export default Loader;
