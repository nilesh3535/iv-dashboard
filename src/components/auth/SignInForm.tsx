"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {  EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useEffect, useState } from "react";
import Lottie, { LottieComponentProps } from "lottie-react";
import { toast } from "sonner";
import { signinUser } from "@/firebase/actions/general.action";
import { useRouter } from "next/navigation";
export default function SignInForm() {
 const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
 const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
 const [animationData, setAnimationData] = useState<LottieComponentProps["animationData"] | null>(null);
 
   useEffect(() => {
     const loadAnimation = async () => {
       const res = await fetch("/images/loader.json");
       const json = await res.json();
       setAnimationData(json);
     };
 
     loadAnimation();

},[]) 

if (isLoading || !animationData) {
    return (
      <div className="fixed inset-0 z-50 bg-[#171950] dark:bg-white/5 text-white">
      <div>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0">
          <div className="lg:w-1/2 w-full h-full lg:grid items-center hidden">
            <div className="relative items-center justify-center flex z-1 flex-col gap-4">
              <Lottie animationData={animationData} loop autoplay className="w-48 h-48" />
            </div>
          </div>
          <div className="lg:hidden flex justify-center items-center w-full h-full bg-[#171950] dark:bg-white/5">
            <Lottie animationData={animationData} loop autoplay className="w-48 h-48" />
          </div>
        </div>
      </div>
    </div>
    
    );
  }
 async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
      if(email==""||email.length==0 || password==""||password.length==0){
       toast.error("Please enter login credentials",{
                 position:"bottom-center",
                 duration:2000,
                 style:{background:"#ff3f3f",
                 }
               });
        return;
      }
   setIsLoading(true)
  
    const result = await signinUser({ email, password });
  
      if (result.success) {
         toast.success("Login successful!",{
          duration:2000,
                    style:{background:"#309f60",color:"white"}
                  });
        router.push("/");
        // Redirect or show success message
      } else {
       setIsLoading(false)
         toast.error("Invalid credentials. Please try again.",{
                 position:"bottom-center",
                 duration:2000,
                 style:{background:"#ff3f3f",
                 }
               });
      }
    }
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <p
          className="inline-flex items-center text-2xl text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          
          Admin Panel
        </p>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            
           <form onSubmit={onSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" type="email" name="email"  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  
                </div>
                <div>
                  <Button className="w-full" size="sm" >
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="text-center mt-10 text-sm text-gray-400 dark:text-gray-500">
  &copy; © 2025 Panalink Infotech Limited | All rights reserved.
</div>
          </div>
        </div>
      </div>
    </div>
  );
}
