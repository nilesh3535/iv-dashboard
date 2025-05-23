import React, { useState,useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Pagination from "./Pagination"; // Adjust the path as needed
import moment from "moment";
interface UserData{
    id?: string;
  name: string;
  email: string;
  photoURL: string;
  authProvider: string;
  createdAt: string;
}
interface OrderProps {
  id?: string;
   paymentid: string;//
  orderid:string;
 type?: string; // match OrdersProps
  amount: string;//900 
  packs: string;//5
  paymentType:string;
  oldBalance:string;
  remaining:string;
  userId:string; //userid
  
 paymentDate?: string; // allow undefined
user?: UserData; // make optional to match OrdersProps
 packType:string
  
}

interface Props {
  fdata: OrderProps[];
  searchStr: string;
  total: string;
}

export default function TableOrders({ searchStr,fdata,total }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
 
  const pageSize = 10;
  const totalPages = Math.ceil(fdata.length / pageSize);

  const fdataWithPage = fdata.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const [loading, setLoading] = useState(true);
    useEffect(() => {
     setTimeout(()=>{

     setLoading(false)
      },2000)
    },[fdata])
  

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Orders {total}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                Candidate details
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Date & time
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Payment Type
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Pack
                </TableCell>
                   <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Credited
                </TableCell>
                 <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Amount 
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

                {fdataWithPage.length == 0 && searchStr=="" ? "No data found" :"No data found for " + searchStr}
                </div>
              </TableCell>
            </TableRow>
          ) : fdataWithPage.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                   
                      <div>
                        <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                          {data.orderid}
                        </div>
                   
                        <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                          {data.paymentid}
                        </div>
                        
                      </div>
                    </div>
                  </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                   
                      <div>
                        <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                          {data.user?.name}
                        </div>
                   
                        <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                         {data.user?.email}
                        </div>
                        
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400 capitalize">
                  
                    <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                     
                      {moment(data.paymentDate).format("DD/MM/YYYY")}
                    
                    </div>
                    <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                     
                      {moment(data.paymentDate).format("hh:mm A")}
                    </div>
                  </TableCell>
                    <TableCell className="px-5 py-4">
                   
                   <div className="flex items-center gap-2">
                     
                      <p className="text-blue-600 font-semibold text-xs "> {data.paymentType.toUpperCase()}</p>
                    </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400 capitalize">
                  
                  <div className="">
                   <div className=" ">
                        
                      
                        <p className="text-green-700 text-[15px] bg-gray-50 w-fit">
                            ₹{Number(data.amount) / Number(data.packs)}/interview
                        </p>
                        </div>  
                          <div className="mt-2">
                                            <p className={`text-[15px] w-fit  text-[#000000] font-semibold px-3 py-0.5 rounded`}
                                            style={{
                                          background: data.packType === "Gold"
                                            ? "linear-gradient(to bottom, #efc744, #fffbc5, #efc744)":
                                            data.packType === "Silver"?"linear-gradient(to bottom, #7f7e7a, #e3e1e2, #7f7e7a)"
                                            : "linear-gradient(to bottom, #cda58d, #ffe8dc, #cda58d)"
                                        }}>
                                                {data.packType}
                                                </p>
                                            </div>                   
                    </div>
                    </TableCell>
                     <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400 capitalize">
                  
                   <div className="flex items-center gap-2">
                     
                     <div className="">
                        <p className={`font-semibold text-lg text-green-500`}>
                        {data.packs}
                        </p>
                    </div>
                    </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400 capitalize">
                  
                  <div className="">
                       
                          <div className="mt-2">
                      
                        <Badge variant="solid" color="success" size="sm">
                            <p className="text-[15px]">{"₹"+data.amount }</p>
                        </Badge>
                        </div>                
                    </div>
                    </TableCell>
                    
                 
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-4 border-t border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
