'use client';

import React, { useState, useEffect } from 'react';
import LandingNavbar from './landing/LandingNavbar';
import HeroSection from './landing/HeroSection';
import FeatureSection from './landing/FeatureSection';
import AIWorkflowSection from './landing/AIWorkflowSection';
import ProductShowcase from './landing/ProductShowcase';
import CollaborationSection from './landing/CollaborationSection';
import UseCasesSection from './landing/UseCasesSection';
import PricingSection from './landing/PricingSection';
import TestimonialsSection from './landing/TestimonialsSection';
import FAQSection from './landing/FAQSection';
import FinalCTASection from './landing/FinalCTASection';
import Footer from './landing/Footer';

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);

  // Synchronize system dark preference on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('auraflow_theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      } else {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(isSystemDark);
      }
    }
  }, []);

  // Synchronize document root class and local storage when isDark changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('auraflow_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('auraflow_theme', 'light');
      }
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen bg-background text-foreground transition-all duration-300 font-sans`}>
      {/* Sticky Navbar */}
      <LandingNavbar isDark={isDark} setIsDark={setIsDark} />

      {/* Hero Section */}
      <HeroSection />

      {/* Feature Highlights Grid */}
      <FeatureSection />

      {/* Product Showcase (Tabbed Features Preview) */}
      <ProductShowcase />

      {/* AI Features & How It Works workflow */}
      <AIWorkflowSection />

      {/* Liveblocks-powered Collaboration Section */}
      <CollaborationSection />

      {/* Use Cases (Persona Customizations) */}
      <UseCasesSection />

      {/* Pricing Cards Grid */}
      <PricingSection />

      {/* User Testimonials Section */}
      <TestimonialsSection />

      {/* Common FAQ accordion list */}
      <FAQSection />

      {/* Final Conversion Call-to-Action */}
      <FinalCTASection />

      {/* General Directory Footer */}
      <Footer />
    </div>
  );
}
