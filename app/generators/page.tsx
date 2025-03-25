"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSVGenerator } from "@/components/csv-generator";
import { TimeSeriesGenerator } from "@/components/time-series-generator";

export default function GeneratorsPage() {
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Data Generators</h1>
      
      <Tabs defaultValue="csv" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="csv">CSV Data Generator</TabsTrigger>
          <TabsTrigger value="timeseries">Time Series Generator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="csv">
          <CSVGenerator />
        </TabsContent>
        
        <TabsContent value="timeseries">
          <TimeSeriesGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}