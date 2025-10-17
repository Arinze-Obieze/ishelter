import { BsThreeDotsVertical } from "react-icons/bs";
import { ActionsMenu } from './ActionsMenu';
import { getFileIcon } from '@/utils/DocumentUtils';

export const DocumentCard = ({ 
  doc, 
  index, 
  showActionsMenu, 
  setShowActionsMenu, 
  onEditCategory, 
  onDelete, 
  onEditStatus
}) => {
  const menuId = `mobile-${index}`;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 break-words">{doc.name}</div>
              {doc.size && <div className="text-xs text-gray-500 mt-0.5">{doc.size}</div>}
            </div>
            <div className="relative ml-2 flex-shrink-0">
              <button 
                onClick={() => setShowActionsMenu(showActionsMenu === menuId ? null : menuId)}
                className="text-gray-400 hover:text-gray-600"
              >
                <BsThreeDotsVertical className="w-5 h-5" />
              </button>

              <ActionsMenu
  isOpen={showActionsMenu === menuId}
  onClose={() => setShowActionsMenu(null)}
  document={doc}
  onEditCategory={onEditCategory}
  onEditStatus={onEditStatus} 
  onDelete={onDelete}
/>
            </div>
          </div>
          
          <div className="mt-2 mb-3">
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {doc.category || 'General'}
            </span>
          </div>

          {/* Mobile-specific details */}
          <div className="space-y-2.5 text-sm mt-3">
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Uploader:</div>
              <div className="font-semibold text-gray-900 truncate">{doc.uploader}</div>
              <div className="text-xs text-gray-500 truncate">{doc.uploaderRole}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Date:</div>
              <div className="text-sm text-gray-900">{doc.date}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Status:</div>
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                doc.statusColor === 'orange' ? 'bg-orange-50 text-orange-700' :
                doc.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {doc.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};