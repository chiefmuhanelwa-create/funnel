import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, CheckCircle, ChevronLeft, Clock, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import { COURSE_VIDEOS } from '../config/assets';

// Use the modules from the central assets config
const modules = COURSE_VIDEOS.starterKit;
const PRODUCT_KEY = 'starter-kit';

export default function StarterKitCourse() {
  const { hasAccessToProduct, isLoading, emailAccess } = useMemberAccess();
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get user email from session
  const userEmail = emailAccess?.email || sessionStorage.getItem('member-email');

  // Fetch progress from server
  const fetchProgress = useCallback(async () => {
    if (!userEmail) return;

    try {
      const response = await fetch(`/api/progress?email=${encodeURIComponent(userEmail)}&product_key=${PRODUCT_KEY}`);
      if (response.ok) {
        const data = await response.json();
        const completedIds = data.progress
          .filter((p: { completed: boolean }) => p.completed)
          .map((p: { lesson_id: number }) => p.lesson_id);
        setCompletedModules(completedIds);
        // Sync to localStorage for offline access
        localStorage.setItem('starterkit-progress', JSON.stringify(completedIds));
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Fall back to localStorage
      const saved = localStorage.getItem('starterkit-progress');
      if (saved) {
        setCompletedModules(JSON.parse(saved));
      }
    }
  }, [userEmail]);

  useEffect(() => {
    // Load from localStorage first (instant)
    const saved = localStorage.getItem('starterkit-progress');
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
    // Then sync from server
    fetchProgress();
  }, [fetchProgress]);

  // Save progress to server and localStorage
  const markComplete = async (moduleId: number) => {
    if (completedModules.includes(moduleId)) return;

    // Optimistic update
    const updated = [...completedModules, moduleId];
    setCompletedModules(updated);
    localStorage.setItem('starterkit-progress', JSON.stringify(updated));

    // Sync to server
    if (userEmail) {
      setIsSyncing(true);
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            product_key: PRODUCT_KEY,
            lesson_id: moduleId,
            completed: true,
          }),
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleModuleClick = (moduleId: number) => {
    setActiveModule(moduleId);
    setIsPlaying(false);
  };

  const handleBackToList = () => {
    setActiveModule(null);
    setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!hasAccessToProduct('starter-kit')) {
    return <Navigate to="/checkout/starter-kit" replace />;
  }

  const progress = Math.round((completedModules.length / modules.length) * 100);
  const currentModule = activeModule !== null ? modules[activeModule] : null;

  // Module List View
  if (activeModule === null) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container-content py-8">
          {/* Back to Hub */}
          <Link
            to="/members"
            className="inline-flex items-center text-gray-500 hover:text-gold-500 transition-colors mb-8"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Hub
          </Link>

          {/* Course Header */}
          <div className="mb-10">
            <h1 className="text-section md:text-section-lg text-gray-900">
              Contentpreneur <span className="text-gradient-gold">Starter Kit</span>
            </h1>
            <p className="mt-3 text-gray-500 max-w-2xl">
              Your complete roadmap from content creator to content entrepreneur. Build real income streams, not just followers.
            </p>
          </div>

          {/* Progress Card */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Contentpreneur Starter Kit Course - 9 Modules</p>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">Your Progress</h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-gradient-gold">{progress}%</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-gray-400 text-sm mt-3">
              {completedModules.length} of {modules.length} modules completed
            </p>
          </div>

          {/* Course Modules */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Modules</h2>
            <div className="space-y-3">
              {modules.map((module, index) => {
                const isCompleted = completedModules.includes(module.id);

                return (
                  <motion.button
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full text-left card card-hover p-5 group ${
                      module.isBonus ? 'border border-gold-500/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Module indicator */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-success-500/20'
                          : module.isBonus
                            ? 'bg-gold-500/20'
                            : 'bg-gray-50'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle size={20} className="text-success-400" />
                        ) : (
                          <Play size={18} className={module.isBonus ? 'text-gold-500' : 'text-gray-500'} />
                        )}
                      </div>

                      {/* Module content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${
                            module.isBonus ? 'text-gold-500' : 'text-gray-400'
                          }`}>
                            {module.label}
                          </span>
                          <div className="flex items-center text-gray-400 text-xs">
                            <Clock size={12} className="mr-1" />
                            {module.duration}
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-gold-500 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {module.description}
                        </p>
                      </div>

                      {/* Action indicator */}
                      <div className="shrink-0 self-center">
                        <ArrowRight
                          size={18}
                          className="text-gray-900/20 group-hover:text-gold-500 group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Video Player View
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container-content py-8">
        {/* Back to course list */}
        <button
          onClick={handleBackToList}
          className="inline-flex items-center text-gray-500 hover:text-gold-500 transition-colors mb-6"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Course
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentModule?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Video Player */}
              <div className="glass-card p-2 mb-6 glow-gold">
                <div className="relative aspect-video bg-gray-50 rounded-xl overflow-hidden">
                  {currentModule?.videoUrl ? (
                    <>
                      <video
                        ref={videoRef}
                        src={currentModule.videoUrl}
                        className="w-full h-full object-contain"
                        controls={isPlaying}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => {
                          setIsPlaying(false);
                          // Auto-mark as complete when video ends
                          if (currentModule && !completedModules.includes(currentModule.id)) {
                            markComplete(currentModule.id);
                          }
                        }}
                      />
                      {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50">
                          <button
                            onClick={() => {
                              setIsPlaying(true);
                              videoRef.current?.play();
                            }}
                            className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center hover:scale-105 transition-transform glow-gold group"
                          >
                            <Play className="text-gray-900 ml-1 group-hover:scale-110 transition" size={32} />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500">Video not available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Module Info */}
              <div className="glass-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${
                        currentModule?.isBonus ? 'text-gold-500' : 'text-gray-400'
                      }`}>
                        {currentModule?.label}
                      </span>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Clock size={12} className="mr-1" />
                        {currentModule?.duration}
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentModule?.title}
                    </h1>
                    <p className="mt-3 text-gray-500">{currentModule?.description}</p>
                  </div>

                  {currentModule && !completedModules.includes(currentModule.id) ? (
                    <button
                      onClick={() => markComplete(currentModule.id)}
                      disabled={isSyncing}
                      className="btn-primary btn-sm shrink-0 disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Mark Complete'
                      )}
                    </button>
                  ) : (
                    <span className="flex items-center text-success-400 font-medium shrink-0">
                      <CheckCircle className="mr-2" size={18} />
                      Completed
                    </span>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => setActiveModule(Math.max(0, activeModule - 1))}
                    disabled={activeModule === 0}
                    className="btn-secondary btn-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </button>
                  <button
                    onClick={() => setActiveModule(Math.min(modules.length - 1, activeModule + 1))}
                    disabled={activeModule === modules.length - 1}
                    className="btn-primary btn-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next Module
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Module List */}
          <div className="lg:col-span-1">
            <div className="glass-card p-5 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">
                All Modules
              </h2>

              {/* Progress mini */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gold-500">{progress}%</span>
                </div>
                <div className="progress-bar h-1.5">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
                {modules.map((module) => {
                  const isCompleted = completedModules.includes(module.id);
                  const isActive = module.id === activeModule;

                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gold-500/10 border border-gold-500/30'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-medium ${
                            isCompleted
                              ? 'bg-success-500/20 text-success-400'
                              : isActive
                                ? 'bg-gold-500/20 text-gold-500'
                                : 'bg-gray-50 text-gray-500'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle size={14} />
                          ) : (
                            <span>{module.id}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm truncate ${
                            isActive ? 'text-gold-500' : 'text-gray-600'
                          }`}>
                            {module.title}
                          </div>
                          <div className="text-xs text-gray-400">{module.duration}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
