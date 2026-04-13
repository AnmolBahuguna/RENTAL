import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ChevronRight, User, Briefcase, 
  Home, Building2, School, Hotel,
  Check, Sparkles, MapPin, IndianRupee
} from 'lucide-react'
import { PROPERTY_TYPES, CITIES } from '../../utils/constants'
import { Button } from '../ui/Button'

const QUIZ_STEPS = [
  {
    id: 'persona',
    title: 'Welcome to GoEazy!',
    subtitle: 'Who are you?',
    options: [
      { id: 'student', label: 'Student', icon: School, desc: 'Looking for budget-friendly PGs or Hostels near campus.' },
      { id: 'professional', label: 'Professional', icon: Briefcase, desc: 'Searching for peaceful flats or rooms near work.' }
    ]
  },
  {
    id: 'type',
    title: 'Your Vibe',
    subtitle: 'What kind of stay do you prefer?',
    options: PROPERTY_TYPES.map(t => ({ 
      id: t, 
      label: t, 
      icon: t === 'Room' ? Home : t === 'Flat' ? Building2 : t === 'Hostel' ? Hotel : User 
    }))
  },
  {
    id: 'city',
    title: 'The Where',
    subtitle: 'Which city are you moving to?',
    cities: CITIES
  },
  {
    id: 'budget',
    title: 'The Budget',
    subtitle: 'What is your monthly budget?',
    ranges: [
      { id: 'budget', label: 'Budget Friendly', range: [0, 8000], desc: 'Below ₹8,000' },
      { id: 'mid', label: 'Mid-Range', range: [8000, 15000], desc: '₹8,000 - ₹15,000' },
      { id: 'premium', label: 'Premium', range: [15000, 25000], desc: '₹15,000 - ₹25,000' },
      { id: 'luxury', label: 'Luxury', range: [25000, 100000], desc: '₹25,000+' }
    ]
  }
]

export const OnboardingQuiz = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState({
    persona: '',
    type: '',
    city: '',
    budget: null
  })

  useEffect(() => {
    const isDone = localStorage.getItem('goeazy_onboarding_done')
    if (!isDone) {
      // Delay it slightly for a better feel
      const timer = setTimeout(() => setIsOpen(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNext = () => {
    if (step < QUIZ_STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    localStorage.setItem('goeazy_onboarding_done', JSON.stringify({
      ...selections,
      timestamp: new Date().getTime()
    }))
    setIsOpen(false)
    // Dispatch a custom event so other components can listen if needed
    window.dispatchEvent(new Event('goeazy_recommendations_updated'))
  }

  if (!isOpen) return null

  const currentStep = QUIZ_STEPS[step]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Quiz Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex gap-1 p-1">
          {QUIZ_STEPS.map((_, i) => (
            <div key={i} className={`h-full flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#CA3433]' : 'bg-gray-100'}`} />
          ))}
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#CA3433] text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles size={12} /> Step {step + 1} of 4
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{currentStep.title}</h2>
                <p className="text-gray-500 font-medium">{currentStep.subtitle}</p>
              </div>

              {/* Persona Step */}
              {currentStep.id === 'persona' && (
                <div className="grid grid-cols-1 gap-4">
                  {currentStep.options.map(opt => {
                    const Icon = opt.icon
                    const active = selections.persona === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelections(s => ({ ...s, persona: opt.id }))}
                        className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${active ? 'border-[#CA3433] bg-red-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-[#CA3433] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold transition-colors ${active ? 'text-[#CA3433]' : 'text-gray-900'}`}>{opt.label}</h4>
                          <p className="text-xs text-gray-400">{opt.desc}</p>
                        </div>
                        {active && <Check size={20} className="text-[#CA3433]" />}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Property Type Step */}
              {currentStep.id === 'type' && (
                <div className="grid grid-cols-2 gap-4">
                  {currentStep.options.map(opt => {
                    const Icon = opt.icon
                    const active = selections.type === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelections(s => ({ ...s, type: opt.id }))}
                        className={`flex flex-col items-start gap-4 p-5 rounded-2xl border-2 transition-all ${active ? 'border-[#CA3433] bg-red-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-[#CA3433] text-white' : 'bg-gray-50 text-gray-400'}`}>
                          <Icon size={20} />
                        </div>
                        <h4 className={`font-bold ${active ? 'text-[#CA3433]' : 'text-gray-900'}`}>{opt.label}</h4>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Location Step */}
              {currentStep.id === 'city' && (
                <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentStep.cities.map(city => {
                    const active = selections.city === city
                    return (
                      <button
                        key={city}
                        onClick={() => setSelections(s => ({ ...s, city: city }))}
                        className={`group flex items-center gap-3 p-4 rounded-xl border transition-all text-sm font-bold ${active ? 'border-[#CA3433] bg-red-50 text-[#CA3433]' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                      >
                        <MapPin size={16} className={active ? 'text-[#CA3433]' : 'text-gray-300'} />
                        {city}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Budget Step */}
              {currentStep.id === 'budget' && (
                <div className="space-y-3">
                  {currentStep.ranges.map(r => {
                    const active = selections.budget?.id === r.id
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelections(s => ({ ...s, budget: r }))}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${active ? 'border-[#CA3433] bg-red-50' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <IndianRupee size={16} className={active ? 'text-[#CA3433]' : 'text-gray-400'} />
                          <div className="text-left">
                            <p className={`text-sm font-bold ${active ? 'text-gray-900' : 'text-gray-600'}`}>{r.label}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{r.desc}</p>
                          </div>
                        </div>
                        {active && <div className="w-5 h-5 rounded-full bg-[#CA3433] flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
            <button 
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip
            </button>
            <Button 
              disabled={!selections[currentStep.id]}
              onClick={handleNext}
              variant="primary" 
              className="rounded-full px-8 py-3 bg-[#CA3433] hover:bg-[#ac2d2c] shadow-lg shadow-red-500/20 group"
            >
              <span className="flex items-center gap-2">
                {step === QUIZ_STEPS.length - 1 ? 'Find My Perfect Match' : 'Next Step'}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
