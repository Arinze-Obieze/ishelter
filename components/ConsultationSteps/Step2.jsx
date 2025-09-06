import { FaArrowRight, FaClipboardList } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";

export default function Step2() {
    const LandFitFeatures=[
        'Compliance & Cost Awareness',
        'Space Analysis (High-Level)',
        'Proposed Layouts',
        'Design Direction',
        'Advisory & Next Steps'
    ]
  return (
 <>
 <div className="mt-28 bg-100">
    <div className="max-w-3xl mb-2">
        <h1 className="text-4xl font-bold text-center text-primary mb-4">Choose Your Consultation Package</h1>
   <p className="text-center text-text text-base mb-8">
   Our consultation packages are designed to give you clarity, uncover hidden costs, and prepare 
   you for a smooth transition into full Design or Construction Management. These are not design 
   services, but pre-project advisory solutions that recover costs while giving you just enough 
   value to move forward confidently.
   </p>
    </div>
 </div>
 

 <div>
    <div>
<div>
    <p className="font-bold text-xs text-primary rounded-4xl bg-yellow-100 w-fit py-2 px-4">STARTER</p>
    <h2 className="font-bold text-2xl">LandFit Consultation</h2>
<p className="text-[#6B7280] font-light text-lg"> <span className="font-bold text-3xl text-primary ">$299</span> one-time</p>
<p className="font-medium text-lg italic">Is my land and idea viable?</p>
</div>
<div className="bg-white max-w-md rounded-xl p-8">
    <div className="flex place-items-center"><FaClipboardList className="text-primary w-5 h-5 mr-2"/> <p className="font-bold text-lg">What You Get:</p></div>

<div>
{LandFitFeatures.map((feature,id)=>{
    return(
        <div key={id} className="">
            <div className="flex place-items-center">
                <HiCheck className="text-primary w-5 h-5 mr-2"/> 
                <p className="font-light text-base text-text">{feature}</p>
                </div>
        </div>
    )
})}
</div>

<button className="bg-gray-100 flex mx-auto justify-center text-center px-4 py-2 font-bold text-base">
    <p>Select This Plan</p>
    <span><FaArrowRight /></span>
     </button>
</div>
    </div>
 </div>
 </>
  );
}
