// components/ProjectManager/ProjectDetails/documents/Documents.js
import { useProjects } from '@/contexts/ProjectContext';
import { useUsers } from '@/contexts/UserContext';
import { useEffect, useState } from "react"
import {
  AiOutlineSearch,
  AiOutlineCloudUpload,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineFolder,
} from "react-icons/ai"
import { IoChevronDown } from "react-icons/io5"
import { db, storage, auth } from "@/lib/firebase"
import { doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import TabsNavigation from '@/components/ProjectManager/ProjectDetails/TabsNavigation';
import { EditCategoryModal } from '@/components/ProjectManager/ProjectDetails/documents/ui/EditCategoryModal';
import { EditStatusModal } from '@/components/ProjectManager/ProjectDetails/documents/ui/EditStatusModal';
import { CategoryModal } from '@/components/ProjectManager/ProjectDetails/documents/ui/CategoryModal';
import { DocumentsTableHead } from '@/components/ProjectManager/ProjectDetails/documents/ui/DocumentsTableHead';
import { DocumentsTableRow } from '@/components/ProjectManager/ProjectDetails/documents/ui/DocumentsTableRow';
import { DocumentCard } from '@/components/ProjectManager/ProjectDetails/documents/ui/DocumentCard';
import { FilterButtons } from '@/components/ProjectManager/ProjectDetails/documents/ui/FilterButtons';
import { DeleteModal } from '@/components/ProjectManager/ProjectDetails/documents/ui/DeleteModal';

export default function DocumentsTab({ projectId, tabs, activeTab, onTabChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending Approval"); // Default status
  const [newCategory, setNewCategory] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const { projects } = useProjects();
  const { users } = useUsers();
  const [documents, setDocuments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [documentToEditStatus, setDocumentToEditStatus] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser({
            uid: user.uid,
            ...userDoc.data()
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const project = projects.find((p) => p.id === projectId);
    setDocuments(project?.documents || []);
    setCategories(project?.documentCategories || ["General", "Contracts", "Reports", "Drawings"]);
  }, [projects, projectId, isUploading]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedStatus("Pending Approval"); // Reset to default
      setShowCategoryModal(true);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    const updatedCategories = [...categories, newCategory.trim()];
    setCategories(updatedCategories);
    
    try {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        documentCategories: updatedCategories
      });
      setSelectedCategory(newCategory.trim());
      setNewCategory("");
      setIsCreatingCategory(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedCategory || !selectedStatus) return;

    setIsUploading(true);
    setShowCategoryModal(false);

    try {
      const storageRef = ref(storage, `projects/${projectId}/documents/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);

      const uploaderName = currentUser?.displayName || currentUser?.name || currentUser?.email || 'Unknown User';
      const uploaderRole = currentUser?.role || 'User';

      // Determine status color based on selected status
      const statusColor = selectedStatus === "Pending Approval" ? "orange" : "green";

      const newDocument = {
        name: selectedFile.name,
        type: selectedFile.type.split("/").pop() || selectedFile.name.split('.').pop(),
        size: `${(selectedFile.size / 1024).toFixed(1)} KB`,
        uploader: uploaderName,
        uploaderRole: uploaderRole,
        uploaderId: currentUser?.uid || null,
        date: new Date().toLocaleString(),
        uploadDate: new Date(),
        status: selectedStatus,
        statusColor: statusColor,
        category: selectedCategory,
        url: downloadURL,
      };
      
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        documents: arrayUnion(newDocument),
      });

      setSelectedFile(null);
      setSelectedCategory("");
      setSelectedStatus("Pending Approval"); // Reset to default
    } catch (error) {
      console.error("Error uploading file: ", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    setIsDeleting(true);
    try {
      const storageRef = ref(storage, `projects/${projectId}/documents/${documentToDelete.name}`);
      await deleteObject(storageRef);

      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        documents: arrayRemove(documentToDelete)
      });

      setShowDeleteModal(false);
      setDocumentToDelete(null);
      setShowActionsMenu(null);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!documentToEdit || !editCategory) return;

    try {
      const updatedDocument = {
        ...documentToEdit,
        category: editCategory
      };

      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        documents: arrayRemove(documentToEdit)
      });
      await updateDoc(projectRef, {
        documents: arrayUnion(updatedDocument)
      });

      setShowEditCategoryModal(false);
      setDocumentToEdit(null);
      setEditCategory("");
      setShowActionsMenu(null);
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  const handleUpdateStatus = async () => {
    if (!documentToEditStatus || !editStatus) return;

    try {
      // Determine status color based on selected status
      const statusColor = editStatus === "Pending Approval" ? "orange" : "green";

      const updatedDocument = {
        ...documentToEditStatus,
        status: editStatus,
        statusColor: statusColor
      };

      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        documents: arrayRemove(documentToEditStatus)
      });
      await updateDoc(projectRef, {
        documents: arrayUnion(updatedDocument)
      });

      setShowEditStatusModal(false);
      setDocumentToEditStatus(null);
      setEditStatus("");
      setShowActionsMenu(null);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const openDeleteModal = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
    setShowActionsMenu(null);
  };

  const openEditCategoryModal = (document) => {
    setDocumentToEdit(document);
    setEditCategory(document.category || "");
    setShowEditCategoryModal(true);
    setShowActionsMenu(null);
  };

  const openEditStatusModal = (document) => {
    setDocumentToEditStatus(document);
    setEditStatus(document.status || "Pending Approval");
    setShowEditStatusModal(true);
    setShowActionsMenu(null);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setSelectedFile(null);
    setSelectedCategory("");
    setSelectedStatus("Pending Approval");
    setIsCreatingCategory(false);
    setNewCategory("");
  };

  const closeEditCategoryModal = () => {
    setShowEditCategoryModal(false);
    setDocumentToEdit(null);
    setEditCategory("");
  };

  const closeEditStatusModal = () => {
    setShowEditStatusModal(false);
    setDocumentToEditStatus(null);
    setEditStatus("");
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.category && doc.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="px-4 md:px-5 py-6 md:py-8">
      {/* Modals */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDocumentToDelete(null);
        }}
        documentToDelete={documentToDelete}
        onConfirm={handleDeleteDocument}
        isDeleting={isDeleting}
      />

      <EditCategoryModal
        isOpen={showEditCategoryModal}
        onClose={closeEditCategoryModal}
        documentToEdit={documentToEdit}
        editCategory={editCategory}
        setEditCategory={setEditCategory}
        categories={categories}
        onConfirm={handleUpdateCategory}
      />

      <EditStatusModal
        isOpen={showEditStatusModal}
        onClose={closeEditStatusModal}
        documentToEdit={documentToEditStatus}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        onConfirm={handleUpdateStatus}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={closeCategoryModal}
        selectedFile={selectedFile}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        categories={categories}
        isCreatingCategory={isCreatingCategory}
        setIsCreatingCategory={setIsCreatingCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        onAddCategory={handleAddCategory}
        onUpload={handleFileUpload}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className='md:text-3xl font-bold text-xl'>Project Document</div>
        <div className="flex gap-3 flex-shrink-0 [&>*]:cursor-pointer flex-end">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 text-sm sm:text-base whitespace-nowrap">
            <AiOutlineFolder className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Create Folder</span>
            <span className="sm:hidden">Folder</span>
          </button>
          <button 
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500 rounded-lg text-white font-medium hover:bg-orange-600 disabled:bg-orange-300 text-sm sm:text-base whitespace-nowrap"
          >
            <AiOutlineCloudUpload className="w-4 h-4 flex-shrink-0" />
            {isUploading ? 'Uploading...' : (
              <>
                <span className="hidden sm:inline">Upload File</span>
                <span className="sm:hidden">Upload</span>
              </>
            )}
          </button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      <div className="mb-6 mt-8">
        <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 w-full">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Files and Folders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <FilterButtons />
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg w-full">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-blue-700">Uploading file...</span>
          </div>
        </div>
      )}

      {/* Unified Document List with Media Breakpoints */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        {/* Desktop Table View */}
        <div className="hidden lg:block w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <DocumentsTableHead />
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc, index) => (
                <DocumentsTableRow
                  key={doc.id || index}
                  doc={doc}
                  index={index}
                  showActionsMenu={showActionsMenu}
                  setShowActionsMenu={setShowActionsMenu}
                  onEditCategory={openEditCategoryModal}
                  onEditStatus={openEditStatusModal}
                  onDelete={openDeleteModal}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4 p-4 w-full">
          {filteredDocuments.map((doc, index) => (
            <DocumentCard
              key={doc.id || index}
              doc={doc}
              index={index}
              showActionsMenu={showActionsMenu}
              setShowActionsMenu={setShowActionsMenu}
              onEditCategory={openEditCategoryModal}
              onEditStatus={openEditStatusModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-sm">
              {searchQuery ? 'No documents match your search' : 'No documents uploaded yet'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}