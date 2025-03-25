import { mean, standardDeviation, quantile } from "simple-statistics";

export function generateSyntheticData(originalData: any[], sampleSize: number) {
  const syntheticData = [];
  
  for (let i = 0; i < sampleSize; i++) {
    const record: any = {};
    
    for (const column of Object.keys(originalData[0])) {
      const values = originalData.map(row => row[column]);
      
      if (typeof values[0] === "number") {
        // For numeric columns, use normal distribution
        const mu = mean(values);
        const sigma = standardDeviation(values);
        let value = normalRandom(mu, sigma);
        
        // Ensure value is within original bounds
        const min = Math.min(...values);
        const max = Math.max(...values);
        value = Math.max(min, Math.min(max, value));
        
        record[column] = value;
      } else {
        // For categorical columns, sample from original values
        record[column] = values[Math.floor(Math.random() * values.length)];
      }
    }
    
    syntheticData.push(record);
  }
  
  return syntheticData;
}

export function validateData(
  originalData: any[],
  syntheticData: any[],
  numericColumns: string[],
  categoricalColumns: string[]
) {
  const validation = {
    statistics: {} as any,
    distributions: {} as any
  };
  
  // Validate numeric columns
  for (const column of numericColumns) {
    const originalValues = originalData.map(row => row[column]);
    const syntheticValues = syntheticData.map(row => row[column]);
    
    // Calculate basic statistics
    const originalStats = {
      mean: mean(originalValues),
      std: standardDeviation(originalValues),
      q1: quantile(originalValues, 0.25),
      q3: quantile(originalValues, 0.75)
    };
    
    const syntheticStats = {
      mean: mean(syntheticValues),
      std: standardDeviation(syntheticValues),
      q1: quantile(syntheticValues, 0.25),
      q3: quantile(syntheticValues, 0.75)
    };
    
    // Calculate similarities
    const meanSimilarity = 1 - Math.abs(originalStats.mean - syntheticStats.mean) / Math.abs(originalStats.mean);
    const stdSimilarity = 1 - Math.abs(originalStats.std - syntheticStats.std) / Math.abs(originalStats.std);
    
    validation.statistics[column] = {
      meanSimilarity,
      stdSimilarity,
      distributionSimilarity: (meanSimilarity + stdSimilarity) / 2
    };
    
    // Generate distribution data for visualization
    validation.distributions[column] = generateDistributionData(originalValues, syntheticValues);
  }
  
  // Validate categorical columns
  for (const column of categoricalColumns) {
    const originalFreq = calculateFrequencies(originalData.map(row => row[column]));
    const syntheticFreq = calculateFrequencies(syntheticData.map(row => row[column]));
    
    validation.distributions[column] = Object.keys(originalFreq).map(value => ({
      value,
      original: originalFreq[value],
      synthetic: syntheticFreq[value] || 0
    }));
  }
  
  return validation;
}

function normalRandom(mu: number, sigma: number) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mu + sigma * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function calculateFrequencies(values: any[]) {
  const freq: { [key: string]: number } = {};
  for (const value of values) {
    freq[value] = (freq[value] || 0) + 1;
  }
  return freq;
}

function generateDistributionData(originalValues: number[], syntheticValues: number[]) {
  const bins = 20;
  const min = Math.min(...originalValues, ...syntheticValues);
  const max = Math.max(...originalValues, ...syntheticValues);
  const step = (max - min) / bins;
  
  const distribution = [];
  for (let i = 0; i < bins; i++) {
    const binStart = min + i * step;
    const binEnd = binStart + step;
    
    const originalCount = originalValues.filter(v => v >= binStart && v < binEnd).length;
    const syntheticCount = syntheticValues.filter(v => v >= binStart && v < binEnd).length;
    
    distribution.push({
      value: binStart.toFixed(2),
      original: originalCount / originalValues.length,
      synthetic: syntheticCount / syntheticValues.length
    });
  }
  
  return distribution;
}