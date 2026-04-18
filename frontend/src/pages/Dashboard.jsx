import API from "../utils/api";
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Star, Filter, CheckCircle, Clock, Copy } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...inputs) {
  return twMerge(clsx(inputs));
}

const DEFAULT_PRODUCTS = ['Mobile App', 'Web Platform', 'API Service', 'Desktop App'];
const STATUSES = ['All Statuses', 'Pending', 'Resolved'];
const ITEMS_PER_PAGE = 5;

function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('All Products');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');

  const [currentPage, setCurrentPage] = useState(1);

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || 'null');
  const feedbackLink = adminInfo?._id
    ? `http://localhost:5173/submit/${adminInfo._id}`
    : '';

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      const { data } = await axios.get('http://localhost:5000/api/feedback', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFeedbacks(data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';

    try {
      const token = localStorage.getItem('adminToken');

      await axios.put(
        `http://localhost:5000/api/feedback/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedbacks((prev) =>
        prev.map((f) => (f._id === id ? { ...f, status: newStatus } : f))
      );

      toast.success('Status updated');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(feedbackLink);
      toast.success('Feedback link copied');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch =
      search.toLowerCase() === '' ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.message.toLowerCase().includes(search.toLowerCase());

    const matchesProduct =
      productFilter === 'All Products' || f.product === productFilter;

    const matchesStatus =
      statusFilter === 'All Statuses' || f.status === statusFilter;

    const matchesRating =
      ratingFilter === 'All Ratings' || f.rating.toString() === ratingFilter;

    return matchesSearch && matchesProduct && matchesStatus && matchesRating;
  });

  const uniqueProducts = [
    'All Products',
    ...new Set([...DEFAULT_PRODUCTS, ...feedbacks.map((f) => f.product)]),
  ];

  const totalPages = Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE);

  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Feedback Dashboard
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Total {filteredFeedbacks.length} items found
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search feedback..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white md:w-64"
              />
            </div>

            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {uniqueProducts.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="All Ratings">All Ratings</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>
          </div>
        </div>

        {feedbackLink && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Share this feedback link with your customers
            </p>

            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
              <input
                value={feedbackLink}
                readOnly
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              />

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <Copy size={16} />
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Product
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Rating
                  </th>
                  <th className="hidden px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 md:table-cell">
                    Message
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse bg-white dark:bg-gray-800">
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </td>
                      <td className="hidden px-6 py-4 md:table-cell">
                        <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      </td>
                    </tr>
                  ))
                ) : paginatedFeedbacks.length > 0 ? (
                  paginatedFeedbacks.map((item) => (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.email}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {item.product}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < item.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }
                            />
                          ))}
                        </div>
                      </td>

                      <td className="hidden max-w-xs truncate px-6 py-4 text-sm text-gray-600 dark:text-gray-300 md:table-cell">
                        {item.message}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusUpdate(item._id, item.status)}
                          className={cx(
                            'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all hover:opacity-80',
                            item.status === 'Resolved'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          )}
                        >
                          {item.status === 'Resolved' ? (
                            <CheckCircle size={14} />
                          ) : (
                            <Clock size={14} />
                          )}
                          {item.status}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                          <Filter size={32} />
                        </div>
                        <p className="text-lg font-medium">No feedback found</p>
                        <p className="text-sm">
                          Try adjusting your filters or search term
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredFeedbacks.length)}
              </span>{' '}
              of <span className="font-medium">{filteredFeedbacks.length}</span>{' '}
              results
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Previous
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;