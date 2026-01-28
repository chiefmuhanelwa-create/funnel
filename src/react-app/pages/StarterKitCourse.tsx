import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Lock, ChevronRight, FileText } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoId?: number;
  isCompleted?: boolean;
}

export default function StarterKitCourse() {
  const { hasAccessToProduct, isLoading } = useMemberAccess();
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const modules: Module[] = [
    { id: 1, title: 'Finding Your Niche', description: 'Discover your unique positioning in the content market', duration: '18 min', videoId: 1 },
    { id: 2, title: 'Understanding Your Audience', description: 'Deep dive into audience research and personas', duration: '22 min', videoId: 2 },
    { id: 3, title: 'Content Strategy Foundations', description: 'Build a content plan that actually works', duration: '25 min', videoId: 3 },
    { id: 4, title: 'The PAIDS Framework Deep Dive', description: 'Master all five pillars of the system', duration: '35 min', videoId: 4 },
    { id: 5, title: 'Monetization Strategies', description: 'Multiple income streams explained', duration: '28 min', videoId: 5 },
    { id: 6, title: 'Brand Partnerships 101', description: 'Land your first (or next) brand deal', duration: '24 min', videoId: 6 },
    { id: 7, title: 'Building Your Distribution', description: 'Get your content seen by the right people', duration: '20 min', videoId: 7 },
    { id: 8, title: 'Systems & Automation', description: 'Scale without burning out', duration: '22 min', videoId: 8 },
    { id: 9, title: 'Launch Your Business', description: 'Action plan to implement everything', duration: '30 min', videoId: 9 },
  ];

  useEffect(() => {
    // Load completed modules from localStorage
    const saved = localStorage.getItem('starterkit-progress');
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
  }, []);

  const markComplete = (moduleId: number) => {
    const updated = [...completedModules, moduleId];
    setCompletedModules(updated);
    localStorage.setItem('starterkit-progress', JSON.stringify(updated));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!hasAccessToProduct('starter-kit')) {
    return <Navigate to="/checkout/starter-kit" replace />;
  }

  const currentModule = modules[activeModule];
  const progress = Math.round((completedModules.length / modules.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Module List */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Contentpreneur Starter Kit
              </h2>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Your Progress</span>
                  <span className="font-medium text-primary-600">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-2">
                {modules.map((module, index) => {
                  const isCompleted = completedModules.includes(module.id);
                  const isActive = index === activeModule;

                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(index)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        isActive
                          ? 'bg-primary-50 border-2 border-primary-500'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isActive
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle size={16} />
                          ) : (
                            <span className="text-sm font-medium">{module.id}</span>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className={`font-medium text-sm ${isActive ? 'text-primary-700' : 'text-gray-900'}`}>
                            {module.title}
                          </div>
                          <div className="text-xs text-gray-500">{module.duration}</div>
                        </div>
                        <ChevronRight className={`text-gray-400 ${isActive ? 'text-primary-500' : ''}`} size={16} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentModule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Video Player */}
              <div className="card p-0 overflow-hidden mb-6">
                <div className="video-container bg-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition group">
                      <Play className="text-white ml-1 group-hover:scale-110 transition" size={32} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Module Info */}
              <div className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-medium text-primary-600">
                      Module {currentModule.id} of {modules.length}
                    </span>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900">
                      {currentModule.title}
                    </h1>
                    <p className="mt-2 text-gray-600">{currentModule.description}</p>
                  </div>
                  {!completedModules.includes(currentModule.id) && (
                    <button
                      onClick={() => markComplete(currentModule.id)}
                      className="btn-primary text-sm"
                    >
                      Mark Complete
                    </button>
                  )}
                  {completedModules.includes(currentModule.id) && (
                    <span className="flex items-center text-green-600 font-medium">
                      <CheckCircle className="mr-2" size={20} />
                      Completed
                    </span>
                  )}
                </div>

                {/* Resources */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Module Resources</h3>
                  <div className="space-y-3">
                    <a
                      href="#"
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <FileText className="text-primary-600 mr-3" size={20} />
                      <span className="font-medium text-gray-900">
                        Module {currentModule.id} Worksheet
                      </span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <FileText className="text-primary-600 mr-3" size={20} />
                      <span className="font-medium text-gray-900">
                        Action Checklist
                      </span>
                    </a>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => setActiveModule(Math.max(0, activeModule - 1))}
                    disabled={activeModule === 0}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous Module
                  </button>
                  <button
                    onClick={() => setActiveModule(Math.min(modules.length - 1, activeModule + 1))}
                    disabled={activeModule === modules.length - 1}
                    className="btn-primary disabled:opacity-50"
                  >
                    Next Module
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
