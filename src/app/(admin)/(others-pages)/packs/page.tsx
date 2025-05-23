'use client';
import { useEffect, useState } from 'react';

import { getAllPacks, getOrdersWithUserInfo } from '@/firebase/actions/general.action';


import TablePacks from '@/components/tables/TablePacks';
import PagePackBreadcrumb from '@/components/common/PagePackBreadCrumb';

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
export default function PacksPage() {
 
     const [data, setData] = useState<Packs[]>([]);
     const [loading, setLoading] = useState(true);

     const fetchStats = async () => {
          setLoading(true);
          const allpacks = await getAllPacks();
          if (allpacks) {
            setData(allpacks);
          }
          setLoading(false);
        };

        useEffect(() => {
          fetchStats();
        }, []);


    
  return (<div>
  <PagePackBreadcrumb
   pageTitle="Packs Plan" total={"("+data.length+")"}  />

   <div>
  

        <TablePacks fdata={data} total={"("+data.length+")"} refetch={fetchStats} loading={loading}  />

   </div>
  </div>)
}