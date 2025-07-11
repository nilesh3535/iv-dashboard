'use client';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import ComponentTransactionCard from '@/components/common/ComponentTransactionCard';

import { getOrdersWithUserInfo } from '@/firebase/actions/general.action';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableOrders from '@/components/tables/TableOrders';
interface OrdersProps {
  id?: string;
  paymentid: string;
  orderid: string;
  type: string; // required
  amount: string;
  packs: string;
  paymentType: string;
  packType: string;
  oldBalance: string;
  remaining: string;
  userId: string;
  paymentDate?: string;
  user?: UserData;
}
interface UserData{
     id: string;
  name: string;
  email: string;
  photoURL: string;
  authProvider: string;
  createdAt: string;
}
export default function OrderPage() {
 
     const [data, setData] = useState<OrdersProps[]>([]);
     const [loading, setLoading] = useState(true);
       const [searchTerm, setSearchTerm] = useState("");
       const [filterValue, setFilterValue] = useState("");
console.log(loading)
    useEffect(() => {
       async function fetchStats() {
         setLoading(true); // start loading
         const orders=await getOrdersWithUserInfo();
         console.log("for",orders)
         if(orders){
            setData(orders)
         }
         setLoading(false); // end loading
       }
     
       fetchStats();
     }, []);

   const filteredData = useMemo(() => {
  const lowerSearch = searchTerm.toLowerCase();
  return data.filter((each) => {
    const matchSearch =
      each.orderid.toLowerCase().includes(lowerSearch) ||
      each.paymentType.toLowerCase().includes(lowerSearch) ||
      each.packType.toLowerCase().includes(lowerSearch) ||
      each.user?.name.toLowerCase().includes(lowerSearch) ||
      each.user?.email.toLowerCase().includes(lowerSearch) ||
      each.amount.includes(lowerSearch) ||
      (each.packs + "pack").includes(lowerSearch) ||
      (each.packs + " pack").includes(lowerSearch) ||
      (Number(each.amount) / Number(each.packs)).toString().includes(lowerSearch) ||
      moment(each.paymentDate).format("DD/MM/YYYY hh:mm A").toLowerCase().includes(lowerSearch);

    const matchFilter = filterValue ? each.paymentType === filterValue : true;
    return matchSearch && matchFilter;
  });
}, [data, searchTerm, filterValue]);

const sanitizedData = filteredData.map((item): OrdersProps => ({
  ...item,
  type: item.type ?? "N/A",
  paymentDate: item.paymentDate ?? "", // default to empty string if undefined
}));


    
  return (
    <div>
       <PageBreadcrumb pageTitle="Orders"  />
         <div className="space-y-6">
    <ComponentTransactionCard
      title={"All Orders ("+data.length+")"}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterValue={filterValue} 
      onFilterChange={setFilterValue}
      showDropdown={true}
      srcTxt={"Search order here..."}
      alldata={data}
    >
      <TableOrders searchStr={searchTerm} fdata={sanitizedData} total={"("+filteredData.length+")"} />
    </ComponentTransactionCard>
    </div>
    </div>
  )
}
