import React,{Suspense}from "react";
import {HomePage} from "./HomePage";

export default function Home() {
  return (
    <Suspense>
    <div className="flex items-center justify-center min-h-screen">
      <HomePage />
    </div>
    </Suspense>
  );
}
