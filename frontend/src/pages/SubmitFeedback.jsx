import API from "../utils/api";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

const PRODUCTS = ['Mobile App', 'Web Platform', 'API Service', 'Desktop App'];

function SubmitFeedback() {
  const { adminId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    product: '',
    rating: 0,
    message: ''
  });
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rating) {
      toast.error('Please provide a rating');
      return;
    }

    if (!adminId) {
      toast.error('Invalid feedback link');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API}/api/feedback/${adminId}`, formData);

      toast.success('Feedback submitted successfully!');

      setFormData({
        name: '',
        email: '',
        product: '',
        rating: 0,
        message: ''
      });

      setHoveredStar(0);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            We value your feedback
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm">
            Help us improve by sharing your experience with our products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Product / Service
            </label>
            <input
              type="text"
              name="product"
              list="products-list"
              value={formData.product}
              onChange={handleChange}
              placeholder="Select or type category..."
              className="mt-2 w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition"
              required
            />
            <datalist id="products-list">
              {PRODUCTS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Rating
            </label>
            <div className="flex gap-3 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition hover:scale-110"
                >
                  <Star
                    size={34}
                    className={`${
                      star <= (hoveredStar || formData.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Feedback Message
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us your experience..."
              className="mt-2 w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-xl bg-slate-900 text-white font-semibold text-base shadow-md hover:bg-slate-800 transition disabled:opacity-70 flex justify-center items-center"
          >
            {isSubmitting ? (
              <span className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              'Submit Feedback'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="mt-2 w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition"
      />
    </div>
  );
}

export default SubmitFeedback;