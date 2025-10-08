export default function FormField({ label, required, input, description }) {
    return (
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        {input}
        {description && (
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    )
  }


  