export const DocumentsTableHead = () => {
    const headers = [
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'uploader', label: 'Uploader' },
      { key: 'date', label: 'Date' },
      { key: 'status', label: 'Status' },
      { key: 'actions', label: 'Actions' }
    ];
  
    return (
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header) => (
            <th 
              key={header.key}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
    );
  };