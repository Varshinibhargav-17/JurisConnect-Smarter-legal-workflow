import About from '@/components/landing/About';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import LandingNavbar from '@/components/landing/LandingNavebar';
import Testimonials from '@/components/landing/Testimonials';

export default function LandingPage() {
  return (
    <div>
      <LandingNavbar />
      <Hero />
      <Features />
      <About />
      <Testimonials />
      <Footer />
    </div>
  );
}