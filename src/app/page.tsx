'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const eventWords = [
  'Party',
  'Game Night',
  'Dinner',
  'Karaoke Night',
  'Dance Party',
  'Birthday Party',
  'Drinks Night',
  'Movie Night',
  'Brunch',
  'Poker Night',
]

export default function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % eventWords.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <section className="text-center mb-12 max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
          At NamMane
        </h1>

        {/* Rotating Word Display */}
        <div className="h-20 overflow-hidden mb-8">
          <div
            className="transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateY(-${currentWordIndex * 80}px)`,
            }}
          >
            {eventWords.map((word, idx) => (
              <div
                key={idx}
                className="h-20 flex items-center justify-center text-5xl font-bold text-indigo-600"
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          Discover amazing people, great gatherings, and a trusted community.
          Find interesting events nearby or host your own gathering.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/auth/signup"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/discover"
            className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Explore Events
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mb-12">
        <FeatureCard
          icon="🎉"
          title="Easy Discovery"
          description="Browse events in your city, filter by category, and find your vibe."
        />
        <FeatureCard
          icon="🔒"
          title="Trusted Community"
          description="Host verification, approval-based bookings, and safety first."
        />
        <FeatureCard
          icon="💬"
          title="Direct Chat"
          description="Connect with hosts and guests before and during events."
        />
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-600 border-t border-gray-300 pt-8 w-full">
        <p className="mb-4">Version 0.1.0 • Wave 1: Web App</p>
        <p className="text-sm">
          Built for Bengaluru, Mumbai, and Delhi NCR
        </p>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
