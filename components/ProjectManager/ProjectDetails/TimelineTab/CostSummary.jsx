"use client"

export default function CostSummary({ budgetSummary, isMobile = false }) {
  return (
    <div className={`bg-amber-500 rounded-lg p-4 ${isMobile ? 'mb-4' : 'p-6 mx-6 mt-6'} text-white`}>
      <h2 className="text-sm font-medium mb-3">Cost Reconciliation Summary</h2>
      <div className={`grid ${isMobile ? 'grid-cols-3 gap-3' : 'grid-cols-3 gap-8'}`}>
        <div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold ${isMobile ? 'mb-0' : 'mb-1'}`}>
            ₦{budgetSummary.totalBudget.toLocaleString()}
          </div>
          <div className="text-xs opacity-90">Total Budget</div>
        </div>
        <div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold ${isMobile ? 'mb-0' : 'mb-1'}`}>
            ₦{budgetSummary.costIncurred.toLocaleString()}
          </div>
          <div className="text-xs opacity-90">{isMobile ? 'Cost Incurred' : 'Spent'}</div>
        </div>
        <div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold ${isMobile ? 'mb-0' : 'mb-1'}`}>
            ₦{budgetSummary.remainingBudget.toLocaleString()}
          </div>
          <div className="text-xs opacity-90">Remaining</div>
        </div>
      </div>
    </div>
  )
}