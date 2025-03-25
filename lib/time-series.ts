import { mean, standardDeviation } from "simple-statistics";

export function analyzeTimeSeries(
  data: any[],
  dateColumn: string,
  seriesColumns: string[]
) {
  const patterns: { [key: string]: any } = {};
  
  for (const column of seriesColumns) {
    const series = data.map(row => ({
      date: new Date(row[dateColumn]),
      value: parseFloat(row[column])
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Detect trend
    const trendStrength = calculateTrendStrength(series);
    const trendDirection = series[series.length - 1].value > series[0].value ? "Increasing" : "Decreasing";
    
    // Detect seasonality
    const { seasonalityStrength, seasonalityPeriod } = detectSeasonality(series);
    
    // Calculate noise level
    const noiseLevel = calculateNoiseLevel(series);
    
    patterns[column] = {
      trendStrength,
      trendDirection,
      seasonalityStrength,
      seasonalityPeriod,
      noiseLevel,
      min: Math.min(...series.map(s => s.value)),
      max: Math.max(...series.map(s => s.value)),
      mean: mean(series.map(s => s.value))
    };
  }
  
  return patterns;
}

export function generateTimeSeries(
  patterns: { [key: string]: any },
  startDate: string,
  endDate: string,
  frequency: string,
  patternFidelity: number,
  randomness: number,
  continuation: boolean
) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = generateDateRange(start, end, frequency);
  
  const syntheticData: { date: string; [key: string]: any }[] = dates.map(date => ({
    date: date.toISOString().split('T')[0]
  }));
  
  
  for (const [column, pattern] of Object.entries(patterns)) {
    const values = generateSeriesValues(
      dates.length,
      pattern,
      patternFidelity,
      randomness
    );
    
    values.forEach((value, i) => {
      syntheticData[i][column] = value;
    });
  }
  
  return syntheticData;
}

function calculateTrendStrength(series: { date: Date; value: number }[]) {
  const values = series.map(s => s.value);
  const times = series.map((s, i) => i);
  
  const n = values.length;
  const sumX = times.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = times.reduce((a, b, i) => a + b * values[i], 0);
  const sumX2 = times.reduce((a, b) => a + b * b, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const maxSlope = Math.abs(values[values.length - 1] - values[0]) / values.length;
  
  return Math.min(Math.abs(slope / maxSlope), 1);
}

function detectSeasonality(series: { date: Date; value: number }[]) {
  const values = series.map(s => s.value);
  const detrended = subtractTrend(values);
  
  let maxCorrelation = 0;
  let bestPeriod = 0;
  
  // Try periods from 2 to 1/3 of series length
  const maxPeriod = Math.floor(values.length / 3);
  
  for (let period = 2; period <= maxPeriod; period++) {
    const correlation = calculateAutocorrelation(detrended, period);
    if (correlation > maxCorrelation) {
      maxCorrelation = correlation;
      bestPeriod = period;
    }
  }
  
  return {
    seasonalityStrength: maxCorrelation,
    seasonalityPeriod: bestPeriod
  };
}

function calculateNoiseLevel(series: { date: Date; value: number }[]) {
  const values = series.map(s => s.value);
  const detrended = subtractTrend(values);
  const std = standardDeviation(detrended);
  const range = Math.max(...values) - Math.min(...values);
  
  return Math.min(std / range, 1);
}

function subtractTrend(values: number[]) {
  const times = values.map((_, i) => i);
  const n = values.length;
  const sumX = times.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = times.reduce((a, b, i) => a + b * values[i], 0);
  const sumX2 = times.reduce((a, b) => a + b * b, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return values.map((v, i) => v - (slope * i + intercept));
}

function calculateAutocorrelation(values: number[], lag: number) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  
  let correlation = 0;
  for (let i = 0; i < values.length - lag; i++) {
    correlation += (values[i] - mean) * (values[i + lag] - mean);
  }
  
  return correlation / ((values.length - lag) * variance);
}

function generateDateRange(start: Date, end: Date, frequency: string) {
  const dates: Date[] = [];
  let current = new Date(start);
  
  while (current <= end) {
    dates.push(new Date(current));
    
    switch (frequency) {
      case "Daily":
        current.setDate(current.getDate() + 1);
        break;
      case "Weekly":
        current.setDate(current.getDate() + 7);
        break;
      case "Monthly":
        current.setMonth(current.getMonth() + 1);
        break;
    }
  }
  
  return dates;
}

function generateSeriesValues(
  length: number,
  pattern: any,
  patternFidelity: number,
  randomness: number
) {
  const values: number[] = [];
  
  for (let i = 0; i < length; i++) {
    // Base value
    let value = pattern.mean;
    
    // Add trend
    if (pattern.trendStrength > 0) {
      const trendComponent = pattern.trendStrength * (i / length) * (pattern.max - pattern.min);
      value += trendComponent * patternFidelity * (pattern.trendDirection === "Increasing" ? 1 : -1);
    }
    
    // Add seasonality
    if (pattern.seasonalityStrength > 0) {
      const seasonalComponent = pattern.seasonalityStrength * 
        Math.sin(2 * Math.PI * i / pattern.seasonalityPeriod) * 
        (pattern.max - pattern.min) / 4;
      value += seasonalComponent * patternFidelity;
    }
    
    // Add noise
    const noise = (Math.random() - 0.5) * 2 * pattern.noiseLevel * (pattern.max - pattern.min) / 4;
    value += noise * randomness;
    
    // Ensure value is within bounds
    value = Math.max(pattern.min, Math.min(pattern.max, value));
    
    values.push(value);
  }
  
  return values;
}