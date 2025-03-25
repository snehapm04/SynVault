import { Card, CardContent } from "@/components/ui/card";
import { Database, LineChart, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About SynVault</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            SynVault is dedicated to providing developers, data scientists, and organizations with powerful tools for generating high-quality synthetic data. Our platform helps solve the challenges of data availability while maintaining privacy and security.
          </p>
          <p className="text-gray-600">
            We believe that access to realistic test data should not compromise sensitive information. Our synthetic data generation tools enable teams to develop, test, and validate their applications with confidence.
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Database className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-medium">Data Privacy</h4>
                  <p className="text-gray-600">Generate realistic data without exposing sensitive information</p>
                </div>
              </li>
              <li className="flex items-start">
                <LineChart className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-medium">Statistical Accuracy</h4>
                  <p className="text-gray-600">Maintain statistical properties and patterns from original datasets</p>
                </div>
              </li>
              <li className="flex items-start">
                <ShieldCheck className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-medium">Compliance</h4>
                  <p className="text-gray-600">Meet data protection regulations while maintaining development efficiency</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Our Technology</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">CSV Data Generator</h3>
            <p className="text-gray-600 mb-4">
              Our CSV generator uses advanced statistical modeling to create synthetic datasets that preserve the characteristics of your original data. Features include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Statistical property preservation</li>
              <li>Categorical and numerical data support</li>
              <li>Distribution matching</li>
              <li>Validation tools</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Time Series Generator</h3>
            <p className="text-gray-600 mb-4">
              Generate realistic time series data with our sophisticated pattern analysis and synthesis engine. Features include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Trend detection and generation</li>
              <li>Seasonality analysis</li>
              <li>Pattern continuation</li>
              <li>Customizable parameters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}