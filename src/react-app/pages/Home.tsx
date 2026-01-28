import { Suspense, lazy } from 'react';
import Hero from '../components/Hero';

// Lazy load below-fold sections
const ProblemAgitateSection = lazy(() => import('../components/ProblemAgitateSection'));
const About = lazy(() => import('../components/About'));

// Fallback maintains scroll position
function SectionFallback() {
  return <div className="h-screen" />;
}

export default function Home() {
  return (
    <div className="bg-black">
      {/* Hero loads immediately (critical for first paint) */}
      <Hero />

      {/* Below-fold sections wrapped in Suspense */}
      <Suspense fallback={<SectionFallback />}>
        <ProblemAgitateSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <About />
      </Suspense>
    </div>
  );
}
