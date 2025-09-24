import Link from "next/link";

export default function PaymentSuccess() {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">iSHELTER</h1>
            {/* <div className="w-full h-1 bg-orange-500 rounded"></div> */}
          </div>
  
          {/* Success Card */}
          <div className="bg-white border-t-3 border-t-primary rounded-lg shadow-sm p-8 mb-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
  
            {/* Success Message */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Thank you for choosing iSHELTER! Your consultation request has been received and your payment has been
                successfully processed. We're excited to help you bring your construction project to life.
              </p>
            </div>
  
            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* What Happens Next */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-6 h-6 bg-orange-500 rounded mr-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">What Happens Next</h3>
                </div>
  
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                      1
                    </div>
                    <div>
                      <p className="text-gray-700">
                        You will receive a confirmation email with your receipt and login details within the next 5
                        minutes.
                      </p>
                    </div>
                  </div>
  
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                      2
                    </div>
                    <div>
                      <p className="text-gray-700">
                        One of our expert consultants will contact you within 24-48 hours to schedule your consultation
                        session.
                      </p>
                    </div>
                  </div>
  
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                      3
                    </div>
                    <div>
                      <p className="text-gray-700">
                        Prior to your consultation, you'll receive a preparation guide to help you get the most out of
                        your session.
                      </p>
                    </div>
                  </div>
  
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                      4
                    </div>
                    <div>
                      <p className="text-gray-700">
                        After your consultation, you'll have access to a summary report in your iSHELTER dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Payment Summary */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-6 h-6 bg-orange-500 rounded mr-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Payment Summary</h3>
                </div>
  
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Premium Consultation</h4>
                    </div>
  
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="text-gray-800">May 15, 2023</span>
                    </div>
  
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <div className="text-right">
                        <div className="text-gray-800">Visa ****</div>
                        <div className="text-gray-500 text-sm">4242</div>
                      </div>
                    </div>
  
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">Total</span>
                        <span className="font-bold text-xl text-gray-800">$179.00</span>
                      </div>
                    </div>
  
                    <div className="text-xs text-gray-500">Transaction ID: 7924484500</div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/dashboard">
            <button className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                Go to Dashboard
              </button>
              </Link>
            <Link href="/">
            <button className="text-gray-600 px-8 py-3 rounded-lg font-medium hover:text-gray-800 transition-colors">
                Back to Homepage
              </button>
              </Link>
            </div>
          </div>
  
          {/* Need Help Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your consultation or payment, our support team is ready to assist you.
            </p>
            <a href="mailto:support@ishelter.com" className="text-orange-500 hover:text-orange-600 font-medium">
              support@ishelter.com
            </a>
          </div>
        </div>
      </div>
    )
  }
  