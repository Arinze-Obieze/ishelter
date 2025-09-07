import { FaUserTie, FaWhatsapp } from 'react-icons/fa'

const SuccessManagerCard = () => {
  return (
   <div className="bg-white rounded-lg shadow-sm p-4 ">
          <div className="flex items-center gap-3 mb-3">
            <FaUserTie className="text-yellow-500 text-xl" />
            <div>
              <p className="text-lg font-bold ">Success Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/testimonial/1.png"
              alt="Michael Adebayo"
              className="w-10 h-10 rounded-full object-cover"
            />
                      <div className="flex flex-col ml-2">
                      <p className="text-sm text-gray-500">+234-90-123-456</p>
  
  <p className="font-medium text-gray-800">Michael Adebayo</p>
                      </div>
  
          </div>
          <button className="w-full bg-orange-50 text-orange-600 font-medium rounded-lg py-2 border border-orange-200 hover:bg-orange-100 flex items-center justify-center gap-2">
            <FaWhatsapp /> Start a Chat
          </button>
        </div>
  )
}

export default SuccessManagerCard
