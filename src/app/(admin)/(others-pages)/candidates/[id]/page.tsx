'use client';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import PageCandidateCrumb from '@/components/common/PageCandidateCrumb';
import { getFeedbackByInterviews, getInterviewsByUserId } from '@/lib/actions/general.action';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import Image from 'next/image';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { DocsIcon } from '@/icons';
import { Modal } from '@/components/ui/modal';
import Pagination from '@/components/tables/Pagination';
import { iconsColors } from '@/constants';
export interface InterviewData {
    id: string;
    userId: string;
    coverImage: string;
    createdAt: string; // or `Date` if you plan to parse it
    finalized: boolean;
    level: string;
    role: string;
    type: string;
    techstack: string[];
    questions: string[];
     available?: boolean; // 👈 this fixes the error
     totalScore:number;
       areasForImp: string[];
   categoryScores: [];
    finalAssessment: string;
      strengths: string[];
      attemptdate:string;
      comment:string
  }
  interface FeedbackData {
  areasForImprovement: string[];
  categoryScores: { name: string; score: number; comment?: string }[];
  createdAt: string;
  finalAssessment: string;
  strengths: string[];
  totalScore: number;
}
export default function CandidateInfo() {
  
 

    const [areasForImp, setAreasForImp] = useState<string[]>([]);
   const [categoryScores, setCategoryScores] = useState<{ name: string; score: number; comment?: string }[]>([]);
    const [attemptdate, setAttemptDate] = useState<string | null>(null);
    const [finalAssessment, setFinalAssessment] = useState<string>("");
    const [strengths, setStrengths] = useState<string[]>([]);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [available, setAvailable] = useState<boolean>(false);
    const [position,setPosition]=useState<string>('')
    


     console.log(available)
      const [isFullscreenModalOpen, setIsOpen] = useState(false);
        
       const openFullscreenModal = (
      v1: string[],
      v2: { name: string; score: number }[],
      v3: string | null,
      v4: string,
      v5: string[],
      v6: number,
      v7: string
    ) => {
      setIsOpen(true);
      setAreasForImp(v1);
      setCategoryScores(v2);  
      setAttemptDate(v3);
      setFinalAssessment(v4);
      setStrengths(v5);
      setTotalScore(v6);
      setAvailable(true);
      setPosition(v7);
    };
        const closeFullscreenModal=()=>{
        setIsOpen(false);
        }

       const handleSave = () => {
        // Handle save logic here
        console.log("Saving changes...");
        closeFullscreenModal();
      };
    const params = useParams();
    const searchParams = useSearchParams();
   const [uname,setUName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
     const [data, setData] = useState<InterviewData[]>([]);
     const pageSize = 10;
     const [tab,setTab]=useState('')
     const totalPages = tab=="Created" ? Math.ceil(data.length / pageSize):Math.ceil((data.filter(item => item.available).length) / pageSize);
    
     const [loading, setLoading] = useState(true);

    useEffect(() => {
  const fetchUserAndInterview = async () => {
    const userId = params?.id;
    const userName = searchParams.get("name");
    const stab = searchParams.get("tab");
    setTab(stab || "Created");

    if (userId) {
      console.log("User ID:", userId);
      console.log("User Name:", userName);
      setUName(userName as string);

      const alldata = await getInterviewsByUserId(userId as string);
      console.log("Data:", alldata);

      if (!alldata) {
        setData([]);
        setLoading(false);
        return;
      }

      const updated = await Promise.all(
        alldata.map(async (data) => {
          try {
            const feedback = await getFeedbackByInterviews(data.id, data.userId);
           const safeFeedback = (feedback ?? {}) as Partial<FeedbackData>;
            const isAvailable = feedback && Object.keys(feedback).length > 0;

            return {
              ...data,
              interviewCount: alldata.length,
             areasForImp: safeFeedback?.areasForImprovement || [],
              categoryScores: safeFeedback.categoryScores || [],
              attemptdate: safeFeedback.createdAt || null,
              finalAssessment: safeFeedback.finalAssessment || "",
              strengths: safeFeedback.strengths || [],
              totalScore: safeFeedback.totalScore || 0,
              available: isAvailable,
            };
          } catch (error) {
            console.error(`Error fetching feedback for interview ${data.id}`, error);
            return {
              ...data,
              available: false,
            };
          }
        })
      );

      console.log("Updated Data:", updated);
      setData(updated as InterviewData[]);
    }

    setLoading(false);
  };

  fetchUserAndInterview();
}, [params?.id, searchParams]);

      return (
        <div>
          <PageCandidateCrumb pageTitle="Candidates" candidateName={uname} tabs={tab} />
          <div className="flex items-center space-x-4 px-4 py-3">
            <button
                onClick={() => setTab("Created")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                tab === "Created"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-white/[0.05] dark:text-white/70"
                }`}
            >
                Created ({data.length})
            </button>
            <button
                onClick={() => setTab("Attempt")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                tab === "Attempt"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-white/[0.05] dark:text-white/70"
                }`}
            >
                Attempt ({data.filter(item => item.available).length})
            </button>
            </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <div className="min-w-[900px]">
                  {tab=="Created" ?
                  (<Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                          Interviews
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                          Type
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                          Skills
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                          Questions
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                          Created on
                        </TableCell>
                      </TableRow>
                    </TableHeader>
      
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                              Loading data...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                              No data found.
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.slice(
                          (currentPage - 1) * pageSize,
                          currentPage * pageSize
                        ).map((data) => (
                          <TableRow key={data.id}>
                            <TableCell className="align-top px-5 py-4 text-start">
                              <div className="flex items-center gap-3">
                                <div className="">
                                  {/* <Image
                                    src={data.coverImage ? data.coverImage : "/covers/dropbox.png"}
                                    alt={data.role}
                                    width={40}
                                    height={40}
                                  /> */}

                            <div
                                      style={{ backgroundColor: iconsColors[data.coverImage.split("/")[2]] ,
                                        boxShadow: "0px 4px 10px rgba(219, 208, 208, 0.3)"
                                      }}
                                      className="rounded-full size-[50px] mx-auto flex items-center justify-center text-white text-xs font-semibold border-[3px] border-[#d9e0e691] "
                                    >
                                      <h1 className="font-bold text-lg">
                                      {
                                                          data.role.split(" ").length === 1
                                                            ? data.role[0].toUpperCase() + "I"
                                                            : data.role.split(" ")[0][0].toUpperCase() + data.role.split(" ")[data.role.split(" ").length - 1][0].toUpperCase()
                                                        }
                                      </h1>
                                      </div>

                                </div>
                                <div>
                                  <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                                  {data.role.toLowerCase().includes("interview") ? data.role : `${data.role} Interview`}
                                  </div>
                                  <Badge variant="light" color="info">
                                  <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                                    {data.level}
                                  </div>
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
      
                            <TableCell className="align-top px-5 py-4 text-start">
                              <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                              <Badge variant="light" color={data.type.toLowerCase().includes("mix") ?"warning":data.type.toLowerCase().includes("technical")?"info":"success"}>
                             
                              <p className='capitalize'>
                              {data.type.toLowerCase().includes("mix") ? "mixed": data.type.toLowerCase().replaceAll("interview","")}
                              </p>
                               </Badge>
                              </div>
                            </TableCell>
      
                            <TableCell className="align-top px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 capitalize">
                              {data.techstack.map((tech, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <span>{tech}</span>
                                </div>
                              ))}
                            </TableCell>
      
                            <TableCell className="align-top px-5 py-4 text-start">
                              <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                                {data.questions.length}
                              </div>
                            </TableCell>
      
                            <TableCell className="align-top px-5 py-4 text-start">
                              <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                                {moment(data.createdAt).format("DD MMM YYYY")}
                              </div>
                              <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                                {moment(data.createdAt).format("hh:mm A")}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  ):(
                    <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                          Interviews
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                          Info
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                          Attempted
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                          Impression
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                         Actions
                        </TableCell>
                      </TableRow>
                    </TableHeader>
      
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                              Loading data...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                              No data found.
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.filter(item => item.available).slice(
                          (currentPage - 1) * pageSize,
                          currentPage * pageSize
                        ).map(data => (
                          <TableRow key={data.id}>
                         <TableCell className="align-top px-5 py-4 text-start">
                              <div className="flex items-center gap-3">
                                <div className="">
                                <div
                                  style={{ backgroundColor: iconsColors[data.coverImage.split("/")[2]] ,
                                    boxShadow: "0px 4px 10px rgba(219, 208, 208, 0.3)"
                                  }}
                                  className="rounded-full size-[50px] mx-auto flex items-center justify-center text-white text-xs font-semibold border-[3px] border-[#d9e0e691] "
                                >
                                  <h1 className="font-bold text-lg">
                                  {
                                                      data.role.split(" ").length === 1
                                                        ? data.role[0].toUpperCase() + "I"
                                                        : data.role.split(" ")[0][0].toUpperCase() + data.role.split(" ")[data.role.split(" ").length - 1][0].toUpperCase()
                                                    }
                                  </h1>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                                  {data.role.toLowerCase().includes("interview") ? data.role : `${data.role} Interview`}
                                  </div>
                                  <Badge variant="light" color="info">
                                  <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                                    {data.level}
                                  </div>
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
      
                            <TableCell className="align-top px-5 py-4 text-start">
                              <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                                 
                              <Badge  variant="light" color={data.type.toLowerCase().includes("mix") ?"warning":data.type.toLowerCase().includes("technical")?"info":"success"}>
                            <p className='capitalize'>
                              {data.type.toLowerCase().includes("mix") ? "mixed": data.type.toLowerCase().replaceAll("interview","")}
                              </p>
                                </Badge>
                     
                    
                               
                              </div>
                              <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                              {data.techstack.map((tech, index) => (
                                <div key={index} className="mt-1 flex items-center gap-2">
                                  <span className='ml-2'>{tech}</span>
                                </div>
                              ))}
                              </div>
                            </TableCell>
      
                            <TableCell className="align-top px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 capitalize">
                            <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                               {data.questions.length} Questions
                              </div>
                              <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                                {moment(data.createdAt).format("DD MMM YYYY")}
                                
                              </div>
                              <div className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                        
                                {moment(data.createdAt).format("hh:mm A")}
                              </div>
                            </TableCell>
      
                            <TableCell className="align-top px-5 py-4 text-start">
                              <div className="text-theme-sm text-gray-500 dark:text-gray-400">
                                {data.totalScore}/100
                              </div>
                            </TableCell>
      
                            <TableCell className="align-top px-5 py-4 text-start">
                            <button 
                            className={`px-4 py-2 flex flex-row gap-2 align-middle rounded-lg text-sm text-white font-medium bg-blue-600 text-white"
                              }`}
                          onClick={() => openFullscreenModal(
                            data.areasForImp,
                            data.categoryScores,
                            data.attemptdate,
                            data.finalAssessment,
                            data.strengths,
                            data.totalScore,
                            data.role
                          )}
                            
                          >
                            <p>Feedback</p>
                                        
                                <DocsIcon />
                             </button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  )}
                   <Modal
                          isOpen={isFullscreenModalOpen}
                          onClose={closeFullscreenModal}
                          isFullscreen={true}
                          showCloseButton={true}
                        >
                           <div style={{ backgroundImage: 'url("/pattern.png")' }} 
                           
                           className="fixed inset-0 flex flex-col justify-between w-full h-screen p-6 overflow-y-auto bg-[#0a0a0a] lg:p-10"
                            >
                            {/* Centered content area with spacing */}
                            <div className="mx-auto w-full max-w-5xl "
                           >
                            <h4 className="mb-7 text-xl font-light text-white/90">
                                {uname}
                            </h4>

                            {/* You can insert more modal content here */}
                            <div className='bg-stone-900/50 px-4 lg:px-8 py-3 lg:py-8'>
                            <h4 className="mb-7 text-center text-3xl font-semibold text-white/90">
                                Feedback: {position.toLowerCase().includes("interview") ? position: `${position} Interview`}
                            </h4>
                            <div className="flex flex-row justify-center">
                                    <div className="flex flex-row gap-5 max-sm:flex-col max-sm:items-center">
                                      {/* Overall Impression */}
                                      <div className="flex flex-row gap-2 items-center">
                                        <Image src="/star-2.svg" width={22} height={22} alt="star" />
                                        <p className='text-blue-100 text-lg'>
                                          Overall Impression:{" "}
                                          <span className="text-orange-300 font-bold">
                                           {totalScore}
                                          </span>
                                          /100
                                        </p>
                                      </div>
                            
                                      {/* Date */}
                                      <div className="flex flex-row gap-2">
                                        <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
                                        <p className='text-blue-100'>
                                          {attemptdate
                                            ? moment(attemptdate).format("MMM D, YYYY hh:mm A")
                                            : "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                            
                                  <p className='text-blue-100 text-lg my-4'>{finalAssessment}</p>
                            
                                  {/* Interview Breakdown */}
                                  <div className="flex flex-col gap-5 mt-2">
                                    <h2 className='text-3xl font-semibold text-[#fafafa]' >Breakdown of the Interview:</h2>
                                    {categoryScores?.map((category, index) => (
                                      <div key={index} className="md:ml-4"> 
                                        <p className="text-violet-200 font-bold text-lg">
                                          {index + 1}. {category.name} ({category.score}/100)
                                        </p>
                                        <p className='text-blue-100 text-lg'>{category.comment}</p>
                                      </div>
                                    ))}
                                  </div>
                            
                                  <div className="flex flex-col gap-3 my-5">
                                  <h3 className='text-3xl font-semibold text-[#fafafa]'>Strengths:</h3>
                                    <ul className="md:ml-6 list-disc list-inside">
                                      {strengths?.map((strength, index) => (
                                        <li key={index} className='text-blue-100 text-lg'>{strength}</li>
                                      ))}
                                    </ul>
                                  </div>
                            
                                  <div className="flex flex-col gap-3 my-5">
                                  <h3 className='text-3xl font-semibold text-[#fafafa]' >Areas for Improvement:</h3>
                                  <ul className="md:ml-6 list-disc list-inside">
                                      {areasForImp?.map((area, index) => (
                                      <li key={index} className='text-blue-100 text-lg'>{area}</li>
                                      ))}
                                    </ul>
                                  </div>
                            
                                  <div className="buttons mt-4">
                                      
                                  </div>
                            </div>
                            </div>

                            {/* Footer actions */}
                            <div className="flex items-center justify-end w-full gap-3 mt-8">
                            <Button size="sm" onClick={handleSave}>
                                Close
                            </Button>
                            </div>
                        </div>
                        </Modal>
                </div>
              </div>
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
      )
    }
      
