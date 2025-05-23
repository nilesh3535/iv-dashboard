"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { updateAdminProfile } from "@/firebase/actions/general.action";
interface Admin {
  name: string;
  companyName:string;
  email: string;
  photo: string;
  phone:string;
  bio:string;
  instagram:string;
  linkedln:string;
  twitter:string;
  facebook:string;

}
export default function UserInfoCard() {
 
  const [user, setUser] = useState<Admin | null>(null);
 const loadEverything = async () => {
         
         const adminRes = await fetch("/api/get-current-admin");
         const { admin } = await adminRes.json();
         setUserId(admin.id)
         setCompanyName(admin.companyName);
        setEmail(admin.email);
        setPhone(admin.phone);
        setBio(admin.bio);
        setInsta(admin.instagram);
        setLinkedln(admin.linkedln);
        setTwitter(admin.twitter);
        setFacebook(admin.facebook);
        setUser(admin)      
       };
   useEffect(() => {
      
     
       loadEverything();
     }, []);
 const [isOpen,setIsOpen] = React.useState(false);
const openModal = () => {
  setIsOpen(true);
  resetForm();
  setEerr(false);
};
  const resetForm = () => {
  setCompanyName(user?.companyName || "");
  setEmail(user?.email || "");
  setPhone(user?.phone || "");
  setBio(user?.bio || "");
  setInsta(user?.instagram || "");
  setLinkedln(user?.linkedln || "");
  setTwitter(user?.twitter || "");
  setFacebook(user?.facebook || "");
};
  const closeModal= () => {
    setIsOpen(false);
  setEerr(false)
  }

   const [eerr,setEerr]=useState(false);
  const handleSave = async() => {
     setEerr(false);
  // RFC 5322 Official Standard Regex (simplified version)
     // Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    // LinkedIn
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/(in|pub|company)\/[a-zA-Z0-9-_/]+\/?$/;

    // Instagram
    const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}\/?$/;

    // Twitter / X
    const twitterRegex = /^https:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}\/?$/;

    // Facebook
    const facebookRegex = /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]{5,}\/?$/;

      if (!email || !emailRegex.test(email)) {
        toast.error("Please enter a valid email address.", {
          duration: 2000,
          style: {
            background: "#ff3f3f",
          },
        });
        setEerr(true);
        return;
      }
      
     
        if (facebook && !facebookRegex.test(facebook)) {
        toast.error("Please enter a valid Facebook profile URL", {
          duration: 2000,
          style: {
            background: "#ff3f3f",
          },
        });
        return;
      }
      if (twitter && !twitterRegex.test(twitter)) {
        toast.error("Please enter a valid Twitter or X.com profile URL", {
                duration: 2000,
                style: {
                  background: "#ff3f3f",
                },
              });
        return;
      }
     if (linkedln && !linkedinRegex.test(linkedln)) {
        toast.error("Please enter a valid LinkedIn profile URL", {
          duration: 2000,
          style: {
            background: "#ff3f3f",
          },
        });
        return;
      }
      if (insta && !instagramRegex.test(insta)) {
        toast.error("Please enter a valid instagram profile URL", {
                duration: 2000,
                style: {
                  background: "#ff3f3f",
                },
              });
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
         const result = await updateAdminProfile({
            userId: userid,
            companyName,
            email,
            phone,
            bio,
            linkedln,
            facebook,
            twitter,
            insta
         });
         
         if (result.success) {
          loadEverything();
           toast.success("Information updated successfully!",{
                  style:{background:"#309f60",color:"white"}
                });
           closeModal();
         } else {
           toast.error("Failed to update Information..");
         }
       } catch (error) {
         console.error("Failed to update Information:", error);
         toast.error("Failed to update Information..");
       }
 
  };
   const [userid, setUserId] = React.useState("");
   const [companyName, setCompanyName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [bio, setBio] = React.useState("");

     const [insta, setInsta] = React.useState("");
  const [linkedln, setLinkedln] = React.useState("");
  const [twitter, setTwitter] = React.useState("");
  const [facebook, setFacebook] = React.useState("");
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Business Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Company
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {companyName || "-"}
              </p>
            </div>

           

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {phone||"-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {bio ||"-"}
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

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Hey, Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col"
          onSubmit={(e) => {
              e.preventDefault(); // prevent page reload
              handleSave();     // call your update logic
            }}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
             
              <div className="">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Business Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Company</Label>
                    <Input type="text" placeholder="Company" defaultValue={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}/>
                  </div>


                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                     <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                      }}  
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10  dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ${eerr ?"border-red-400":"dark:border-gray-700"}`}
                    
                    />
                  
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="text" placeholder="Phone" defaultValue={phone} 
                    onChange={(e) => setPhone(e.target.value)} />
                  </div>

                 <div className="col-span-2 lg:col-span-1">
                    <Label>Bio</Label>
                    <Input type="text" placeholder="Bio" defaultValue={bio} 
                    onChange={(e) => setBio(e.target.value)}/>
                  </div>
                </div>
              </div>
               <div className="mt-7">
                <h5 className="text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                     defaultValue={facebook} 
                     placeholder="paste facebook link"
                    onChange={(e) => setFacebook(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Twitter/X.com</Label>
                    <Input type="text" defaultValue={twitter} 
                     placeholder="paste Twitter/X link"
                    onChange={(e) => setTwitter(e.target.value)} />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                     defaultValue={linkedln} 
                      placeholder="paste Linkedin link"
                    onChange={(e) => setLinkedln(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input
                      type="text"
                     defaultValue={insta} 
                      placeholder="paste Instagram link"
                    onChange={(e) => setInsta(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
