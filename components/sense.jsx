import {
    FaFile,
    FaFilePdf,
    FaFileExcel,
    FaFileWord,
    FaFileArchive,
    FaFileVideo,
    FaEye,
    FaDownload,
    FaFilter,
  } from "react-icons/fa"
  
  const FileManager = () => {
    const tabs = [
      { name: "All Documents", count: 15, active: true },
      { name: "Contracts & Legal", count: 4, active: false },
      { name: "Architectural Plans", count: 3, active: false },
      { name: "Invoices & Receipts", count: 2, active: false },
      { name: "Reports", count: 1, active: false },
      { name: "Photos & Videos", count: 2, active: false },
    ]
  
    const getFileIcon = (fileName) => {
      const extension = fileName.split(".").pop().toLowerCase()
      switch (extension) {
        case "pdf":
          return <FaFilePdf className="text-red-500 text-xl" />
        case "xlsx":
        case "xls":
          return <FaFileExcel className="text-green-500 text-xl" />
        case "docx":
        case "doc":
          return <FaFileWord className="text-blue-500 text-xl" />
        case "zip":
          return <FaFileArchive className="text-purple-500 text-xl" />
        case "mp4":
          return <FaFileVideo className="text-purple-500 text-xl" />
        default:
          return <FaFile className="text-gray-500 text-xl" />
      }
    }
  
    const FileItem = ({ fileName, uploadDate, fileSize, section }) => (
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          {getFileIcon(fileName)}
          <div>
            <div className="font-medium text-gray-900">{fileName}</div>
            <div className="text-sm text-gray-500">
              📅 Uploaded {uploadDate} • 📄 {fileSize}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
            <FaEye />
          </button>
          <button className="p-2 text-orange-500 hover:text-orange-600 rounded">
            <FaDownload />
          </button>
        </div>
      </div>
    )
  
    const sections = [
      {
        title: "Contracts & Legal",
        icon: "📋",
        files: [
          { name: "Initial-Client-Agreement.pdf", date: "Jun 15, 2023", size: "2.1 MB" },
          { name: "Terms-and-Conditions.pdf", date: "Jun 15, 2023", size: "1.8 MB" },
        ],
      },
      {
        title: "Architectural Plans",
        icon: "📐",
        files: [
          { name: "Floor-Plan-Ground-Level.pdf", date: "Jun 16, 2023", size: "4.7 MB" },
          { name: "Electrical-Layout-V2.pdf", date: "Jun 20, 2023", size: "3.2 MB" },
          { name: "Plumbing-Schematic.pdf", date: "Jun 20, 2023", size: "2.8 MB" },
        ],
      },
      {
        title: "Invoices & Receipts",
        icon: "🧾",
        files: [
          { name: "Invoice-009-Initial-Payment.pdf", date: "Jun 22, 2023", size: "1.1 MB" },
          { name: "Project-Cost-Breakdown.xlsx", date: "Jun 25, 2023", size: "890 KB" },
        ],
      },
      {
        title: "Reports",
        icon: "📊",
        files: [{ name: "Site-Inspection-Report-June.docx", date: "Jun 30, 2023", size: "3.1 MB" }],
      },
      {
        title: "Photos & Videos",
        icon: "📷",
        files: [
          { name: "Site-Progress-Photos-Week1.zip", date: "Jun 16, 2023", size: "67.1 MB" },
          { name: "Foundation-Pouring-Video.mp4", date: "Jun 25, 2023", size: "156.3 MB" },
        ],
      },
    ]
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex space-x-8">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                    tab.active
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="font-medium">{tab.name}</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{tab.count}</span>
                </button>
              ))}
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">
              <FaFilter />
              <span>Filter</span>
            </button>
          </div>
        </div>
  
        {/* File Sections */}
        <div className="px-6 py-6 space-y-8">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 px-6 py-4 border-b border-gray-100">
                <span className="text-lg">{section.icon}</span>
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              </div>
              <div className="px-6 py-2">
                {section.files.map((file, fileIndex) => (
                  <FileItem
                    key={fileIndex}
                    fileName={file.name}
                    uploadDate={file.date}
                    fileSize={file.size}
                    section={section.title}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default FileManager
  