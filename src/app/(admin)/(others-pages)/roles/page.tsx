'use client';
import { useEffect, useState, useMemo } from 'react';

import { getAllRoles, getAllSkills } from '@/firebase/actions/general.action';
import TableRoles from '@/components/tables/TableRoles';
import CommonTitleSearchCard from '@/components/common/CommonTitleSearchCard';

interface Role {
  id: string;
  role: string;
  createdAt: string;
  flag: boolean;
  skillsetIds?: string[];
  skillsetNames?: string[];
}

interface Skill {
  id: string;
  skill: string;
  createdAt: string;
  flag: boolean;
}

export default function RolesPage() {
  const [data, setData] = useState<Role[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const allRoles = await getAllRoles();
      setData(allRoles ?? []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const allSkills = await getAllSkills();
      setSkills(allSkills ?? []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchSkills();
  }, []);

  const filteredRoles = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((roleItem) =>
      roleItem.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <div>
      <div className="">
        <CommonTitleSearchCard
          title={`Roles (${filteredRoles.length})`}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          srcTxt="Search Role here..."
        >
          <TableRoles
            fdata={filteredRoles}
            total={`(${filteredRoles.length})`}
            refetch={fetchRoles}
            loading={loading}
            skills={skills} // 🔥 Now passing all skills here
          />
        </CommonTitleSearchCard>
      </div>
    </div>
  );
}
