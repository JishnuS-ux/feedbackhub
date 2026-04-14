import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Star, Filter, CheckCircle, Clock } from 'lucide-react';
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
  
  // Filters
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('All Products');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/feedback');
      setFeedbacks(data);
    } catch (error) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';
    try {
      await axios.put(`http://localhost:5000/api/feedback/${id}`, { status: newStatus });
      setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status: newStatus } : f));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // derived state
  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch = search.toLowerCase() === '' || 
      f.name.toLowerCase().includes(search.toLowerCase()) || 
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.message.toLowerCase().includes(search.toLowerCase());
      
    const matchesProduct = productFilter === 'All Products' || f.product === productFilter;
    const matchesStatus = statusFilter === 'All Statuses' || f.status === statusFilter;
    const matchesRating = ratingFilter === 'All Ratings' || f.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesProduct && matchesStatus && matchesRating;
  });

  // dynamic product list
  const uniqueProducts = ['All Products', ...new Set([...DEFAULT_PRODUCTS, ...feedbacks.map(f => f.product)])];

  const totalPages = Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feedback Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Total {filteredFeedbacks.length} items found</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all"
            />
          </div>
          
          <select
            value={productFilter}
            onChange={(e) => { setProductFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none hover:cursor-pointer"
          >
            {uniqueProducts.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none hover:cursor-pointer"
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none hover:cursor-pointer"
          >
            <option value="All Ratings">All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Name</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Product</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Rating</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">Message</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Date</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white dark:bg-gray-800">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                    <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div></td>
                  </tr>
                ))
              ) : paginatedFeedbacks.length > 0 ? (
                paginatedFeedbacks.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.product}</td>
                    <td className="px-6 py-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell max-w-xs truncate">
                      {item.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusUpdate(item._id, item.status)}
                        className={cx(
                          "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all hover:opacity-80",
                          item.status === 'Resolved' 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        )}
                      >
                        {item.status === 'Resolved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        {item.status}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
                        <Filter size={32} />
                      </div>
                      <p className="text-lg font-medium">No feedback found</p>
                      <p className="text-sm">Try adjusting your filters or search term</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */
        totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredFeedbacks.length)}</span> of <span className="font-medium">{filteredFeedbacks.length}</span> results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
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
