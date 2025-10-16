import React from 'react'
import { IoChatbubbleOutline, IoDocumentOutline, IoDocumentTextOutline } from 'react-icons/io5'

const QuickAccess = () => {
  return (
   <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <IoDocumentOutline className="text-primary text-xl" />
                  <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
                </div>
                <div className="grid grid-cols-3 gap-4 [&>*]:cursor-pointer">
                  <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <IoDocumentTextOutline className="text-orange-500 text-2xl" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium">Documents</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <IoChatbubbleOutline className="text-orange-500 text-2xl" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium">Chat</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <IoDocumentTextOutline className="text-orange-500 text-2xl" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium">Invoices</span>
                  </button>
                </div>
              </div>
  )
}

export default QuickAccess
