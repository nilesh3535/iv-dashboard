'use client';
import { useEffect, useState } from 'react';

// Assuming you have a getAllSkills function in your general.action.ts or a separate skills.action.ts
import { getAllSkills } from '@/firebase/actions/general.action';


import PagePackBreadcrumb from '@/components/common/PagePackBreadCrumb';
import TableSkills from '@/components/tables/TableSkills';

interface Skills {
  id: string;
  skill: string;
  createdAt: string;
  flag: boolean;
}

export default function SkillsPage() {
  const [data, setData] = useState<Skills[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    setLoading(true);
    const allSkills = await getAllSkills(); // Call the getAllSkills action
    if (allSkills) {
      setData(allSkills);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div>
      <PagePackBreadcrumb pageTitle="Skills" total={`(${data.length})`} />

      <div>
        <TableSkills
          fdata={data}
          total={`(${data.length})`}
          refetch={fetchSkills}
          loading={loading}
        />
      </div>
    </div>
  );
}