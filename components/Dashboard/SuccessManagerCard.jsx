import { FaUserTie, FaWhatsapp } from "react-icons/fa";

const SuccessManagerCard = () => {
  const successManagers = [
    // {
    //   id: 1,
    //   name: "Michael Adebayo",
    //   phone: "+234-90-123-456",
    //   image: "/testimonial/1.png",
    // },
  ]; 

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 ">
      <div className="flex items-center gap-3 mb-3">
        <FaUserTie className="text-yellow-500 text-xl" />
        <div>
          <p className="text-lg font-bold">Success Manager</p>
        </div>
      </div>

      {successManagers.length > 0 ? (
        successManagers.map((manager) => (
          <div key={manager.id} className="mb-3">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={manager.image}
                alt={manager.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col ml-2">
                <p className="text-sm text-gray-500">{manager.phone}</p>
                <p className="font-medium text-gray-800">{manager.name}</p>
              </div>
            </div>

            <a
              href={`https://wa.me/${manager.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-orange-50 text-orange-600 font-medium rounded-lg py-2 border border-orange-200 hover:bg-orange-100 flex items-center justify-center gap-2"
            >
              <FaWhatsapp /> Start a Chat
            </a>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center text-center gap-3">
         <div className="flex place-items-center md:space-x-6">
         <img
            src="/placeholder.jpg"
            alt="No Success Manager"
            className="w-12 h-12 rounded-full object-cover opacity-70"
          />
          <p className="text-xs text-center max-w-[200px] text-gray-500">
            A success manager will be assigned to you shortly.
          </p>
         </div>
          <button
            disabled
            className="w-full bg-gray-100 text-gray-400 font-medium rounded-lg py-2 border border-gray-200 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FaWhatsapp /> Start a Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessManagerCard;
