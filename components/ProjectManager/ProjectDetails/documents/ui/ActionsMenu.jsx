import { AiOutlineClose } from "react-icons/ai";

export const ActionsMenu = ({ 
  isOpen, 
  onClose, 
  document, 
  onEditCategory, 
  onEditStatus, 
  onDelete 
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      label: 'Download',
      condition: document.url,
      onClick: () => window.open(document.url, '_blank'),
      className: 'text-gray-700 hover:bg-gray-100'
    },
    {
      label: 'Change Category',
      condition: true,
      onClick: () => onEditCategory(document),
      className: 'text-gray-700 hover:bg-gray-100'
    },
    {
      label: 'Edit Status',
      condition: true,
      onClick: () => onEditStatus(document),
      className: 'text-gray-700 hover:bg-gray-100'
    },
    {
      label: 'Delete',
      condition: true,
      onClick: () => onDelete(document),
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  return (
    <>
      <div 
        className="fixed md:absolute inset-0 z-50" 
        onClick={onClose}
      ></div>
      <div className="absolute md:flex md:flex-col right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
        {menuItems.map((item, index) => 
          item.condition ? (
            <button
              key={index}
              onClick={item.onClick}
              className={`w-full text-left px-4 py-2 text-sm ${item.className}`}
            >
              {item.label}
            </button>
          ) : null
        )}
      </div>
    </>
  );
};