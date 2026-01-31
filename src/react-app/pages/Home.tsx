import { Suspense, lazy } from 'react';
import Hero from '../components/Hero';

// Lazy load below-fold sections
const ProblemAgitateSection = lazy(() => import('../components/ProblemAgitateSection'));
const VideoShowcase = lazy(() => import('../components/VideoShowcase'));
const About = lazy(() => import('../components/About'));

// Fallback maintains scroll position
function SectionFallback() {
  return <div className="min-h-[50vh]" />;
}

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero loads immediately (critical for first paint) */}
      <Hero />

      {/* Below-fold sections wrapped in Suspense */}
      <Suspense fallback={<SectionFallback />}>
        <ProblemAgitateSection />
      </Suspense>

      {/* META Event Video Showcase */}
      <Suspense fallback={<SectionFallback />}>
        <VideoShowcase />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <About />
      </Suspense>
    </div>
  );
}
