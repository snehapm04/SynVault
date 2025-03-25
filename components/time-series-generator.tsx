"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { analyzeTimeSeries, generateTimeSeries } from "@/lib/time-series";

export function TimeSeriesGenerator() {
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [dateColumn, setDateColumn] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [patterns, setPatterns] = useState<any>(null);
  const [syntheticData, setSyntheticData] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    startDate: "",
    endDate: "",
    frequency: "Daily",
    patternFidelity: 0.7,
    randomness: 0.3,
    continuation: true
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as any[];
        setOriginalData(data);
        
        // Detect date columns and numeric columns
        const cols = Object.keys(data[0]);
        const dateCol = cols.find(col => 
          data.every(row => !isNaN(Date.parse(row[col])))
        ) || cols[0];
        
        setDateColumn(dateCol);
        setColumns(cols.filter(col => col !== dateCol));
        setSelectedColumns([cols[1]]);
      },
      header: true
    });
  };

  const handleAnalyze = () => {
    const patterns = analyzeTimeSeries(originalData, dateColumn, selectedColumns);
    setPatterns(patterns);
  };

  const handleGenerate = () => {
    const synthetic = generateTimeSeries(
      patterns,
      settings.startDate,
      settings.endDate,
      settings.frequency,
      settings.patternFidelity,
      settings.randomness,
      settings.continuation
    );
    setSyntheticData(synthetic);
  };

  const downloadSyntheticData = () => {
    const csv = Papa.unparse(syntheticData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "synthetic_timeseries.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="timeseriesFile">Upload Time Series CSV</Label>
              <Input
                id="timeseriesFile"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mt-2"
              />
            </div>

            {originalData.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date Column</Label>
                    <Select
                      value={dateColumn}
                      onValueChange={setDateColumn}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date column" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map(col => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Series to Analyze</Label>
                    <Select
                      value={selectedColumns[0]}
                      onValueChange={(value) => setSelectedColumns([value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map(col => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleAnalyze}>Analyze Patterns</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {patterns && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Detected Patterns</h3>
            
            {selectedColumns.map(col => (
              <div key={col} className="space-y-4">
                <h4 className="font-medium">{col}</h4>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm">Trend Strength</p>
                    <Progress value={patterns[col].trendStrength * 100} />
                    <p className="text-sm mt-1">{patterns[col].trendDirection}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm">Seasonality</p>
                    <Progress value={patterns[col].seasonalityStrength * 100} />
                    <p className="text-sm mt-1">Period: ~{patterns[col].seasonalityPeriod} units</p>
                  </div>
                  
                  <div>
                    <p className="text-sm">Noise Level</p>
                    <Progress value={patterns[col].noiseLevel * 100} />
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={settings.startDate}
                    onChange={(e) => setSettings({...settings, startDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={settings.endDate}
                    onChange={(e) => setSettings({...settings, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Frequency</Label>
                  <Select
                    value={settings.frequency}
                    onValueChange={(value) => setSettings({...settings, frequency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Pattern Fidelity</Label>
                  <Slider
                    value={[settings.patternFidelity]}
                    onValueChange={(value) => setSettings({...settings, patternFidelity: value[0]})}
                    max={1}
                    step={0.1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Randomness</Label>
                  <Slider
                    value={[settings.randomness]}
                    onValueChange={(value) => setSettings({...settings, randomness: value[0]})}
                    max={1}
                    step={0.1}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.continuation}
                    onCheckedChange={(checked) => setSettings({...settings, continuation: checked})}
                  />
                  <Label>Continuation Mode</Label>
                </div>
              </div>

              <Button onClick={handleGenerate}>Generate Time Series</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {syntheticData.length > 0 && (
        <>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Generated Time Series</h3>
              
              <div className="h-[400px]">
                <LineChart
                  width={800}
                  height={400}
                  data={syntheticData}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={dateColumn} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedColumns.map((col, idx) => (
                    <Line
                      key={col}
                      type="monotone"
                      dataKey={col}
                      stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                    />
                  ))}
                </LineChart>
              </div>
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