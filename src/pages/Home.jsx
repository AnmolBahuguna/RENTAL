import React from 'react'
import { Hero } from '../components/home/Hero'
import { HeroCarousel } from '../components/home/HeroCarousel'
import { FeaturedSection, PropertySection } from '../components/home/PropertySection'

export const Home = () => {
  return (
    <div className="bg-white">
      <Hero />
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-16">
          <HeroCarousel />
        </div>
        <FeaturedSection />
        <PropertySection title="Premium Rooms" type="Room" emoji="🛏️" />
        <PropertySection title="Spacious Flats" type="Flat" emoji="🏢" />
        <PropertySection title="Affordable PGs" type="PG" emoji="🏠" />
      </div>
    </div>
  )
}
