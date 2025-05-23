import React, { useState} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";import Pagination from "./Pagination"; // Adjust the path as needed
import { AddNewPlan, checkPlanActive, checkPlanExists,  updatePlanDetails } from "../../firebase/actions/general.action";
import moment from "moment";
import Switch from "../form/switch/Switch";
import Button from "../ui/button/Button";
import {LoaderIcon, Wrench } from "lucide-react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Select from "../form/Select";
import { toast } from "sonner";


interface Packs{
  id:string;
  name:string;
  packs:string;
  amount:string;
  offer:string;
  desc:string;
  flag:boolean
  createdAt:string;
  updatedAt:string
}

interface Props {
 fdata: Packs[];
  total: string;
  refetch: () => void;
  loading: boolean;
}

export default function TablePacks({ fdata, total, refetch, loading }: Props) {
  const [packid,setPackid]=useState("");
  const [name, setName] = useState(""); // Name of the pack
  const [packs, setPacks] = useState(0); // Number of packs
  const [perInterview, setPerInterview] = useState(0); // Per interview cost/credit
  const [price, setPrice] = useState(0); // Total price
  const [offer, setOffer] = useState(""); // Offer text (e.g., "20% off")
  const [description, setDescription] = useState(""); // Pack description
  const [flag, setFlag] = useState(false); // Boolean or string flag (e.g., "Popular" or true)

    const [isOpen,setIsOpen] = React.useState(false);
    const [isAddOpen,setIsAddOpen] = React.useState(false);
     const setFilterPrice = (pr: string) => {
      setPrice(Number(pr))
      if((Number(pr) / Number(packs))){
        setPerInterview((Number(pr) / Number(packs)))
      }
      
     }
  const onFilterChange = (val: string) => {
      if(val=="Silver"){
        setPacks(1)
      
      }else if(val=="Gold"){
        setPacks(5)
      }else{
        setPacks(10)
      }
      setName(val)
    }

    const options = [
  { value: "Silver", label: "Silver" },
  { value: "Gold", label: "Gold" },
  { value: "Platinum", label: "Platinum" },
];
  const offeroptions = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
  { value: "10", label: "10%" },
  { value: "15", label: "15%" },
  { value: "20", label: "20%" },
  { value: "25", label: "25%" },
  { value: "30", label: "30%" },
  { value: "35", label: "35%" },
  { value: "40", label: "40%" },
  { value: "45", label: "45%" },
  { value: "50", label: "50%" },
  { value: "55", label: "55%" },
  { value: "60", label: "60%" },
  { value: "65", label: "65%" },
  { value: "70", label: "70%" },
  { value: "75", label: "75%" }
];


  const openAddModal= () => {
    setName("Silver");
    setPacks(1);
    setPerInterview(1000);
    setPrice(1000);
    setOffer("0");
    setDescription("");
    setFlag(false);
    setPackid("")
    setIsAddOpen(true);
    setPerr(false)
  }
   const handleAddPlan=async()=>{
       setPerr(false)
         if (price==0) {
          setPerr(true)
        toast.error("Plan price cannot be zero/empty.",{
          duration:2000,
          style:{background:"#ff3f3f",
           
          }
        });
        return;
      }
        setIsUpdating(true);
      try {
         toast("Adding New Plan, Please wait...", {
                style: {
        },
         duration:1000,
          icon:<LoaderIcon />,
          id: "feedback-toast"
        });
        const foundplan=await checkPlanExists({
        name,
          flag
        })
       
        if(foundplan.success==false)
        {

       const result = await AddNewPlan({
        name,
        packs: packs.toString(),
        perInterview: perInterview.toString(),
        price: price.toString(),
        offer,
        description,
        flag,
      });
    
        if (result.success) {
          toast.success("Plan added successfully!",{
            style:{background:"#309f60",color:"white"}
          });
            closeAddModal();
             refetch();
        } else {
          toast.error("Failed to add plan.");
        }
     
        }else{
          if(flag){
 toast.error("Already existing "+name+" plan available with status Active",{
          duration:2000,
          style:{background:"#ff3f3f",
          }
        });
          }else{
             toast.error("Already existing "+name+" plan available with status Inactive",{
          duration:2000,
          style:{background:"#ff3f3f",
          }
        });
          }
          
        }
      } catch (error) {
        console.error("Failed to add new plan information:", error);
        toast.error("Failed to add new plan information.");
      } finally {
        setIsUpdating(false);
      }


  }
  const openModal = (
  v1: string,         // name
  v2: string | number, // packs (depending on how you store it)
  v3: number,         // perInterview
  v4: number,         // price
  v5: string,         // offer
  v6: string,         // description
  v7: boolean,        // flag
  v8: string          // packid
) => {
  setName(v1);
  setPacks(typeof v2 === 'string' ? parseInt(v2, 10) : v2);
  setPerInterview(v3);
  setPrice(v4);
  setOffer(v5);
  setDescription(v6);
  setFlag(v7);
  setPackid(v8);
  setIsOpen(true);
  setPerr(false);
};

  const closeModal= () => {
    setIsOpen(false);
   }
   const closeAddModal= () => {
    setIsAddOpen(false);
   }
  const [currentPage, setCurrentPage] = useState(1);
 
  const pageSize = 10;
  const totalPages = Math.ceil(fdata.length / pageSize);

  const fdataWithPage = fdata.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
 
  
