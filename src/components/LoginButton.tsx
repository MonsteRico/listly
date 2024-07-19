"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export function LoginButton() {
  return (
    <Button onClick={() => signIn()}>Login</Button>
  );
}