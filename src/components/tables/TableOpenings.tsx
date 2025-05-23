import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import moment from 'moment';

import { FaLink } from "react-icons/fa";
import Image from "next/image";
import Pagination from "./Pagination"; // Adjust the path as needed\
interface FirebaseOpenings {
    id: string;
    coverImage: string;
    createdAt: string;
    finalized: boolean;
    level: string;
    questions: Array<string>;
    role: string;
    techstack: Array<string>;
    type: string;
    userId: string;
    candidates:  Array<string>;
  }

interface Props {
  openings: FirebaseOpenings[];
  searchStr: string;
  total: string;
}

export default function TableOpenings({ searchStr,openings,total }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const totalPages = Math.ceil(openings.length / pageSize);

  // const paginatedUsersWithStats = openings.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize
  // );

  const handleCopy = (id: string) => {
    const url = `https://ai-interviewer-pi-three.vercel.app/registerme/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };
  // const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Openings {total}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Type
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                  Skills
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Questions
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Created on
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                Conducted On
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Candidates
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                 Register Link
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {openings.length === 0 && (
              <TableRow colSpan={3}>
                <TableCell  className="text-center py-4">
                  <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                  {searchStr=="" ? " " :"No data found for " + searchStr}
                  </div>
                </TableCell>
              </TableRow>
              )}
           {openings.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          src={
                            data.coverImage
                              ? data.coverImage
                              : "/covers/dropbox.png"
                          }
                          alt={data.role}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                          {data.role}
                        </div>
                        <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                          {data.level}
                        </div>
                     
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                  <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                          {data.type}
                        </div>
                </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400 capitalize">
                  {data.techstack.map((teck, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span>{teck}</span>
                    </div>
                    ))}
                </TableCell>

                  <TableCell className="px-5 py-4 text-start">
                    <div>
                    
                      <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                      {data.questions.length}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
             
                      <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                      {moment(data.createdAt).format('DD MMM YYYY')}
                      </div>
         
                 </TableCell>
                 <TableCell className="px-5 py-4 text-start">
             
                   <div>
                    -
                   {/* <DateTimePickerComponent /> */}
                   </div>
         
                 </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div>
                      <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                      {Array.isArray(data?.candidates)
                            ? data.candidates.length
                            : "-"}
                      </div>
                      </div>
                 </TableCell>
                 <TableCell className="px-5 py-4 text-start">
                    <div>
                    <button
                    title={`https://ai-interviewer-pi-three.vercel.app/registerme/${data.id}`}
                    onClick={() => handleCopy(data.id)}
                    className="flex items-center gap-2 font-medium text-theme-sm text-gray-800 dark:text-white/90 hover:text-blue-600 transition"
                    >
                   
                    <FaLink
                        className="text-lg cursor-pointer"
                        onClick={(e) => {
                        e.stopPropagation(); // prevents the button onClick if needed
                        handleCopy(data.id);
                        }}
                    />
                    </button>
                      </div>
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
