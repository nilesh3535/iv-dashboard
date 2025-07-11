'use client';
import { useEffect, useState, useMemo } from 'react'; // Keep useMemo for search if you want it, otherwise remove it

import { getAllRoles } from '@/firebase/actions/general.action';
import PagePackBreadcrumb from '@/components/common/PagePackBreadCrumb';
import TableRoles from '@/components/tables/TableRoles';
import CommonTitleSearchCard from '@/components/common/CommonTitleSearchCard'; // Still needed for search functionality

interface Role {
  id: string;
  role: string;
  createdAt: string;
  flag: boolean;
}

export default function RolesPage() {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const allRoles = await getAllRoles();
      if (allRoles) {
        setData(allRoles);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter the data based on the search term
  const filteredRoles = useMemo(() => {
    if (!searchTerm) {
      return data;
    }
    return data.filter((roleItem) =>
      roleItem.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <div>
      <PagePackBreadcrumb pageTitle="Roles" total={`(${data.length})`} />

      <div className="mt-6">
        <CommonTitleSearchCard
          title={`All Roles (${filteredRoles.length})`} // Display count of filtered roles
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          srcTxt="Search Role here..."
          // showAddButton is implicitly false if not provided, or you can explicitly set it:
          // showAddButton={false}
          // addBtnText and onAddClick are also not needed here.
        >
          {/* TableRoles will receive the filtered data */}
          <TableRoles
            // No ref needed here as we aren't calling methods from CommonTitleSearchCard
            fdata={filteredRoles} // Pass the filtered data
            total={`(${filteredRoles.length})`} // Update total to reflect filtered count
            refetch={fetchRoles}
            loading={loading} // Pass loading directly from the page state
          />
        </CommonTitleSearchCard>
      </div>
    </div>
  );
}