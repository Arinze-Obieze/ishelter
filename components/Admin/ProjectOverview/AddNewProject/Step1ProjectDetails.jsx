import { email } from 'zod';
import FormField from './FormField'
import ProjectUserSearchBox from "./ProjectUserSearchBox";
import { useState } from "react";

export default function Step1ProjectDetails({ formData, setFormData, isSubmitting }) {
  // Add state for selected users
  const [selectedUsers, setSelectedUsers] = useState(formData.projectUsers || []);

  // Keep formData in sync with selected users
  const handleUsersChange = (users) => {
    setSelectedUsers(users);
    setFormData({ ...formData, projectUsers: users.map(u => ({ email: u.email, id: u.id || u.uid })) });
  };

  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b-2 border-orange-500">
        Project & Client Details
      </h2>

      <div className="space-y-4 sm:space-y-6">
        <ProjectUserSearchBox
          selectedUsers={selectedUsers}
          setSelectedUsers={handleUsersChange}
          disabled={isSubmitting}
        />

        <FormField
          label="Project Name"
          required
          input={
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter project name"
              disabled={isSubmitting}
            />
          }
        />

        <FormField
          label="Short Description"
          required
          input={
            <textarea
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Enter project description"
              disabled={isSubmitting}
            />
          }
        />

        <FormField
          label="Project Address/Location"
          required
          input={
            <input
              type="text"
              value={formData.projectAddress}
              onChange={(e) => setFormData({ ...formData, projectAddress: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter project address"
              disabled={isSubmitting}
            />
          }
        />
      </div>
    </div>
  )
}