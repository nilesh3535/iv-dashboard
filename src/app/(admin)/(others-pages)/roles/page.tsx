'use client';
import { useEffect, useState } from 'react';

import { getAllRoles } from '@/firebase/actions/general.action';


import PagePackBreadcrumb from '@/components/common/PagePackBreadCrumb';
import TableRoles from '@/components/tables/TableRoles';

interface Role {
  id:string;
  role:string;
  createdAt:string;
  flag: boolean;
}

export default function RolesPage() {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    setLoading(true);
    const allRoles = await getAllRoles();
    if (allRoles) {
      setData(allRoles);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div>
      <PagePackBreadcrumb pageTitle="Roles" total={`(${data.length})`} />

      <div>
        <TableRoles
          fdata={data}
          total={`(${data.length})`}
          refetch={fetchRoles}
          loading={loading}
        />
      </div>
    </div>
  );
}
