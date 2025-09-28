export const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "N/A"
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  export const formatLastLogin = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "Never"
    
    const now = new Date()
    const loginDate = timestamp.toDate()
    const diffTime = Math.abs(now - loginDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
    if (diffDays === 1) {
      return `Today, ${loginDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`
    } else if (diffDays === 2) {
      return `Yesterday, ${loginDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`
    } else {
      return formatDate(timestamp)
    }
  }