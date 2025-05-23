'use client';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getTransactionsByUserId } from '@/lib/actions/general.action';
import ComponentTransactionCard from '@/components/common/ComponentTransactionCard';
import PageTransactionCrumb from '@/components/common/PageTransactionCrumb';
import TableTransactions from '@/components/tables/TableTransactions';
interface TransactionProps{
    id: string; // ✅ Required field
  paymentid: string;//
  orderid:string;
  type:string;
  amount: string;//900 
  packs: string;//5
  paymentType:string;
  packType:string;
  oldBalance:string;
  remaining:string;
  userId:string; //userid
   createdAt: string;
}
export default function Transaction() {
 const params = useParams();
    const searchParams = useSearchParams();
 const [uname,setUName] = useState('');
 
     const [data, setData] = useState<TransactionProps[]>([]);
       const [searchTerm, setSearchTerm] = useState("");
       const [filterValue, setFilterValue] = useState("");
     useEffect(() => {
        const fetchUserAndInterview = async () => {
          const userId = params?.id;
           const userName = searchParams.get("name");
         if (userId) {
            console.log("User ID:", userId);
            console.log("User Name:", userName);
            setUName(userName as string);
            const alldata=await getTransactionsByUserId(userId as string);
           console.log("Data:", alldata);
          const convertedData = alldata.map((item) => ({
            ...item,
            oldBalance: String(item.oldBalance),
            remaining: String(item.remaining),
            amount: String(item.amount),
            packs: String(item.packs),
          }));

      setData(convertedData);
         }
        }
         fetchUserAndInterview();
      }, [params?.id, searchParams]);


    const filteredData = data.filter((each) => {
    const lowerSearch = searchTerm.toLowerCase();  
     const matchSearch =
      each.orderid.toLowerCase().includes(lowerSearch) ||
      each.paymentType.toLowerCase().includes(lowerSearch) ||
      each.packType.toLowerCase().includes(lowerSearch) ||
      each.amount.includes(lowerSearch) ||
      (each.amount).includes(lowerSearch) ||
      (each.packs+"pack").includes(lowerSearch) ||
      (each.packs+" pack").includes(lowerSearch) ||
      (each.remaining).toString().includes(lowerSearch) ||
      (Number(each.amount) / Number(each.packs)).toString().includes(lowerSearch) ||
      moment(each.createdAt).format("DD/MM/YYYY hh:mm A").toLowerCase().includes(lowerSearch);
    const matchFilter = filterValue ? each.paymentType === filterValue : true;
  
      return matchSearch && matchFilter;
  });
  return (
    <div>
       <PageTransactionCrumb pageTitle="Transactions" candidateName={uname}  />
   <div className="space-y-6">
    <ComponentTransactionCard
      title={"All Transactions ("+data.length+")"}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterValue={filterValue}
      onFilterChange={setFilterValue}
      showDropdown={true}
      srcTxt={"Search transaction here..."}
      alldata={data}
    >
      <TableTransactions searchStr={searchTerm} fdata={filteredData} total={"("+filteredData.length+")"} />
    </ComponentTransactionCard>
    </div>
    </div>
  )
}
