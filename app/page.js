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

<section className='mb-20' id='services'>
 <CoreServices/>
</section>

<section id="why">
<Why/>
</section>


<section>
 <WhoWeServe/>
</section>

<section id="testimonials">
 <Testimonials/>
</section>
<section>
 <CTASection/>
</section>

</div>
<footer id="contact">
  <Footer/>
</footer>
 </>
  )
}

export default Home
