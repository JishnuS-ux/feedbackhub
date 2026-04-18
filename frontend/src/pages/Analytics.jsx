import API from "../utils/api";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { MessageSquare, Star, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

function Analytics() {
  const { isDarkMode } = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      const { data } = await axios.get(`${API}/api/feedback`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFeedbacks(data);
    } catch (error) {
      console.error('Failed to fetch analytics data', error);
    } finally {
      setLoading(false);
    }
  };

  const totalFeedback = feedbacks.length;
  const avgRating =
    totalFeedback > 0
      ? (
          feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedback
        ).toFixed(1)
      : '0.0';

  const resolvedCount = feedbacks.filter((f) => f.status === 'Resolved').length;
  const pendingCount = feedbacks.filter((f) => f.status === 'Pending').length;

  const ratingData = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating} Star`,
    count: feedbacks.filter((f) => f.rating === rating).length,
  }));

  const productCounts = feedbacks.reduce((acc, curr) => {
    acc[curr.product] = (acc[curr.product] || 0) + 1;
    return acc;
  }, {});

  const productData = Object.keys(productCounts).map((name) => ({
    name,
    value: productCounts[name],
  }));

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="card flex items-center justify-between p-6">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </h4>
      </div>
      <div className={`rounded-full p-4 ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Overview
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Data insights across your feedback
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Feedback"
          value={loading ? '-' : totalFeedback}
          icon={MessageSquare}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          title="Average Rating"
          value={loading ? '-' : `${avgRating} / 5`}
          icon={Star}
          colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
        <StatCard
          title="Resolved"
          value={loading ? '-' : resolvedCount}
          icon={CheckCircle}
          colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          title="Pending"
          value={loading ? '-' : pendingCount}
          icon={Clock}
          colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
            Rating Distribution
          </h3>

          {loading ? (
            <div className="flex h-72 items-center justify-center text-gray-400">
              Loading chart...
            </div>
          ) : ratingData.some((d) => d.count > 0) ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                  />
                  <XAxis
                    dataKey="rating"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                    dy={10}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                    dx={-10}
                  />
                  <RechartsTooltip
                    cursor={{ fill: isDarkMode ? '#374151' : '#f3f4f6' }}
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                      borderRadius: '8px',
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
            Feedback by Product
          </h3>

          {loading ? (
            <div className="flex h-72 items-center justify-center text-gray-400">
              Loading chart...
            </div>
          ) : productData.length > 0 ? (
            <div className="flex h-72 flex-col justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                  >
                    {productData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                      borderRadius: '8px',
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;