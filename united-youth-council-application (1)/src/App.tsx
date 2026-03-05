import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  Globe,
  Sparkles,
  Rocket,
  Mail,
  User,
  MapPin,
  Calendar,
  BookOpen,
  Zap,
  Leaf,
  Users,
  Cpu,
  Droplets,
  Brain,
  Plus,
  Instagram,
  Loader2,
  ChevronRight
} from 'lucide-react';

// --- Types ---
type FormData = {
  fullName: string;
  email: string;
  age: string;
  country: string;
  city: string;
  whyYou: string;
  causes: string[];
  commitment: boolean;
  vision: string;
  workLink: string;
};

const INITIAL_DATA: FormData = {
  fullName: '',
  email: '',
  age: '',
  country: '',
  city: '',
  whyYou: '',
  causes: [],
  commitment: false,
  vision: '',
  workLink: '',
};

const CAUSES = [
  { id: 'education', label: 'Education', emoji: '📚' },
  { id: 'empowerment', label: 'Youth Empowerment', emoji: '💪' },
  { id: 'climate', label: 'Climate Action', emoji: '🌱' },
  { id: 'gender', label: 'Gender Equality', emoji: '👩‍🦱' },
  { id: 'innovation', label: 'Innovation & Tech', emoji: '🤖' },
  { id: 'water', label: 'Clean Water', emoji: '💧' },
  { id: 'mental-health', label: 'Mental Health', emoji: '🧠' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

// --- Components ---

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-6 md:px-12 md:py-8 bg-warm/80 backdrop-blur-sm md:bg-transparent">
      <div className="flex items-center gap-1.5 md:gap-2">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div
            key={step}
            className={`step-bar ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
          />
        ))}
      </div>
      <div className="flex flex-col items-end">
        <div className="text-[9px] md:text-xs font-display font-bold text-secondary uppercase tracking-widest">
          Step {currentStep} of 6
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateStep = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      const ageNum = parseInt(formData.age);
      if (!formData.age || isNaN(ageNum) || ageNum < 13 || ageNum > 100) newErrors.age = 'Age must be between 13-100';
      if (!formData.country.trim()) newErrors.country = 'Please select your country';
      if (!formData.city.trim()) newErrors.city = 'Please enter your city';
    }

    if (step === 3) {
      if (formData.whyYou.length < 10) newErrors.whyYou = 'Please tell us a bit more about yourself (min 10 chars)';
    }

    if (step === 4) {
      if (formData.causes.length === 0) newErrors.causes = 'Please select at least one cause';
    }

    if (step === 5) {
      if (!formData.commitment) newErrors.commitment = 'You must agree to the commitment to proceed';
      if (formData.vision.length < 50) newErrors.vision = 'Please share a bit more of your vision (min 50 chars)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    // Prepare payload matching Apps Script expectations
    const payload = {
      name: formData.fullName,
      email: formData.email,
      age: formData.age,
      country: formData.country,
      city: formData.city,
      whyJoin: formData.whyYou,
      causes: formData.causes,
      commitment: formData.commitment,
      vision: formData.vision,
      portfolio: formData.workLink,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxIxDKT8lHdJBLm5HNsNLkPSnxrbMaTsvDHdtEJRRt5MSsxL7rVqtzipK4vsuVaan8TAQ/exec', {
        method: 'POST',
        mode: 'no-cors', // Apps Script Web Apps accept no-cors; response handling limited
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      // Since no-cors, we cannot read response body; assume success if no error thrown
      console.log('Form submitted');
    } catch (err) {
      console.error('Submission error', err);
      // Optionally, you could set an error state to display to user
    } finally {
      setIsSubmitting(false);
      setStep(6); // Show success screen
    }
  };

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleCause = (causeId: string) => {
    const newCauses = formData.causes.includes(causeId)
      ? formData.causes.filter((id) => id !== causeId)
      : [...formData.causes, causeId];
    updateField('causes', newCauses);
  };

  // --- Animation Variants ---
  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  const containerTransition = {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94]
  };

  return (
    <div className="min-h-screen bg-warm selection:bg-accent selection:text-white overflow-x-hidden">
      {/* Progress Indicator */}
      {step > 1 && step < 6 && <StepIndicator currentStep={step} />}

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={containerTransition}
              className="max-w-4xl w-full text-center space-y-6 md:space-y-8 px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
                className="inline-block"
              >
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <span className="text-3xl md:text-4xl">🌍</span>
                  <span className="text-3xl md:text-4xl">✨</span>
                  <span className="text-3xl md:text-4xl">🚀</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] mb-4 md:mb-6 relative inline-block">
                  BECOME A <br />
                  <span className="text-accent relative">
                    YOUTH UNITER
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                      className="absolute -bottom-1 md:-bottom-2 left-0 h-2 md:h-4 bg-accent/20 -z-10"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
                      className="absolute bottom-0 md:-bottom-1 left-0 h-1 md:h-2 bg-accent"
                    />
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto font-light leading-relaxed"
              >
                Join a global movement of young changemakers dedicated to advocacy and social change.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <button
                  onClick={() => setStep(2)}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent text-white px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-display font-bold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-accent/40"
                  style={{ borderRadius: '0px' }}
                >
                  LET'S GO
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={containerTransition}
              className="max-w-[700px] w-full"
            >
              <div className="glass-card p-6 md:p-12 space-y-6 md:space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl">Let's Get to Know You</h2>
                  <p className="text-secondary">We'll keep this private ✨</p>
                </div>

                <div className="grid gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                      <User className="w-3 h-3 md:w-4 md:h-4" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Your name"
                      className={`w-full h-11 md:h-12 px-4 glass-input text-sm ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 animate-bounce">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                      <Mail className="w-3 h-3 md:w-4 md:h-4" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="hello@example.com"
                      className={`w-full h-11 md:h-12 px-4 glass-input text-sm ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 animate-bounce">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] md:text-sm font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4" /> Age
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateField('age', e.target.value)}
                        placeholder="13-100"
                        className={`w-full h-11 md:h-12 px-4 glass-input text-sm ${errors.age ? 'border-red-500' : ''}`}
                      />
                      {errors.age && <p className="text-xs text-red-500 animate-bounce">{errors.age}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] md:text-sm font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                        <Globe className="w-3 h-3 md:w-4 md:h-4" /> Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        placeholder="Search country..."
                        className={`w-full h-11 md:h-12 px-4 glass-input text-sm ${errors.country ? 'border-red-500' : ''}`}
                      />
                      {errors.country && <p className="text-xs text-red-500 animate-bounce">{errors.country}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] md:text-sm font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" /> City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Your city"
                      className={`w-full h-11 md:h-12 px-4 glass-input text-sm ${errors.city ? 'border-red-500' : ''}`}
                    />
                    {errors.city && <p className="text-xs text-red-500 animate-bounce">{errors.city}</p>}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto text-secondary hover:text-dark font-display font-bold transition-colors text-sm tracking-widest uppercase py-2"
                  >
                    BACK
                  </button>
                  <button
                    onClick={nextStep}
                    className="group w-full sm:w-auto bg-accent text-white px-10 py-5 font-display font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
                    style={{ borderRadius: '0px' }}
                  >
                    CONTINUE
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={containerTransition}
              className="max-w-[700px] w-full"
            >
              <div className="glass-card p-6 md:p-12 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl">Why You?</h2>
                  <p className="text-secondary">Share your passion & story 📖</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium uppercase tracking-wider text-secondary">
                    Why do you want to be a Youth UNITER?
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.whyYou}
                      onChange={(e) => updateField('whyYou', e.target.value.slice(0, 1000))}
                      placeholder="Tell us what drives you..."
                      className={`w-full min-h-[200px] md:min-h-[250px] p-4 md:p-6 glass-input resize-none ${errors.whyYou ? 'border-red-500' : ''}`}
                    />
                    <div className="absolute bottom-4 right-4 text-xs font-mono text-secondary">
                      {formData.whyYou.length}/1000
                    </div>
                  </div>
                  {errors.whyYou && <p className="text-xs text-red-500 animate-bounce">{errors.whyYou}</p>}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={prevStep}
                    className="w-full sm:w-auto text-secondary hover:text-dark font-display font-bold transition-colors text-sm tracking-widest uppercase py-2"
                  >
                    BACK
                  </button>
                  <button
                    onClick={nextStep}
                    className="group w-full sm:w-auto bg-accent text-white px-10 py-5 font-display font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
                    style={{ borderRadius: '0px' }}
                  >
                    CONTINUE
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={containerTransition}
              className="max-w-[700px] w-full"
            >
              <div className="glass-card p-6 md:p-12 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl">Passion & Causes</h2>
                  <p className="text-secondary">Which issues inspire you most? 🔥</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {CAUSES.map((cause) => {
                    const isSelected = formData.causes.includes(cause.id);
                    return (
                      <motion.button
                        key={cause.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleCause(cause.id)}
                        className={`group flex flex-col items-start p-5 md:p-6 transition-all duration-300 border-2 text-left space-y-3 md:space-y-4 ${isSelected
                            ? 'bg-accent/5 border-accent shadow-xl shadow-accent/10'
                            : 'bg-white border-warm/30 hover:border-accent/50'
                          }`}
                        style={{ borderRadius: '0px' }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-2xl md:text-3xl">{cause.emoji}</span>
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="bg-accent text-white px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest"
                              >
                                SELECTED
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="space-y-1">
                          <h3 className={`font-display font-bold text-base md:text-lg ${isSelected ? 'text-accent' : 'text-dark'}`}>
                            {cause.label}
                          </h3>
                          <p className="text-[10px] md:text-xs text-secondary leading-relaxed">
                            Join our efforts to drive meaningful change in {cause.label.toLowerCase()}.
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs md:text-sm font-medium text-secondary">
                  <span>{formData.causes.length} of {CAUSES.length} selected</span>
                  {errors.causes && <span className="text-red-500 animate-pulse">{errors.causes}</span>}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={prevStep}
                    className="w-full sm:w-auto text-secondary hover:text-dark font-display font-bold transition-colors text-sm tracking-widest uppercase py-2"
                  >
                    BACK
                  </button>
                  <button
                    onClick={nextStep}
                    className="group w-full sm:w-auto bg-accent text-white px-10 py-5 font-display font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
                    style={{ borderRadius: '0px' }}
                  >
                    CONTINUE
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={containerTransition}
              className="max-w-[700px] w-full"
            >
              <form onSubmit={handleSubmit} className="glass-card p-6 md:p-12 space-y-8 md:space-y-10">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl">Commitment & Vision</h2>
                  <p className="text-secondary">Let's build the future together 🚀</p>
                </div>

                {/* Section 1: Commitment */}
                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-display uppercase tracking-wider">01. Commitment</h3>
                  <div className="h-40 md:h-48 overflow-y-auto p-4 md:p-6 bg-white border-2 border-warm/30 text-[10px] md:text-xs leading-relaxed text-secondary space-y-4">
                    <p className="font-bold text-dark uppercase tracking-widest">UnitEd Youth Council Participation Agreement</p>
                    <p>By joining the UnitEd Youth Council (UYC), you agree to actively participate in our global movement. This includes attending at least one virtual meeting per month and contributing to our shared advocacy goals.</p>
                    <p>We believe in the power of youth to shape the future. Your commitment is essential to our collective success. You agree to collaborate with peers from diverse backgrounds with respect and empathy.</p>
                    <p>UYC provides a platform for your voice to be heard. In return, we expect you to represent the movement with integrity and passion. Any form of discrimination or harassment will result in immediate removal from the council.</p>
                    <p>We will protect your privacy and handle your data in accordance with our privacy policy. You can unsubscribe from our communications at any time, though this may limit your ability to participate in certain council activities.</p>
                  </div>
                  <label className="flex items-start gap-3 md:gap-4 cursor-pointer group pt-2">
                    <div className="relative mt-1 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={formData.commitment}
                        onChange={(e) => updateField('commitment', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 md:w-6 md:h-6 border-2 transition-all duration-200 ${formData.commitment ? 'bg-accent border-accent' : 'border-warm group-hover:border-accent'
                        }`} style={{ borderRadius: '0px' }}>
                        <AnimatePresence>
                          {formData.commitment && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                              className="flex items-center justify-center h-full"
                            >
                              <Check className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={4} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <span className="text-xs md:text-sm leading-relaxed text-dark select-none">
                      I'm willing to attend virtual meetings, collaborate globally, and actively participate in campaigns.
                    </span>
                  </label>
                  {errors.commitment && <p className="text-xs text-red-500">{errors.commitment}</p>}
                </div>

                {/* Section 2: Vision */}
                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-display uppercase tracking-wider">02. Your Vision</h3>
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-secondary">
                      How do you define youth empowerment and why is it important today?
                    </label>
                    <textarea
                      value={formData.vision}
                      onChange={(e) => updateField('vision', e.target.value)}
                      placeholder="Share your perspective & vision..."
                      className={`w-full min-h-[120px] md:min-h-[150px] p-4 md:p-6 glass-input resize-none ${errors.vision ? 'border-red-500' : ''}`}
                    />
                    <p className="text-[9px] md:text-[10px] text-secondary text-right">Min 50 characters</p>
                    {errors.vision && <p className="text-xs text-red-500">{errors.vision}</p>}
                  </div>
                </div>

                {/* Section 3: Work */}
                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-display uppercase tracking-wider">03. Share Your Work (Optional)</h3>
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-secondary">Link to your work</label>
                    <input
                      type="url"
                      value={formData.workLink}
                      onChange={(e) => updateField('workLink', e.target.value)}
                      placeholder="Portfolio, GitHub, LinkedIn, social links"
                      className="w-full h-11 md:h-12 px-4 glass-input text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full sm:w-auto text-secondary hover:text-dark font-display font-bold transition-colors text-sm tracking-widest uppercase py-2"
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full sm:w-auto bg-accent text-white px-10 py-5 font-display font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-accent/20"
                    style={{ borderRadius: '0px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        SUBMITTING...
                      </>
                    ) : (
                      <>
                        JOIN THE MOVEMENT
                        <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={containerTransition}
              className="max-w-2xl w-full text-center"
            >
              <div className="glass-card p-8 md:p-20 space-y-8 md:space-y-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-20 h-20 md:w-24 md:h-24 bg-accent mx-auto flex items-center justify-center shadow-2xl shadow-accent/40"
                  style={{ borderRadius: '0px' }}
                >
                  <Check className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={4} />
                </motion.div>

                <div className="space-y-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                  >
                    YOU DID IT!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg md:text-xl text-secondary"
                  >
                    We're thrilled you're joining us. <br />
                    Check <span className="text-dark font-bold break-all">{formData.email}</span> for what's next.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="pt-8 space-y-12"
                >
                  <div className="relative overflow-hidden py-4 bg-accent">
                    <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-8">
                          <span className="text-white font-display font-bold uppercase tracking-widest text-sm">FOLLOW US ON INSTAGRAM!</span>
                          <Instagram className="w-4 h-4 text-white" />
                          <span className="text-white font-display font-bold uppercase tracking-widest text-sm">FOLLOW US ON INSTAGRAM!</span>
                          <Instagram className="w-4 h-4 text-white" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <a
                      href="https://instagram.com/UnitEdYouthCouncil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-display font-bold text-lg"
                    >
                      @UnitEdYouthCouncil
                    </a>
                  </div>

                  <button
                    onClick={() => window.location.reload()}
                    className="bg-dark text-white px-10 py-4 font-display font-bold hover:scale-105 active:scale-95 transition-all"
                    style={{ borderRadius: '0px' }}
                  >
                    BACK TO MAIN SITE
                  </button>
                </motion.div>

                <p className="text-[10px] text-secondary uppercase tracking-widest">
                  We'll send updates to your email. Privacy policy here.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {step === 1 ? (
          <div className="absolute inset-0">
            <img
              src="https://picsum.photos/seed/united-youth/1920/1080?blur=2"
              alt="Background"
              className="w-full h-full object-cover opacity-20 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
          </div>
        ) : (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-warm/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-light-accent/30 blur-[150px] rounded-full" />
            <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-accent/5 blur-[100px] rounded-full" />
          </>
        )}
      </div>
    </div>
  );
}
