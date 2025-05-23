"use client";

import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

interface EcommerceMetricsProps {
  candidatesCount: number | string;
  orderCount: number | string;
  currentMonthOrdersCount: number | string;
  currentMonthCandidatesCount: number | string;
}

export const EcommerceMetrics: React.FC<EcommerceMetricsProps> = ({
  candidatesCount,
  orderCount,
  currentMonthOrdersCount,
  currentMonthCandidatesCount,
}) => {
  // Convert inputs safely to numbers (handle string or number)
  const candidatesCountNum = Number(candidatesCount);
  const orderCountNum = Number(orderCount);
  const currentMonthCandidatesCountNum = Number(currentMonthCandidatesCount);
  const currentMonthOrdersCountNum = Number(currentMonthOrdersCount);

  // Calculate percentages (avoid division by zero)
  const candidatesPercent =
    candidatesCountNum === 0
      ? 0
      : (currentMonthCandidatesCountNum / candidatesCountNum) * 100;

  const ordersPercent =
    orderCountNum === 0 ? 0 : (currentMonthOrdersCountNum / orderCountNum) * 100;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Candidates */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Candidates
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {candidatesCountNum}
            </h4>
          </div>
          <Badge color={candidatesPercent > 1 ? "success" : "error"}>
            {candidatesPercent > 1 ? (
              <ArrowUpIcon />
            ) : (
              <ArrowDownIcon className="text-error-500" />
            )}
            {candidatesPercent.toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {orderCountNum}
            </h4>
          </div>
          <Badge color={ordersPercent > 1 ? "success" : "error"}>
            {ordersPercent > 1 ? (
              <ArrowUpIcon />
            ) : (
              <ArrowDownIcon className="text-error-500" />
            )}
            {ordersPercent.toFixed(2)}%
          </Badge>
        </div>
      </div>
    </div>
  );
};
