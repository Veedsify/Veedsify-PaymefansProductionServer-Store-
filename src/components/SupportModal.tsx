"use client";
import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    toast.loading("Sending message...", { id: "support-submit" });

    try {
      const response = await axios.post("/api/contact", {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      if (response.data.error) {
        toast.error(response.data.message || "Failed to send message", {
          id: "support-submit",
        });
      } else {
        toast.success(
          "Message sent successfully! We'll get back to you soon.",
          {
            id: "support-submit",
          },
        );
        setFormData({ name: "", email: "", message: "" });
        onClose();
      }
    } catch (error: any) {
      console.error("Error submitting support form:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again.",
        { id: "support-submit" },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[400] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[450] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Contact Support
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Fill out the form below and we'll get back to you soon.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label
                htmlFor="support-name"
                className="block mb-1 text-sm font-semibold text-gray-900 dark:text-gray-200"
              >
                Name
              </label>
              <input
                type="text"
                id="support-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-200 outline-none dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:border-pink-600 dark:focus:border-pink-600 focus:ring-2 focus:ring-pink-600/30 transition-all"
                placeholder="Your Name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label
                htmlFor="support-email"
                className="block mb-1 text-sm font-semibold text-gray-900 dark:text-gray-200"
              >
                Email
              </label>
              <input
                type="email"
                id="support-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-200 outline-none dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:border-pink-600 dark:focus:border-pink-600 focus:ring-2 focus:ring-pink-600/30 transition-all"
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label
                htmlFor="support-message"
                className="block mb-1 text-sm font-semibold text-gray-900 dark:text-gray-200"
              >
                Message
              </label>
              <textarea
                id="support-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-200 outline-none resize-none dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:border-pink-600 dark:focus:border-pink-600 focus:ring-2 focus:ring-pink-600/30 transition-all"
                placeholder="How can we help you?"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
