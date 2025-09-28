const Badge = ({ children, variant = "default", className = "" }) => {
    const baseClasses = "inline-block px-2 py-1 rounded-full text-xs font-medium"
    
    const variantClasses = {
      default: "bg-gray-100 text-gray-700",
      role: {
        admin: "bg-blue-100 text-blue-700",
        "success manager": "bg-green-100 text-green-700",
        successmanager: "bg-green-100 text-green-700",
        client: "bg-orange-100 text-orange-700"
      },
      status: {
        Active: "bg-green-100 text-green-700",
        Inactive: "bg-gray-100 text-gray-500",
        Suspended: "bg-red-100 text-red-700"
      }
    }
  
    const getVariantClass = () => {
      if (variant === "role" || variant === "status") {
        return variantClasses[variant][children] || variantClasses.default
      }
      return variantClasses.default
    }
  
    return (
      <span className={`${baseClasses} ${getVariantClass()} ${className}`}>
        {children}
      </span>
    )
  }
  
  export default Badge