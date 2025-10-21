   <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={postInput}
            onChange={(e) => setPostInput(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button className="bg-primary hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap">
            <FiSend className="w-4 h-4" />
            <span className="hidden sm:inline">Push Post</span>
            <span className="sm:hidden">Post</span>
          </button>
        </div>
      </div>