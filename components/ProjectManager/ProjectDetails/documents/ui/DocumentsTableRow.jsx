import { BsThreeDotsVertical } from "react-icons/bs";
import { ActionsMenu } from '@/components/ProjectManager/ProjectDetails/documents/ui/ActionsMenu';
import { getFileIcon } from '@/utils/DocumentUtils';

export const DocumentsTableRow = ({ 
  doc, 
  index, 
  showActionsMenu, 
  setShowActionsMenu, 
  onEditCategory, 
  onDelete 
}) => {
  return (
    <tr key={doc.id || index} className="hover:bg-gray-50">
      {/* Name Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          {getFileIcon(doc.type)}
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{doc.name}</div>
            {doc.size && <div className="text-xs text-gray-500">{doc.size}</div>}
          </div>
        </div>
      </td>
      
      {/* Category Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
          {doc.category || 'General'}
        </span>
      </td>
      
      {/* Uploader Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{doc.uploader}</div>
          <div className="text-xs text-gray-500 truncate">{doc.uploaderRole}</div>
        </div>
      </td>
      
      {/* Date Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
      
      {/* Status Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded text-sm font-medium ${
          doc.statusColor === 'orange' ? 'bg-orange-50 text-orange-700' :
          doc.statusColor === 'green' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {doc.status}
        </span>
      </td>
      
      {/* Actions Column */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button 
            onClick={() => setShowActionsMenu(showActionsMenu === index ? null : index)}
            className="text-gray-400 hover:text-gray-600"
          >
            <BsThreeDotsVertical className="w-5 h-5" />
          </button>
          
          <ActionsMenu
            isOpen={showActionsMenu === index}
            onClose={() => setShowActionsMenu(null)}
            document={doc}
            onEditCategory={onEditCategory}
            onDelete={onDelete}
          />
        </div>
      </td>
    </tr>
  );
};