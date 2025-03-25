"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { generateSyntheticData, validateData } from "@/lib/data-generation";

export function CSVGenerator() {
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [categoricalColumns, setCategoricalColumns] = useState<string[]>([]);
  const [sampleSize, setSampleSize] = useState(100);
  const [syntheticData, setSyntheticData] = useState<any[]>([]);
  const [validation, setValidation] = useState<any>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as any[];
        setOriginalData(data);
        
        // Detect columns and their types
        const cols = Object.keys(data[0]);
        const numeric: string[] = [];
        const categorical: string[] = [];
        
        cols.forEach(col => {
          const isNumeric = data.every(row => !isNaN(parseFloat(row[col])));
          if (isNumeric) {
            numeric.push(col);
          } else {
            categorical.push(col);
          }
        });

        setColumns(cols);
        setNumericColumns(numeric);
        setCategoricalColumns(categorical);
        setSelectedColumn(numeric[0] || categorical[0]);
      },
      header: true
    });
  };

  const handleGenerate = () => {
    const synthetic = generateSyntheticData(originalData, sampleSize);
    setSyntheticData(synthetic);
    
    const validationResults = validateData(originalData, synthetic, numericColumns, categoricalColumns);
    setValidation(validationResults);
  };

  const downloadSyntheticData = () => {
    const csv = Papa.unparse(syntheticData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "synthetic_data.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="csvFile">Upload CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mt-2"
              />
            </div>

            {originalData.length > 0 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Dataset Info</h3>
                  <p>Rows: {originalData.length}</p>
                  <p>Numeric columns: {numericColumns.join(", ")}</p>
                  <p>Categorical columns: {categoricalColumns.join(", ")}</p>
                </div>

                <div>
                  <Label>Sample Size</Label>
                  <Slider
                    value={[sampleSize]}
                    onValueChange={(value) => setSampleSize(value[0])}
                    max={10000}
                    step={10}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate {sampleSize} synthetic records
                  </p>
                </div>

                <Button onClick={handleGenerate}>Generate Synthetic Data</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {syntheticData.length > 0 && (
        <>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Validation Results</h3>
              
              <Tabs defaultValue="statistics">
                <TabsList>
                  <TabsTrigger value="statistics">Statistical Comparison</TabsTrigger>
                  <TabsTrigger value="distribution">Distribution Comparison</TabsTrigger>
                </TabsList>

                <TabsContent value="statistics">
                  <div className="space-y-4">
                    {numericColumns.map(col => (
                      <div key={col} className="space-y-2">
                        <h4 className="font-medium">{col}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm">Mean Similarity</p>
                            <Progress value={validation?.statistics[col]?.meanSimilarity * 100} />
                          </div>
                          <div>
                            <p className="text-sm">Distribution Similarity</p>
                            <Progress value={validation?.statistics[col]?.distributionSimilarity * 100} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="distribution">
                  <div className="space-y-4">
                    <select
                      value={selectedColumn}
                      onChange={(e) => setSelectedColumn(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>

                    <div className="h-[300px]">
                      <LineChart
                        width={600}
                        height={300}
                        data={validation?.distributions[selectedColumn]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="value" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="original" stroke="#8884d8" />
                        <Line type="monotone" dataKey="synthetic" stroke="#82ca9d" />
                      </LineChart>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Button onClick={downloadSyntheticData}>
            Download Synthetic Data
          </Button>
        </>
      )}
    </div>
  );
}