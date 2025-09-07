import {FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"
import { FiGrid } from "react-icons/fi";

const StatsOverview = () => {
  return (
   <section className="bg-white rounded-lg p-6 w-full max-w-[1248px] mx-auto mt-6">
         <h2 className="flex items-center mb-6 text-gray-800 font-semibold text-lg">
           <FiGrid  className="text-primary mr-2 font-bold" />
           Your Projects
         </h2>
   
         <div className="grid grid-cols-4 gap-6">
           {/* Total Projects */}
           <div className="bg-white rounded-lg p-4 shadow-sm">
             <div className="p-2 rounded-md bg-blue-100 inline-block mb-3">
               <FiGrid className="text-blue-600" />
             </div>
             <p className="text-gray-600 text-sm">Total Projects</p>
             <p className="font-bold text-lg text-gray-900">5</p>
           </div>
   
           {/* Active Projects */}
           <div className="bg-white rounded-lg p-4 shadow-sm">
             <div className="p-2 rounded-md bg-orange-100 inline-block mb-3">
               <FaClock className="text-orange-400" />
             </div>
             <p className="text-gray-600 text-sm">Active Projects</p>
             <p className="font-bold text-lg text-gray-900">3</p>
           </div>
   
           {/* Completed */}
           <div className="bg-white rounded-lg p-4 shadow-sm">
             <div className="p-2 rounded-md bg-green-100 inline-block mb-3">
               <FaCheckCircle className="text-green-500" />
             </div>
             <p className="text-gray-600 text-sm">Completed</p>
             <p className="font-bold text-lg text-gray-900">1</p>
           </div>
   
           {/* Needs Attention */}
           <div className="bg-white rounded-lg p-4 shadow-sm">
             <div className="p-2 rounded-md bg-red-100 inline-block mb-3">
               <FaExclamationCircle className="text-red-500" />
             </div>
             <p className="text-gray-600 text-sm">Needs Attention</p>
             <p className="font-bold text-lg text-gray-900">1</p>
           </div>
         </div>
       </section>
  )
}

export default StatsOverview
