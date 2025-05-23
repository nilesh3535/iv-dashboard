"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
  id: string;
  name: string;
  companyName: string;
  email: string;
  photo: string;
  phone: string;
  bio: string;
  instagram: string;
  linkedln: string;
  twitter: string;
  facebook: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
}

interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  refreshAdmin: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAdmin = async () => {
    try {
      setLoading(true);
      const adminRes = await fetch("/api/get-current-admin");
      const { admin: adminData } = await adminRes.json();
      setAdmin(adminData);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAdmin = async () => {
    await loadAdmin();
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, loading, refreshAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
