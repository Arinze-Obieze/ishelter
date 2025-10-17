import { FaCheckCircle } from "react-icons/fa"

export default function BudgetStats({ budgetData, paidAmount, formatCurrency, calculateStrokeDasharray }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Budget Overview</h2>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-fit ${budgetData.statusColor}`}>
          <FaCheckCircle className={budgetData.status === "Healthy" ? "text-green-600" : "text-yellow-600"} />
          <span className="text-sm font-medium">{budgetData.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6">
        {/* Budget Items */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Total Project Budget</p>
          <p className="text-base md:text-2xl font-bold text-gray-900">
            {formatCurrency(budgetData.total)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Amount Spent</p>
          <p className="text-base md:text-2xl font-bold text-orange-500">
            {formatCurrency(budgetData.spent)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Amount Paid (Invoices)</p>
          <p className="text-base md:text-2xl font-bold text-green-600">
            {formatCurrency(paidAmount)}
          </p>
        </div>

        {/* Interactive Progress Chart */}
        <div className="hidden md:flex md:items-center md:justify-center relative group">
          <div className="relative w-32 h-32 cursor-pointer">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Background circle */}
              <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="16" fill="none" />
              {/* Paid amount (green) */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#10b981"
                strokeWidth="16"
                fill="none"
                strokeDasharray={calculateStrokeDasharray(paidAmount / budgetData.total)}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              {/* Spent but not paid (orange) - starts where paid ends */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#f97316"
                strokeWidth="16"
                fill="none"
                strokeDasharray={calculateStrokeDasharray((budgetData.spent - paidAmount) / budgetData.total)}
                strokeDashoffset={-calculateStrokeDasharray(paidAmount / budgetData.total).split(' ')[0]}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {Math.round((budgetData.spent / budgetData.total) * 100) || 0}%
              </span>
              <span className="text-sm text-gray-500">Spent</span>
            </div>
          </div>
          
          {/* Tooltip on hover */}
          <div className="absolute top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 z-10 w-48">
            <div className="mb-1">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Paid: {formatCurrency(paidAmount)}
            </div>
            <div className="mb-1">
              <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
              Unpaid: {formatCurrency(budgetData.spent - paidAmount)}
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
              Remaining: {formatCurrency(budgetData.remaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart - Mobile */}
      <div className="flex justify-center md:hidden mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="16" fill="none" />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#10b981"
              strokeWidth="16"
              fill="none"
              strokeDasharray={calculateStrokeDasharray(paidAmount / budgetData.total)}
              strokeLinecap="round"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#f97316"
              strokeWidth="16"
              fill="none"
              strokeDasharray={calculateStrokeDasharray((budgetData.spent - paidAmount) / budgetData.total)}
              strokeDashoffset={-calculateStrokeDasharray(paidAmount / budgetData.total).split(' ')[0]}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {Math.round((budgetData.spent / budgetData.total) * 100) || 0}%
            </span>
            <span className="text-sm text-gray-500">Spent</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Legend */}
      <div className="md:hidden grid grid-cols-3 gap-3 text-xs">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span>Paid</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
          <span>Unpaid</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
          <span>Remaining</span>
        </div>
      </div>
    </div>
  )
}