'use client';
import { useEffect, useState, useMemo } from 'react'; // Import useMemo

import { getAllSkills } from '@/firebase/actions/general.action'; // Your Firebase action

import TableSkills from '@/components/tables/TableSkills';
import CommonTitleSearchCard from '@/components/common/CommonTitleSearchCard'; // Import your new component

interface Skills {
  id: string;
  skill: string;
  createdAt: string;
  flag: boolean;
}

export default function SkillsPage() {
  const [data, setData] = useState<Skills[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const allSkills = await getAllSkills();
      if (allSkills) {
        setData(allSkills);
      } else {
        setData([]); // Ensure data is an empty array if no skills are returned
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      // Optionally set an error state here to display to the user
      setData([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Filter the data based on the search term
  const filteredSkills = useMemo(() => {
    if (!searchTerm) {
      return data;
    }
    return data.filter((skillItem) =>
      skillItem.skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <div>
      {/* You can either keep PagePackBreadcrumb or rely on CommonTitleSearchCard's title */}
    

      <div className=""> {/* Added some top margin for spacing */}
        <CommonTitleSearchCard
          title={`Skills (${filteredSkills.length})`} // Display count of filtered skills
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          srcTxt="Search Skill here..."
        >
          {/* TableSkills will now receive the filtered data */}
          <TableSkills
            fdata={filteredSkills} // Pass the filtered data
            total={`(${filteredSkills.length})`} // Update total to reflect filtered count
            refetch={fetchSkills}
            loading={loading} // Pass loading directly from the page state
          />
        </CommonTitleSearchCard>
      </div>
    </div>
  );
}