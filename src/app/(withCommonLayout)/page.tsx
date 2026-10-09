import HeroSection from "@/components/home/heroSection/HeroSection";
import TestimonialsSection from "@/components/home/TestimonialsSection/TestimonialsSection";
import Features from "@/components/home/Features/Features";

import HowItWorks from "@/components/home/howitWorks/howitWorks";
import FAQ from "@/components/home/FAQ/FAQ";
import BlogSection from "@/components/home/blogSection/blog";
import WhyChooseUs from "@/components/home/WhyChooseUs/WhyChooseUs";
import ExploreOurDashboardFeatures from "@/components/home/ExploreOurDashboardFeatures/ExploreOurDashboardFeatures";

import { FloatingClock } from "@/components/shared/FloatingClock";




const HomePage = () => {
  return (
    <div className="space-y-10">
      <HeroSection></HeroSection>
      <WhyChooseUs />
      <ExploreOurDashboardFeatures />
      <Features />
      <HowItWorks></HowItWorks>
      <TestimonialsSection></TestimonialsSection>
      <FAQ></FAQ>
      <BlogSection></BlogSection>
      <FloatingClock />






    </div>
  );
};

export default HomePage;
