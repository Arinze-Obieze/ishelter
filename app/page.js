import CoreServices from '@/components/CoreServices'
import CTASection from '@/components/Cta'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Solution from '@/components/Solution'
import Testimonials from '@/components/Testimonial'
import WhoWeServe from '@/components/WhoWeServe'
import Why from '@/components/WhyChoose'
import React from 'react'

const Home = () => {
  return (
 <>
 <Header/>

<div className=''>
<Hero/>

<section className='max-w-7xl md:mt-[196px] mx-auto justify-center '>
 <Solution/>
</section>

<section className='mb-20'>
 <CoreServices/>
</section>

<section>
<Why/>
</section>


<section>
 <WhoWeServe/>
</section>

<section>
 <Testimonials/>
</section>
<section>
 <CTASection/>
</section>

</div>
<footer>
  <Footer/>
</footer>
 </>
  )
}

export default Home
