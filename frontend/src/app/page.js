import React from "react";
import  {UserRegistration}  from "./register/UserRegistration";
import "./globals.css"; 

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
     <UserRegistration />
    </div>
  );
}
