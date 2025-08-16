import React from "react";
import Layout from "../layouts/Layout";
import HeroSection from "../app/components/HeroSection";
import Features from "../app/components/Features";
import Stats from "../app/components/Stats";
import CallToAction from "../app/components/CallToAction";


const Home = () => {
  return (
    <Layout title="Welcome to Astrolus.">
      <main className="space-y-40 mb-40">
        <HeroSection />
        <Features />
        <Stats />
        
        <CallToAction />
        
      </main>
    </Layout>
    
    
  );
};

export default Home;
