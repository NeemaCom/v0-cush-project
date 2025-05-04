"use client"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Complete Financial Migration Solution</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Seamlessly transfer your financial life when moving between countries with our comprehensive services.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 font-medium">
            Get Started
          </Link>
          <Link
            href="/services"
            className="px-6 py-3 bg-white text-primary border border-primary rounded-md hover:bg-gray-50 font-medium"
          >
            Explore Services
          </Link>
        </div>
      </div>
    </section>
  )
}