//  const handleSwitchChange = (checked: boolean) => {
//     console.log("Switch is now:", checked ? "ON" : "OFF");
//   };
const [isUpdating, setIsUpdating] = useState(false);
  const [perr,setPerr]=useState(false);
  const handleUpdate=async()=>{
       setPerr(false)
         if (price==0) {
          setPerr(true)
        toast.error("Plan price cannot be zero/empty.",{
          duration:2000,
          style:{background:"#ff3f3f",
           
          }
        });
        return;
      }
        setIsUpdating(true);
      try {
         toast("Updating plan details, please wait...", {
                style: {
        },
         duration:1000,
          icon:<LoaderIcon />,
          id: "feedback-toast"
        });
        const foundplan=await checkPlanActive({
          packid,
          name,
          flag
        })
       
        if(foundplan.success==false)
        {

       const result = await updatePlanDetails({
        packid,
        name,
        packs: packs.toString(),
        perInterview: perInterview.toString(),
        price: price.toString(),
        offer,
        description,
        flag,
      });
    
        if (result.success) {
          toast.success("Plan details updated successfully!",{
            style:{background:"#309f60",color:"white"}
          });
            closeModal();
             refetch();
        } else {
          toast.error("Failed to update information.");
        }
     
        }else{
          if(flag){
 toast.error("Already existing "+name+" plan available with status Active",{
          duration:2000,
          style:{background:"#ff3f3f",
          }
        });
          }else{
             toast.error("Already existing "+name+" plan available with status Inactive",{
          duration:2000,
          style:{background:"#ff3f3f",
          }
        });
          }
          
        }
      } catch (error) {
        console.error("Failed to update information:", error);
        toast.error("Failed to update information.");
      } finally {
        setIsUpdating(false);
      }


  }
  return (<div>
    <div className="flex flex-row-reverse">
      <button type="button" onClick={openAddModal} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
        Add New Plan</button>
    </div>
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Packs
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Per Interview
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Price
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Offer
                </TableCell>                
                
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Description
                </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                Date & Time
                </TableCell>
                   <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Flag
                </TableCell>
                   <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Actions
                </TableCell>
              
               
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                  Loading data...
                </div>
              </TableCell>
            </TableRow>
          ) :fdataWithPage.length == 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                <div className="text-theme-sm text-gray-500 dark:text-gray-400">

                No data found
                </div>
              </TableCell>
            </TableRow>
          ) : fdataWithPage.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="px-5 py-4 ">
                  <div className="font-medium text-base text-gray-800 dark:text-white/90">
                          {data.name}
                        </div>
                  </TableCell>
                   <TableCell className="px-5 py-4 ">
                  <div className="text-gray-500  dark:text-white/90">
                          {data.packs}
                        </div>
                  </TableCell>
                   <TableCell className="px-5 py-4 ">
                  <div className="text-gray-500  dark:text-white/90">
                          {(Number(data.amount) / Number(data.packs)).toString()}/Interview
                        </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 ">
                  <div className="text-gray-500  dark:text-white/90">
                          ₹ {data.amount}
                        </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 ">
                  <div className="text-gray-500  dark:text-white/90">
                          {data.offer}%
                        </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 ">
                 <div title={data.desc} className="text-gray-500 max-w-[100px] truncate">
                    {data.desc}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 ">
                 <div className="">
                   <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                    Created:
                    </p>
                    <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                    {moment(data.createdAt).format("DD/MM/YYYY hh:mm A")}
                    </p>
                    <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                     Updated:
                    </p>
                    <p className="text-theme-sm text-green-900 dark:text-gray-400">
                    {moment(data.updatedAt).format("DD/MM/YYYY hh:mm A")}
                    </p>
                    </div>
                  </TableCell>
                    <TableCell className="px-5 py-4 ">
                        <div className={`${data.flag? "text-green-500":"text-red-500"}`}>
                         {data.flag?"Active":"Inactive"}
                        </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 ">
                        <button onClick={()=>{
                          openModal(data.name,data.packs,
                            (Number(data.amount) / Number(data.packs)),
                          Number(data.amount),data.offer,data.desc,data.flag,data.id
                        )
                        }} className="w-fit cursor-pointer  hover:bg-gray-200 rounded-2xl">
                         <Wrench color="#f6a236" />
                         </button> 
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
{/* modal */}
     <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
             Update Plan
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            
            </p>
          </div>
          <form className="flex flex-col"
          onSubmit={(e) => {
              e.preventDefault(); // prevent page reload
              handleUpdate();     // call your update logic
            }}>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div>
                 <Label>Pack Name</Label>
                  <div className="relative w-full">
                              <Select
                                options={options}
                                placeholder=""
                                  onChange={(selectedOption) => onFilterChange(selectedOption)}
                                defaultValue={name}
                                className="pr-12" // space for icon
                              />
                              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              <svg
                                className="stroke-current fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 7L10 12L15 7"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            </div>
                  </div>
                <div>
                  <Label>No. of packs</Label>
                  <input
                      type="text"
                     value={`${packs} pack${packs == 1 ? '' : 's'}`} 
                      className={'h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}
                    disabled
                    />
                </div>

                <div>
                  <Label>Price (₹)</Label>
                  <input
                      type="number"
                      value={price}
                      onChange={(e) => {
                        setFilterPrice(e.target.value)
                      }}  
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10  dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ${perr ?"border-red-400":"dark:border-gray-700"}`}
                    
                    />
                </div>

                <div>
                  <Label>Per interview</Label>
                   <input
                      type="text"
                     value={`${perInterview}/interview${perInterview == 1 ? '' : 's'}`} 
                      className={'h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}
                    disabled
                    />
                </div>

                <div>
                  <Label>Offer</Label>
                      <div className="relative w-full">
                              <Select
                                options={offeroptions}
                                placeholder=""
                                  onChange={(selectedOption) => setOffer(selectedOption)}
                                defaultValue={offer}
                                className="pr-12" // space for icon
                              />
                              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              <svg
                                className="stroke-current fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 7L10 12L15 7"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            </div>
                  </div>
                  <div>
                    <Label>Flag</Label>
                    <div className="flex w-full flex-row justify-center p-2 gap-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Inactive</p>
                      <Switch
                          label=""
                          defaultChecked={flag}
                          onChange={setFlag}
                          color={flag?"green":"green"}
                        />
                        <p className={`text-sm font-medium ${flag? "text-green-700 dark:text-green-400":"text-gray-700 dark:text-gray-400"}`}>Active</p>
                        </div>
                     </div>
                 
                   
              </div>
{/*  */}
               <div className="my-3">
                  <Label>Details</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  style={{
                    scrollbarWidth: 'thin', // Firefox only
                    scrollbarColor: '#6366f1 transparent' // Firefox only
                  }}
                  className="w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-none overflow-y-scroll"
                />
                  
             
                </div> 

              {/*  */}
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ad new plan */}
       <Modal isOpen={isAddOpen} onClose={closeAddModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
             New Plan
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            
            </p>
          </div>
          <form className="flex flex-col"
          onSubmit={(e) => {
              e.preventDefault(); // prevent page reload
              handleAddPlan();     // call your update logic
            }}>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                <div>
                 <Label>Pack Name</Label>
                  <div className="relative w-full">
                              <Select
                                options={options}
                                placeholder=""
                                  onChange={(selectedOption) => onFilterChange(selectedOption)}
                                defaultValue={name}
                                className="pr-12" // space for icon
                              />
                              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              <svg
                                className="stroke-current fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 7L10 12L15 7"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            </div>
                  </div>
                <div>
                  <Label>No. of packs</Label>
                  <input
                      type="text"
                     value={`${packs} pack${packs == 1 ? '' : 's'}`} 
                      className={'h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}
                    disabled
                    />
                </div>

                <div>
                  <Label>Price (₹)</Label>
                  <input
                      type="number"
                      value={price}
                      onChange={(e) => {
                        setFilterPrice(e.target.value)
                      }}  
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10  dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ${perr ?"border-red-400":"dark:border-gray-700"}`}
                    
                    />
                </div>

                <div>
                  <Label>Per interview</Label>
                   <input
                      type="text"
                     value={`${perInterview}/interview${perInterview == 1 ? '' : 's'}`} 
                      className={'h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}
                    disabled
                    />
                </div>

                <div>
                  <Label>Offer</Label>
                      <div className="relative w-full">
                              <Select
                                options={offeroptions}
                                placeholder=""
                                  onChange={(selectedOption) => setOffer(selectedOption)}
                                defaultValue={offer}
                                className="pr-12" // space for icon
                              />
                              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              <svg
                                className="stroke-current fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 7L10 12L15 7"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            </div>
                  </div>
                  <div>
                    <Label>Flag</Label>
                    <div className="flex w-full flex-row justify-center p-2 gap-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Inactive</p>
                      <Switch
                          label=""
                          defaultChecked={flag}
                          onChange={setFlag}
                          color={flag?"green":"green"}
                        />
                        <p className={`text-sm font-medium ${flag? "text-green-700 dark:text-green-400":"text-gray-700 dark:text-gray-400"}`}>Active</p>
                        </div>
                     </div>
                 
                   
              </div>
{/*  */}
               <div className="my-3">
                  <Label>Details</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  style={{
                    scrollbarWidth: 'thin', // Firefox only
                    scrollbarColor: '#6366f1 transparent' // Firefox only
                  }}
                  className="w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-none overflow-y-scroll"
                />
                  
             
                </div> 

              {/*  */}
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeAddModal}>
                Close
              </Button>
              <Button size="sm" disabled={isUpdating}>
                {isUpdating ? "Saving Plan..." : "Save Plan"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>



      {/* Pagination Footer */}
      <div className="px-5 py-4 border-t border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
    </div>
  );
}
