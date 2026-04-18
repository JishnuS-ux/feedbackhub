import { Link } from 'react-router-dom';
import { MessageSquarePlus, LayoutDashboard, ArrowRight } from 'lucide-react';

function Home() {
  const admin = JSON.parse(localStorage.getItem('adminInfo') || 'null');

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
      <div className="absolute top-0 -z-10 h-full w-full overflow-hidden bg-white dark:bg-gray-900">
        <div className="absolute left-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full bg-blue-400/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-400/20 blur-[100px]" />
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="animate-slide-up mb-4 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
          ✨ The Ultimate Feedback Management Platform
        </div>

        <h1 className="animate-slide-up delay-100 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white md:text-6xl">
          Turn Customer Feedback <br className="hidden md:block" /> Into{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Growth
          </span>
        </h1>

        <p className="animate-slide-up delay-200 mx-auto max-w-2xl text-xl text-gray-500 dark:text-gray-400">
          Collect, analyze, and act on customer feedback with a platform designed
          for modern teams.
        </p>

        <div className="animate-slide-up delay-300 flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
          <Link
            to={admin ? `/submit/${admin._id}` : '/admin/login'}
            className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-blue-500/50 dark:bg-blue-500 dark:hover:bg-blue-600 sm:w-auto"
          >
            <MessageSquarePlus size={24} />
            {admin ? 'Submit Feedback' : 'Login to Submit'}
          </Link>

          <Link
            to={admin ? '/admin/dashboard' : '/admin/login'}
            className="group flex w-full transform items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-blue-500 sm:w-auto"
          >
            <LayoutDashboard
              size={24}
              className="text-gray-500 transition-colors group-hover:text-blue-500"
            />
            {admin ? 'View Dashboard' : 'Login to View Dashboard'}
            <ArrowRight
              size={20}
              className="ml-2 text-gray-400 transition-colors group-hover:text-blue-500"
            />
          </Link>
        </div>
      </div>

      <div className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-8 px-4 text-left md:grid-cols-3">
        {[
          {
            title: 'Seamless Collection',
            desc: 'Beautiful, conversion-optimized forms that users love to fill out.',
            icon: '📝',
            delay: 'delay-400',
          },
          {
            title: 'Real-time Analytics',
            desc: 'Instantly visualize sentiment and feature requests with dynamic charts.',
            icon: '📊',
            delay: 'delay-500',
          },
          {
            title: 'Actionable Insights',
            desc: 'Collaborate with your team to review, filter, and resolve issues fast.',
            icon: '🚀',
            delay: 'delay-600',
          },
        ].map((feat, i) => (
          <div
            key={i}
            className={`animate-slide-up ${feat.delay} card p-6 transition-colors duration-300 hover:border-blue-500/50`}
          >
            <div className="mb-4 text-3xl">{feat.icon}</div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
              {feat.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;