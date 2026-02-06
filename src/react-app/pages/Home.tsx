import { Suspense, lazy } from 'react';
import Hero from '../components/Hero';

// Lazy load below-fold sections
const ProblemAgitateSection = lazy(() => import('../components/ProblemAgitateSection'));
const OutcomesSection = lazy(() => import('../components/OutcomesSection'));
const PAIDSMechanism = lazy(() => import('../components/PAIDSMechanism'));
const VideoShowcase = lazy(() => import('../components/VideoShowcase'));
const ValueStackSection = lazy(() => import('../components/ValueStackSection'));
const About = lazy(() => import('../components/About'));
const AudienceFitSection = lazy(() => import('../components/AudienceFitSection'));
const ObjectionSection = lazy(() => import('../components/ObjectionSection'));
const GuaranteeSection = lazy(() => import('../components/GuaranteeSection'));
const WhyPriceSection = lazy(() => import('../components/WhyPriceSection'));
const FinalCTASection = lazy(() => import('../components/FinalCTASection'));

// Fallback maintains scroll position
function SectionFallback() {
  return <div className="min-h-[50vh]" />;
}

export default function Home() {
  return (
    <div className="bg-white">
      {/* 1. Hero - Promise + Authority + CTA */}
      <Hero />

      {/* 2. Pain Section - "You're creating content but not making money" */}
      <Suspense fallback={<SectionFallback />}>
        <ProblemAgitateSection />
      </Suspense>

      {/* 3. Outcomes Section - "What You'll Build in 30 Days" */}
      <Suspense fallback={<SectionFallback />}>
        <OutcomesSection />
      </Suspense>

      {/* 4. Mechanism Section - PAIDS Framework explained */}
      <Suspense fallback={<SectionFallback />}>
        <PAIDSMechanism />
      </Suspense>

      {/* 5. Origin Story - META Event Video */}
      <Suspense fallback={<SectionFallback />}>
        <VideoShowcase />
      </Suspense>

      {/* 6. Value Stack - Show value clearly with price anchoring */}
      <Suspense fallback={<SectionFallback />}>
        <ValueStackSection />
      </Suspense>

      {/* 7. About / Story Section */}
      <Suspense fallback={<SectionFallback />}>
        <About />
      </Suspense>

      {/* 8. Who This Is For / Not For */}
      <Suspense fallback={<SectionFallback />}>
        <AudienceFitSection />
      </Suspense>

      {/* 9. Objection Handling */}
      <Suspense fallback={<SectionFallback />}>
        <ObjectionSection />
      </Suspense>

      {/* 10. Guarantee Section */}
      <Suspense fallback={<SectionFallback />}>
        <GuaranteeSection />
      </Suspense>

      {/* 11. Why $67? Section */}
      <Suspense fallback={<SectionFallback />}>
        <WhyPriceSection />
      </Suspense>

      {/* 12. Final CTA Section */}
      <Suspense fallback={<SectionFallback />}>
        <FinalCTASection />
      </Suspense>
    </div>
  );
}
