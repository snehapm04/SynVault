import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Database, LineChart } from "lucide-react";
import React, { useReducer } from "react";


export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-pattern py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-primary mb-6">
              Generate High-Quality Synthetic Data
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create realistic synthetic datasets for testing, development, and machine learning with our advanced data generation platform.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/generators">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">CSV Data Generator</h3>
              <p className="text-gray-600">
                Generate synthetic datasets that preserve statistical properties of your original data.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Series Generator</h3>
              <p className="text-gray-600">
                Create realistic time series data with customizable trends, seasonality, and patterns.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Data Validation</h3>
              <p className="text-gray-600">
                Validate synthetic data quality with comprehensive statistical analysis and visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Generate Synthetic Data?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start creating high-quality synthetic datasets for your projects today.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/generators">
              Try Data Generators
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}