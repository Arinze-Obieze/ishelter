import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
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
  IoMdLock
} from 'react-icons/io';
import { BsBank } from "react-icons/bs";


export default function Step3({ user, amount = 299, email, onPaymentSuccess, onBack, isSubmitting, registrationId }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  

if(!registrationId) {
return toast.error("Missing registration ID. Please go back and try again. or contact support");
}
if(!user) {
  return toast.error("Missing user data. Please go back and try again. or contact support");
  }
  const handleFlutterwavePay = () => {
    setIsProcessing(true);
    if (!document.getElementById("flutterwave-script")) {
      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.id = "flutterwave-script";
      script.async = true;
      script.onload = () => triggerFlutterwavePayment();
      document.body.appendChild(script);
    } else {
      triggerFlutterwavePayment();
    }
  };

const triggerFlutterwavePayment = () => {
  window.FlutterwaveCheckout({
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
    tx_ref: `${registrationId}-${Date.now()}`,
    amount: amount,
    currency: "USD",
    payment_options: "banktransfer,card",
    customer: {
      email: email || user?.email || '',
      name: user?.fullName || '',
      phonen_umber: user?.phone || '',
    },
    customizations: {
      title: "iSHELTER Consultation",
      description: `Payment for ${user?.plan || 'LandFit Consultation'}`,
      logo: "/logo.svg",
    },
    callback: async function (response) {
      setIsProcessing(true);
      try {
        // Call verify-payment API
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tx_ref: response.tx_ref,
            transaction_id: response.transaction_id,
            registrationId,
            amount,
          }),
        });
        
        const data = await res.json();
        console.log("Payment verification result:", data);
        if (data.status === "success") {
          toast.success("Payment successful! Redirecting...");
          // Call the success handler to update the registration
          await onPaymentSuccess();
          setTimeout(() => {
            router.push("/payment-success");
          }, 300);
        } else {
          toast.error(data.error || "Payment not compeleted.");
        }
      } catch (e) {
        console.error("Payment verification error:", e);
        toast.error("Payment verification failed.");
      } finally {
        setIsProcessing(false);
      }
    },
    onclose: function () {
      setIsProcessing(false);
    },
  });
};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center lg:justify-start gap-2">
          <FaRegCreditCard className="text-primary" />
          Complete Your Purchase
        </h1>
        <p className="text-gray-600 mt-2">Final step to secure your consultation</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
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
                  <h3 className="text-lg font-semibold text-gray-800">{user?.plan || 'LandFit Consultation'}</h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {user?.plan === 'BuildPath Consultation' 
                      ? 'Comprehensive consultation with detailed planning and roadmap'
                      : 'Initial consultation to assess your land\'s viability and provide guidance'
                    }
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
              <p className="text-xs text-gray-500">Secure payments</p>
            </div>
          </div>
        </div>
        
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
            
            <div className="mb-4">
              <button 
                onClick={handleFlutterwavePay}
                disabled={isProcessing || isSubmitting}
                className="w-full bg-primary hover:bg-orange-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>Pay ${amount.toFixed(2)} Securely</>
                )}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mb-6">
              By completing your purchase, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
            
            <button
              onClick={onBack}
              disabled={isProcessing || isSubmitting}
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 text-sm w-full py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              <FaArrowLeft /> Back to previous step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}