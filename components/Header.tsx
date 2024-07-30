import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/assets/icons/logo.svg";
import { cn } from "@/lib/utils";

const Header = ({ children , className }: HeaderProps) => {
  return (
    <div className={cn('header' , className)}>
      <Link href={"/"} className='md:flex-1'>
        <Image
          src={logo}
          alt='logo'
          width={128}
          height={32}
          className='hidden md:block'
        />
      </Link>
      {children}
    </div>
  );
};

export default Header;
