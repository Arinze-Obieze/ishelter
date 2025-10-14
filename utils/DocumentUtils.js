import {
    AiOutlineFolder,
    AiOutlineFilePdf,
    AiOutlineFileZip,
    AiOutlineFile,
  } from "react-icons/ai"
  
  export const getFileIcon = (type) => {
    const iconProps = { className: "w-3 h-3 text-white" };
    
    const iconConfig = {
      folder: { bg: "bg-orange-500", icon: <AiOutlineFolder {...iconProps} /> },
      pdf: { bg: "bg-red-500", icon: <AiOutlineFilePdf {...iconProps} /> },
      zip: { bg: "bg-purple-500", icon: <AiOutlineFileZip {...iconProps} /> },
      dwg: { bg: "bg-cyan-500", icon: <AiOutlineFile {...iconProps} /> },
      default: { bg: "bg-blue-500", icon: <AiOutlineFile {...iconProps} /> }
    };
  
    const config = iconConfig[type] || iconConfig.default;
    
    return (
      <div className={`w-5 h-5 ${config.bg} rounded flex items-center justify-center`}>
        {config.icon}
      </div>
    );
  };
  
  export const filterOptions = [
    { key: 'types', label: 'All Types' },
    { key: 'categories', label: 'All Categories' },
    { key: 'date', label: 'Sort by Date' }
  ];