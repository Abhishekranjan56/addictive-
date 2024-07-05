import React,{Suspense}from "react";
import {MainPage} from "./MainPage";

export default function Home() {
  return (
    <Suspense>
    <div className="flex items-center justify-center min-h-screen">
      <MainPage />
    </div>
    </Suspense>
  );
}
