"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie, { LottieComponentProps } from "lottie-react";
export default function AuthRedirectWrapper({
   children,
    admin,
  }: {
    children: React.ReactNode;
    admin: object | null;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
 const [animationData, setAnimationData] = useState<
    LottieComponentProps["animationData"] | null
  >(null);
 useEffect(() => {
   const loadEverything = async () => {
     // Load animation first
     const res = await fetch("/images/loader.json");
     const json = await res.json();
     setAnimationData(json);
 
     // Wait for 3 seconds before checking authentication
     await new Promise((resolve) => setTimeout(resolve, 1000));
 
     if (!admin) {
     
        setLoading(false);
     } else {
         router.push("/");
      
     }
   };
 
   loadEverything();
 }, [router,admin]);

   if (loading || !animationData) {
    return (
      <div className="fixed inset-0 z-50 bg-[#171950] dark:bg-white/5 text-white">
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0">
          <div className="lg:w-1/2 w-full h-full lg:grid items-center hidden">
            <div className="relative items-center justify-center flex z-1 flex-col gap-4">
              <Lottie
                animationData={animationData}
                loop
                autoplay
                className="w-48 h-48"
              />
            </div>
          </div>
          <div className="lg:hidden flex justify-center items-center w-full h-full bg-[#171950] dark:bg-white/5">
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-48 h-48"
            />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
