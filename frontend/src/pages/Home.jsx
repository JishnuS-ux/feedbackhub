import { Link } from 'react-router-dom';
import { MessageSquarePlus, LayoutDashboard, ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
      {/* Background Gradient Effect */}
      <div className="absolute top-0 w-full h-full overflow-hidden -z-10 bg-white dark:bg-gray-900">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[100px]" />
      </div>

      <div className="space-y-6 max-w-3xl">
        <div className="animate-slide-up inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 mb-4">
          ✨ The Ultimate Feedback Management Platform
        </div>
        
        <h1 className="animate-slide-up delay-100 text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Turn Customer Feedback <br className="hidden md:block" /> Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Growth</span>
        </h1>
        
        <p className="animate-slide-up delay-200 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Collect, analyze, and act on customer feedback with a platform designed for modern teams.
        </p>
        
        <div className="animate-slide-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            to="/submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1"
          >
            <MessageSquarePlus size={24} />
            Submit Feedback
          </Link>
          
          <Link
            to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 font-semibold text-lg transition-all shadow-sm transform hover:-translate-y-1 group"
          >
            <LayoutDashboard size={24} className="text-gray-500 group-hover:text-blue-500 transition-colors" />
            View Dashboard
            <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors ml-2" />
          </Link>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto text-left w-full px-4">
        {[
          { title: 'Seamless Collection', desc: 'Beautiful, conversion-optimized forms that users love to fill out.', icon: '📝', delay: 'delay-400' },
          { title: 'Real-time Analytics', desc: 'Instantly visualize sentiment and feature requests with dynamic charts.', icon: '📊', delay: 'delay-500' },
          { title: 'Actionable Insights', desc: 'Collaborate with your team to review, filter, and resolve issues fast.', icon: '🚀', delay: 'delay-600' },
        ].map((feat, i) => (
          <div key={i} className={`animate-slide-up ${feat.delay} card p-6 hover:border-blue-500/50 transition-colors duration-300`}>
            <div className="text-3xl mb-4">{feat.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feat.title}</h3>
            <p className="text-gray-500 dark:text-gray-400">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
