import React, { useState,useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FaGoogle, FaFacebook, FaEnvelope } from "react-icons/fa";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import Pagination from "./Pagination"; // Adjust the path as needed
import { getFeedbackByUserId, getInterviewsById } from "../../firebase/actions/general.action";
import Link from "next/link";

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
interface UserWithStats extends User {
  interviewCount: number;
  openingCount: number;
  practiceCount: number;
}
interface Props {
  users: User[];
  searchStr: string;
  total: string;
}

export default function TableCandidates({ searchStr,users,total }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersWithStats, setUsersWithStats] = useState<UserWithStats[]>([]);
  const pageSize = 10;
  const totalPages = Math.ceil(users.length / pageSize);

  const paginatedUsersWithStats = usersWithStats.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchStats() {
      setLoading(true); // start loading
      const updated = await Promise.all(
        users.map(async (user) => {
          try {
            const interviews = await getInterviewsById(user.id);//created
            const feedbackdata=await getFeedbackByUserId(user.id);//attempt
            const safeInterviews = interviews ?? [];
            const safeFeedback = feedbackdata ?? [];
        
            const practiceCount = 0;
            return {
              ...user,
              interviewCount: safeInterviews.length,
              openingCount:safeFeedback.length,
              practiceCount,
            };
          } catch (error) {
            console.error(`Error fetching interviews for ${user.id}`, error);
            return {
              ...user,
              interviewCount: 0,
              openingCount: 0,
              practiceCount: 0,
            };
          }
        })
      );
      setUsersWithStats(updated);
      setLoading(false); // end loading
    }
  
    fetchStats();
  }, [users]);
  
  

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Candidate {total}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Created At
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Interview Stats
                </TableCell>
                 <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Purchases
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                  Loading candidates...
                </div>
              </TableCell>
            </TableRow>
          ) :paginatedUsersWithStats.length == 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                {paginatedUsersWithStats.length == 0 && searchStr=="" ? "No data found" :"No data found for " + searchStr}
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedUsersWithStats.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          src={
                            user?.photoURL?.startsWith("http")
                              ? user.photoURL
                              : "/avatars/user-avatar.jpg"
                          }
                          alt={user.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                          {user.name}
                        </div>
                   
                        <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400 capitalize">
                    <div className="flex items-center gap-2">
                      {user.authProvider === "google" && <FaGoogle className="text-[#4285F4]" />}
                      {user.authProvider === "facebook" && <FaFacebook className="text-[#1877F2]" />}
                      {user.authProvider === "email" && <FaEnvelope className="text-[#ca4c1e]" />}
                      <span>{user.authProvider}</span>
                    </div>
                    <div className="py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleString()}
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex flex-row gap-2">
                      <Link href={`/candidates/${user.id}?name=${encodeURIComponent(user.name)}&tab=Created`} className="mt-2 font-medium text-theme-sm text-gray-800 dark:text-white/90">
                      <Badge variant="solid" color="primary" size="md">
                      Created : {user.interviewCount} 
                    </Badge>  
                      </Link>
                      <Link href={`/candidates/${user.id}?name=${encodeURIComponent(user.name)}&tab=Attempt`} className="mt-2 font-medium text-theme-sm text-gray-800 dark:text-white/90">
                      <Badge variant="solid" color="success" size="md">
                      Attempt : {user.openingCount}
                    </Badge>
                      </Link>
                    </div>
                  </TableCell>
                   <TableCell className="px-5 py-4 text-start">
                    <Link href={`/transactions/${user.id}?name=${encodeURIComponent(user.name)}`} className="mt-2 font-medium text-theme-sm text-gray-800 dark:text-white/90">
                      <Badge variant="solid" color="info" size="md">
                      Transactions
                    </Badge>
                      </Link>
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
