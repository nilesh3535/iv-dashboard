"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { adminLogout } from "@/firebase/actions/general.action";
interface Admin {
  name: string;
  email: string;
  photo: string;
}
export default function SidebarWidget() {
     const router = useRouter();
     const [user, setUser] = useState<Admin | null>(null);

      useEffect(() => {
          const loadEverything = async () => {
            
            const adminRes = await fetch("/api/get-current-admin");
            const { admin } = await adminRes.json();
            setUser(admin)      
          };
        
          loadEverything();
        }, [router]);

  function handleLogout() {
      toast("Signing out of your account, please wait...", {
               style: {background:"#ec614b"},
               duration: 2000,
               position:"bottom-center",
               icon: <LoaderIcon />,
               id: "feedback-toast",
             });
     
             setTimeout(async() => {
               // Remove items from cookie
               await adminLogout();
               console.log("Logged out successfully");
     
               // Redirect to home page
               toast.success("You have successfully signed out!", {
                 style: { background: "#309f60", color: "white" },
               });
     
               router.push("/signin");
             }, 3000);
   }
  
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
       
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
      {user?.email}
       </p>
   
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        Sign Out
      </button>
    </div>
  );
}
