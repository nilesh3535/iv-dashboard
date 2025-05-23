"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { updateAddress } from "@/firebase/actions/general.action";
interface Admin {
  address: string;
  city:string;
  country: string;
  state: string;
  zip:string;

}
export default function UserAddressCard() {
 const [user, setUser] = useState<Admin | null>(null);
 const loadEverything = async () => {
         
         const adminRes = await fetch("/api/get-current-admin");
         const { admin } = await adminRes.json();
         setUserId(admin.id)
        setAddress(admin.address)
        setCity(admin.city)
        setCountry(admin.country)
        setState(admin.state)
        setZip(admin.zip)
        setUser(admin)      
       };
   useEffect(() => {
      
     
       loadEverything();
     }, []);
   const [userid, setUserId] = React.useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
 const [isOpen,setIsOpen] = React.useState(false);
  const openModal= () => {
    setIsOpen(true);
     setAddress(user?.address || "");
      setCity(user?.city || "");
      setState(user?.state || "");
      setZip(user?.zip || "");
      setCountry(user?.country || "");

  }
  const closeModal= () => {
      setIsOpen(false);
      setAddress(user?.address || "");
      setCity(user?.city || "");
      setState(user?.state || "");
      setZip(user?.zip || "");
      setCountry(user?.country || "");
  }

   const [eerr,setEerr]=useState(false);
  const handleSave = async() => {
     setEerr(false);

      const zipRegex = /^\d{6}$/;

      if (zip && !zipRegex.test(zip)) {
        toast.error("Zip code must be exactly 6 digits", {
          duration: 2000,
          style: {
            background: "#ff3f3f",
          },
        });
        setEerr(true);
        return;
      }
      
     

    toast("Please wait while updating information...", {
                style: {
        },
         duration:1000,
          icon:<LoaderIcon />,
          id: "feedback-toast"
        });
   // Update the 
       try {
         const result = await updateAddress({
            userId: userid,
            address:address,
            city:city,
            country:country,
            state:state,
            zip:zip
         });
         
         if (result.success) {
           toast.success("Information updated successfully!",{
                  style:{background:"#309f60",color:"white"}
                });
          loadEverything();
          
           closeModal();
         } else {
           toast.error("Failed to update Information..");
         }
       } catch (error) {
         console.error("Failed to update Information:", error);
         toast.error("Failed to update Information..");
       }
 
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Address
                </p>
            <p className="text-sm font-medium mb-5 text-gray-800 dark:text-white/90">
                 {user?.address || "-"}
                </p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                 {user?.country || "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  City
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.city || "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                 State
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.state|| "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  ZIP Code
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.zip|| "-"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form 
           onSubmit={(e) => {
              e.preventDefault(); // prevent page reload
              handleSave();     // call your update logic
            }}
            className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar ">
            <div>
                  <Label>Address</Label>
                  <Input type="text" defaultValue={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="address"
                  
                  />
                </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-5">
                <div>
                  <Label>Country</Label>
                  <Input type="text" defaultValue={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="country"
                  
                  />
                </div>

                <div>
                  <Label>City</Label>
                  <Input type="text" defaultValue={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="city"

                  />
                </div>

                <div>
                  <Label>State</Label>
                  <Input type="text" defaultValue={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="state"
                   />
                </div>

                <div>
                  <Label>ZIP Code</Label>
                  <input
                      type="text"
                      placeholder="Zip code"
                      value={zip}
                      onChange={(e) => {
                        setZip(e.target.value)
                      }}  
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10  dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ${eerr ?"border-red-400":"dark:border-gray-700"}`}
                    
                    />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-8 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
