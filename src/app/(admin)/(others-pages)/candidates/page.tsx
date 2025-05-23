"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableCandidates from "@/components/tables/TableCandidates";
import { getAllUsers } from "@/firebase/actions/general.action";

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string; // ✅ Marked as optional
  emailVerified?: boolean;
  packs?: string;
  authProvider: string;
  createdAt: string;
}

export default function BasicTables() {

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  useEffect(() => {
  const fetchUsers = async () => {
    const allUsers = await getAllUsers();
    console.log(allUsers);

    if (allUsers) {
      setUsers(allUsers);
    } else {
      setUsers([]); // fallback to empty array to satisfy the type
    }
  };

  fetchUsers();
}, []);

  const filteredUsers = users.filter((user) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchSearch =
      user.name.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch) ||
      user.authProvider.toLowerCase().includes(lowerSearch) ||
      new Date(user.createdAt).toLocaleString().toLowerCase().includes(lowerSearch);
  
    const matchFilter = filterValue ? user.authProvider === filterValue : true;
  
    return matchSearch && matchFilter;
  });

  return (
    <div>
    <PageBreadcrumb pageTitle="List" />
    <div className="space-y-6">
    <ComponentCard
      title={"All Candidates ("+users.length+")"}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterValue={filterValue}
      onFilterChange={setFilterValue}
      showDropdown={true}
      srcTxt={"Search candidates here..."}
    >
      <TableCandidates searchStr={searchTerm} users={filteredUsers} total={"("+filteredUsers.length+")"} />
    </ComponentCard>
    </div>
  </div>
  );
}
