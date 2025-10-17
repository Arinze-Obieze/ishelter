"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa"

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState("verifying") // verifying, success, failed
  const [message, setMessage] = useState("")
  const [invoiceDetails, setInvoiceDetails] = useState(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const transaction_id = searchParams.get("transaction_id")
      const tx_ref = searchParams.get("tx_ref")
      const invoiceId = searchParams.get("invoiceId")

      if (!transaction_id || !tx_ref) {
        setStatus("failed")
        setMessage("Invalid payment parameters")
        return
      }

      try {
        // Note: The webhook will handle the actual verification and DB update
        // This page just confirms the payment for the user
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transaction_id,
            tx_ref,
            invoiceId: invoiceId || tx_ref.split("-")[1], // Extract from tx_ref if not provided
          }),
        })

        const data = await response.json()

        if (data.status === "success") {
          setStatus("success")
          setMessage("Payment confirmed successfully!")
          setInvoiceDetails(data.details)
        } else {
          setStatus("failed")
          setMessage(data.error || "Payment verification failed")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("failed")
        setMessage("An error occurred during verification")
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <div className="flex justify-center mb-4">
              <FaSpinner className="text-primary text-6xl animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-5xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            
            {invoiceDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Invoice:</span> {invoiceDetails.invoiceNumber}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Amount:</span> ₦{Number(invoiceDetails.amount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Transaction ID:</span> {searchParams.get("transaction_id")}
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mb-6">
              A confirmation email has been sent to your registered email address.
            </p>
            
            <button
              onClick={() => router.push("/")}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Return to Dashboard
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <FaTimesCircle className="text-red-600 text-5xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}