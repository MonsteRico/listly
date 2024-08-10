"use client";

import { ArrowLeft, } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

function BackArrow() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setShow(false);
    }
    else {
      setShow(true);
    }
  }, [pathname]);

  if (!show) return null;

  return (
    <Link className="text-primary hover:cursor-pointer" href="/">
      <ArrowLeft className="h-10 w-10" />
    </Link>
  );
}

export default BackArrow;
