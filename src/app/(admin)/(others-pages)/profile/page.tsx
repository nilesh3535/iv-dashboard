import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";

import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { AdminProvider } from "@/context/AdminContext";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "WinYourInterview - Admin Panel",
  description: "This is WinYourInterview - Admin Panel",
};

export default function Profile() {
  return (
    <AdminProvider>
      <div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Profile
          </h3>
          <div className="space-y-6">
            <UserMetaCard />
            <UserInfoCard />
            <UserAddressCard />
          </div>
        </div>
      </div>
    </AdminProvider>
  );
}