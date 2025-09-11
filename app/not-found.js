'use client';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiTool, FiMail, FiPhone, FiHome } from 'react-icons/fi';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex flex-col items-center justify-center p-6">
      {/* Main Card */}
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-amber-500 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white rounded-full shadow-md">
              <FiTool className="h-10 w-10 text-amber-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Page Under Construction</h1>
          <p className="text-amber-100 mt-2">Error 404 – Page Not Found</p>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Icon & Badge */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-28 w-28 bg-amber-100 rounded-full flex items-center justify-center shadow-inner">
                <FiTool className="h-16 w-16 text-amber-500" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-500 text-white rounded-full px-3 py-1 shadow-md">
                <span className="text-base font-bold">404</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-700 text-center leading-relaxed mb-8">
            Oops! The page you are looking for is still under construction. 
            Our team is working hard to build something amazing for you.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md"
            >
              <FiArrowLeft className="h-5 w-5" />
              Go Back
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 border border-amber-500 text-amber-600 hover:bg-amber-50 font-medium py-3 px-4 rounded-xl transition-all shadow-md"
            >
              <FiHome className="h-5 w-5" />
              Return Home
            </button>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="max-w-lg w-full mt-6 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">Need Help?</h2>
          <p className="text-gray-600 text-center mb-5">
            Our support team is here to assist you with any issues or questions.
          </p>

          <div className="space-y-4">
            <a
              href="tel:+15551234567"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shadow-sm"
            >
              <div className="p-2 bg-amber-500 rounded-full">
                <FiPhone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Call Support</p>
                <p className="text-gray-600 text-sm">(555) 123-4567</p>
              </div>
            </a>

            <a
              href="mailto:support@constructionexample.com"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shadow-sm"
            >
              <div className="p-2 bg-amber-500 rounded-full">
                <FiMail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Email Support</p>
                <p className="text-gray-600 text-sm">support@domain.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-gray-500 text-sm mt-6 text-center">
        © 2023 Construction Company. All rights reserved.
      </p>
    </div>
  );
}
