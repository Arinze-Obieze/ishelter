import React, { useState } from 'react';
import { useFlutterwave, FlutterWaveButton } from 'flutterwave-react-v3';
import { 
  FaArrowLeft, 
  FaShieldAlt, 
  FaLock, 
  FaCheckCircle, 
  FaBuilding,
  FaRegCreditCard
} from 'react-icons/fa';
import { 
  RiVisaFill, 
  RiMastercardFill,
  RiSecurePaymentLine
} from 'react-icons/ri';
import { 
  SiPaypal 
} from 'react-icons/si';
import { 
  IoIosWarning,
  IoMdLock
} from 'react-icons/io';
import { BsBank } from "react-icons/bs";

export default function Step3({ user, amount = 299, email, onPaymentSuccess, onBack }) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY || 'FLWPUBK_TEST-1da39de61954ff74937b544250cf90bc-X',
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: 'USD',
    payment_options: 'card,ussd,banktransfer',
    customer: {
      email: email || user?.email || '',
      name: user?.fullName || '',
    },
    customizations: {
      title: 'Consultation Payment',
      description: 'Payment for consultation package',
      logo: '/logo.svg',
    },
  };

  const handleSuccess = (response) => {
    setIsProcessing(false);
    if (response.status === 'successful') {
      onPaymentSuccess && onPaymentSuccess(response);
    }
  };

  const handlePaymentInitiation = () => {
    setIsProcessing(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center lg:justify-start gap-2">
          <FaRegCreditCard className="text-primary" />
          Complete Your Purchase
        </h1>
        <p className="text-gray-600 mt-2">Final step to secure your consultation</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Order Summary */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaBuilding className="text-primary" />
                Order Summary
              </h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 rounded-lg p-3 flex-shrink-0">
                  <FaBuilding className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">LandFit Consultation</h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    Our entry-level consultation to assess your land's viability and provide initial guidance for your construction project.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="text-gray-800">${amount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-bold text-lg text-primary">${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Security & Trust Indicators */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center border border-gray-100">
              <FaLock className="text-green-500 text-xl mb-2" />
              <p className="text-sm font-medium text-gray-800">SSL Secure</p>
              <p className="text-xs text-gray-500">256-bit encryption</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center border border-gray-100">
              <FaShieldAlt className="text-blue-500 text-xl mb-2" />
              <p className="text-sm font-medium text-gray-800">Payment Protection</p>
              <p className="text-xs text-gray-500">Money-back guarantee</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center border border-gray-100">
              <FaCheckCircle className="text-purple-500 text-xl mb-2" />
              <p className="text-sm font-medium text-gray-800">Trusted</p>
              <p className="text-xs text-gray-500">1000+ happy clients</p>
            </div>
          </div>

         
        </div>
        
        {/* Right Column - Payment Action */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <RiSecurePaymentLine className="text-primary" />
              Complete Payment
            </h3>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <IoMdLock className="text-blue-600" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-blue-600">
                Your payment information is encrypted and secure. We do not store your card details.
              </p>
            </div>
            
            {/* Accepted Payment Methods */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">We accept:</p>
              <div className="flex gap-3">
                <div className="bg-gray-100 p-2 rounded-lg border border-gray-200">
                  <RiVisaFill className="text-blue-800 text-2xl" />
                </div>
                <div className="bg-gray-100 p-2 rounded-lg border border-gray-200">
                  <RiMastercardFill className="text-red-500 text-2xl" />
                </div>
                <div className="bg-gray-100 p-2 rounded-lg border border-gray-200">
                  <BsBank className="text-blue-500 text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Payment Button */}
            <div className="mb-4">
              {isProcessing ? (
                <button 
                  disabled
                  className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-all"
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </button>
              ) : (
                <FlutterWaveButton
                  {...config}
                  text={`Pay $${amount.toFixed(2)} Securely`}
                  callback={handleSuccess}
                  onClose={() => setIsProcessing(false)}
                  onClick={handlePaymentInitiation}
                  className="w-full bg-primary hover:bg-orange-500 cursor-pointer text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 flex items-center justify-center gap-2"
                />
              )}
            </div>
            
            <p className="text-xs text-gray-500 text-center mb-6">
              By completing your purchase, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
            
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 text-sm w-full py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <FaArrowLeft /> Back to previous step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}