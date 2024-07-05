import React,{Suspense}from "react";
import { UserLogin } from "./UserLogin";

export default function LoginPage() {
  return (
    <Suspense>
    <div className="flex items-center justify-center min-h-screen">
      <UserLogin />
    </div>
    </Suspense>
  );
}
