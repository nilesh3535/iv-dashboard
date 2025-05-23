'use client';
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";


import { getAllUsers, getOrdersWithUserInfo } from "../../firebase/actions/general.action";
import moment from "moment";
import Lottie, { LottieComponentProps } from "lottie-react";

export default function Ecommerce() {
  const [isLoading, setIsLoading] = useState(true);
  const [animationData, setAnimationData] = useState<LottieComponentProps["animationData"] | null>(null);
 
    const [candidatesCount, setCandidatesCount] = useState<number>(0);
    const [currentMonthCandidatesCount,setCurrentMonthCandidatesCount]= useState<number>(0);
    const [currentMonthOrdersCount,setCurrentMonthOrdersCount]= useState<number>(0);
  // const [ivCount, setIVCount] = useState<number>(0);
  
  const [orderCount, setOrderCount] = useState<number>(0);
  // const [todayEarn,setTodayEarn]=useState<number>(0);
  // const [allEarn,setAllEarn]=useState<number>(0);
 //current year 
  // const [monthlyEarnings, setMonthlyEarnings] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    const loadAnimation = async () => {
      const res = await fetch("/images/dataloader.json");
      const json = await res.json();
      setAnimationData(json);
    };

    loadAnimation();
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setCandidatesCount(users?.length || 0);
      console.log("Users:", users);
      const currentMonth = moment().format("MM/YYYY");

      const currentMonthUsers = users?.filter(user =>
        moment(user.createdAt).format("MM/YYYY") == currentMonth
      );
     const currentMonthCount = currentMonthUsers?.length;
     setCurrentMonthCandidatesCount(currentMonthCount||0)
      // const interviews = await getAllInterviews();
      // setIVCount(interviews?.length || 0);
       const orders = await getOrdersWithUserInfo();
      setOrderCount(orders?.length || 0);
      //
const currentMonthOrders = orders?.filter(user =>
        moment(user.paymentDate).format("MM/YYYY") == currentMonth
      );
      const cmoCount=currentMonthOrders?.length;
setCurrentMonthOrdersCount(cmoCount||0)
      //
      // const today = moment().format("DD/MM/YYYY");
      // const todaysOrders = orders?.filter(order => 
      //   moment(order.paymentDate).format("DD/MM/YYYY") == today
      // );
    //   const totalAmount = todaysOrders?.reduce((sum, order) => {
    //   return sum + Number(order.amount);
    // }, 0);
    // setTodayEarn(totalAmount||0)
    //  const totalallAmount = orders?.reduce((sum, order) => {
    //   return sum + Number(order.amount);
    // }, 0);
    // setAllEarn(totalallAmount||0)

    //monthly
     const monthlyTotals = Array(12).fill(0);
    const currentYear = moment().year();

    orders?.forEach(order => {
      const date = moment(order.paymentDate);
      if (date.year() === currentYear) {
        const monthIndex = date.month(); // Jan = 0, Dec = 11
        monthlyTotals[monthIndex] += Number(order.amount);
      }
    });
    //  setMonthlyEarnings(monthlyTotals);
     setIsLoading(false);
    };
    fetchUsers();
  }, []);

  if (isLoading || !animationData) {
    return (
      <div className="fixed inset-0 z-50 bg-[#17195000] dark:bg-white/5 text-white">
      <div>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0">
          <div className="lg:w-1/2 w-full h-full lg:grid items-center hidden">
            <div className="relative items-center justify-center flex z-1 flex-col gap-4">
              <Lottie animationData={animationData} loop autoplay className="w-48 h-48" />
            </div>
          </div>
          <div className="lg:hidden flex justify-center items-center w-full h-full bg-[#17195000] dark:bg-white/5">
            <Lottie animationData={animationData} loop autoplay className="w-48 h-48" />
          </div>
        </div>
      </div>
    </div>
    
    );
  }
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics candidatesCount={candidatesCount}  orderCount={orderCount} currentMonthOrdersCount={currentMonthOrdersCount} currentMonthCandidatesCount={currentMonthCandidatesCount} />

        {/* <MonthlySalesChart monthlyEarnings={monthlyEarnings} /> */}
      </div>

      <div className="col-span-12 xl:col-span-5">
        {/* <MonthlyTarget todayEarn={todayEarn} allEarn={allEarn}  /> */}
      </div>

      <div className="col-span-12">
        {/* <StatisticsChart monthlyEarnings={monthlyEarnings} /> */}
      </div>

      
    </div>
  );
}
