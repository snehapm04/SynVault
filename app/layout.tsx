import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import React, { useReducer } from "react";


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SynVault - Synthetic Data Generation Platform',
  description: 'Professional synthetic data generation platform for CSV and time series data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}