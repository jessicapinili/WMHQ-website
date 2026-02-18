import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_STATE } from './constants';
import { AppState } from './types';
import EditableText from './components/EditableText';

const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b border-black/5 last:border-none transition-all duration-300 ${isOpen ? 'accordion-open' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-8 px-8 text-left group hover:bg-black/[0.01] transition-colors"
      >
        <span className="text-xl md:text-2xl font-serif italic text-black/80">{title}</span>
        <div className={`w-8 h-8 rounded-full border border-black/10 flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0V12M0 6H12" stroke="black" strokeWidth="1.5"/>
          </svg>
        </div>
      </button>
      <div className="accordion-content">
        <div className="px-8 pb-10 text-lg text-gray-500 font-light leading-relaxed max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  );
};

const DarkAccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-black/10 rounded-[20px] bg-transparent overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-6 px-8 text-left group hover:bg-black/[0.02] transition-colors"
      >
        <span className="text-base md:text-lg font-serif font-bold tracking-[0.2em] text-[#7c1d1d] uppercase">{title}</span>
        <div className={`w-8 h-8 rounded-full border border-black/10 flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0V12M0 6H12" stroke="#7c1d1d" strokeOpacity="0.6" strokeWidth="1.5"/>
          </svg>
        </div>
      </button>
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-8 pb-8 text-lg text-black/70 font-light leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

const PricingBullet: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex gap-4 items-start py-1 text-left">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c1d1d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-1 flex-shrink-0">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span className="text-[14px] text-gray-600 font-light leading-snug">{text}</span>
  </li>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [activeInclusion, setActiveInclusion] = useState('Business Mastermind');
  const [activePhase, setActivePhase] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const carouselItems = [
    {
      title: "The rhythm of a membership",
      body: "You’re not guessing your way through growth anymore. You get live calls, hot seats, and a training vault stacked with the exact answers you keep Googling at midnight. It’s the kind of support that pays for itself because you stop wasting time doing it the slow way."
    },
    {
      title: "The depth of a course",
      body: "These aren’t “watch and forget” modules. They’re the kind of trainings you binge because they finally explain the why behind your stuck points — and the how behind fixing them. You walk away actually doing the thing… not just thinking about it."
    },
    {
      title: "The support of a mastermind",
      body: "When your brain spirals, your content flops, or your offer suddenly feels like a terrible idea… you’re not alone. You get real-time feedback, real-time fixes, and real-time “here’s what to do next” so you move forward instead of melting down."
    },
    {
      title: "The energy of a private, unfiltered space",
      body: "This is where ambitious women talk honestly — not the Instagram-friendly, “everything’s fine” version. It’s raw, safe, and zero-performance. You come in with a block and walk out with a breakthrough."
    }
  ];

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, offsetWidth } = carouselRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setCarouselIndex(index);
    }
  };

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.scrollWidth / carouselItems.length;
      carouselRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
      setCarouselIndex(index);
    }
  };

  const nextCard = () => scrollToCard((carouselIndex + 1) % carouselItems.length);
  const prevCard = () => scrollToCard((carouselIndex - 1 + carouselItems.length) % carouselItems.length);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsModalOpen(false);
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isModalOpen]);

  const updateSection = (section: keyof AppState, key: string, val: string) => {
    setState(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section]) 
        ? { ...prev[section], [key]: val }
        : prev[section]
    }));
  };

  const inclusions = {
    'Business Mastermind': 'Live strategy calls to refine messaging, offers, launches, and sales systems so your revenue becomes predictable and scalable.',
    'Subconscious Calls': 'Identity and nervous system calls to remove the self-sabotage that shows up when visibility, money, or momentum increases.',
    'The Vault': 'On-demand trainings across Influence, Visibility, Cash, and Identity: step-by-step frameworks you can implement immediately.',
    'Live Trainings': 'Deep-dive workshops on specific growth levers (launching, pricing, positioning, scaling) delivered in real time.',
    'ASK JP': 'Direct access for weekly personalised audits, blind-spot correction, and strategic decision support.',
    'Community': 'High-level women building real businesses: accountability, proximity, and standards that elevate your execution.',
    'Tools': 'Templates, dashboards, calculators, and systems that turn ideas into revenue without reinventing the wheel.'
  };

  const phases = [
    {
      id: 1,
      title: "Phase 1: Influence",
      intro: "You stop sounding like everyone else in your industry and start sounding like the obvious choice.",
      bullets: [
        "Write hooks that make your ideal client stop mid-scroll and think, “How does she know exactly what I’m going through?”",
        "Position your offers so buying feels like the relief & obvious answer they’ve been searching for — not another thing to justify to their partner.",
        "Craft a one-liner that makes other founders at that conference immediately ask, “Wait, how are you doing that?”",
        "Build messaging that attracts decision-makers with budgets and repels people who were “just curious.”",
        "Sound unmistakably like you. Not a mashup of the 47 other women in your industry you’ve studied."
      ],
      tag: "Messaging"
    },
    {
      id: 2,
      title: "Phase 2: Visibility",
      intro: "You stop building an engaged audience and start building a buyer audience.",
      bullets: [
        "Turn those “this looks so good!” DMs into actual sales without posting more, going viral, or doing another unpaid collab.",
        "Build a content-to-buyer system that fills your pipeline while you're at your kid's soccer game or well deserved holiday.",
        "Identify exactly where your audience drops off between “I love your content” and “Here’s my credit card.”",
        "Create content that compounds revenue over time instead of requiring you to show up daily just to stay visible.",
        "Attract people who have the budget and urgency to buy now — not followers who’ll cheer you on but never invest."
      ],
      tag: "Content & Marketing"
    },
    {
      id: 3,
      title: "Phase 3: Cash",
      intro: "You stop hoping your great product will sell itself and start building a system that converts.",
      bullets: [
        "Close $5K–$15K sales through optimised & simple funnels — not 90-minute convincing sessions that leave you depleted.",
        "Design a sales ecosystem that generates $50K–$80K months without launching every quarter or hustling through DMs.",
        "Build email and DM sequences that move lukewarm followers to “When can we start?” buyers.",
        "Create offers that feel like no-brainers to your ideal client — aka ones they say yes to in 24 hours, not 6 months.",
        "Price based on transformation and market position — not what feels “safe” or what you think they can afford."
      ],
      tag: "Sales"
    },
    {
      id: 4,
      title: "Phase 4: Subconscious Mastery",
      intro: "You become the founder who can hold the revenue, visibility, and scale you've been building toward.",
      bullets: [
        "Receive $15K, $40K, $60K months without immediately reinvesting it all, getting mysterious illnesses, or hiding.",
        "Stop the sabotage loop — aka ghosting hot prospects, dropping prices mid-pitch, going dark after your biggest month.",
        "Rewire your nervous system so being visible as a high-earner feels safe instead of exposing.",
        "Hold money in your account without guilt-spending it or giving it away to prove you're still relatable.",
        "Make $50K–$100K months your baseline — not a lucky fluke you can't explain or repeat."
      ],
      tag: "Identity & Capacity"
    }
  ];

  const testimonials = [
    {
      id: 1,
      text: "WMHQ completely changed the way I think about revenue. I stopped posting for validation and started posting for buyers.",
      author: "Sarah M",
      title: "Brand Founder"
    },
    {
      id: 2,
      text: "I finally understand why I kept sabotaging after big months. The subconscious work alone is worth it.",
      author: "Chloe T",
      title: "Service-Based Business Owner"
    },
    {
      id: 3,
      text: "My income used swing $30K to $8K. Now I actually have predictability.",
      author: "Danielle R",
      title: "Coach"
    },
    {
      id: 4,
      text: "This isn’t another mastermind. It’s strategy + nervous system safety in one room.",
      author: "Mia L",
      title: "Creative Entrepreneur"
    },
    {
      id: 5,
      text: "I thought I needed better content. I needed a better identity.",
      author: "Laura K",
      title: "Consultant"
    },
    {
      id: 6,
      text: "I used to spiral every time enquiries were quiet. Now I know how to hold steady and sell anyway.",
      author: "Member",
      title: "SERVICE PROVIDER"
    },
    {
      id: 7,
      text: "I thought I needed a bigger audience. Turns out I needed stronger positioning and brand presence. I feel like it's so simple now!",
      author: "Member",
      title: "PERSONAL BRAND"
    },
    {
      id: 8,
      text: "I stopped rebuilding my offers every quarter. I refined one and scaled it properly.",
      author: "Member",
      title: "DIGITAL EDUCATOR"
    },
    {
      id: 9,
      text: "I finally feel safe and convicted in being visible. My body isn’t shutting down every time I launch.",
      author: "Member",
      title: "BUSINESS OWNER"
    },
    {
      id: 10,
      text: "I stopped designing for compliments and started designing for demand. Our last drop sold out in 48 hours.",
      author: "Member",
      title: "JEWELLERY BRAND OWNER"
    },
    {
      id: 11,
      text: "I stopped copying other fitness brands and finally owned our angle. That’s when the community grew.",
      author: "Member",
      title: "ACTIVEWEAR BRAND FOUNDER"
    },
    {
      id: 12,
      text: "I finally understand why I kept plateauing after big months. The subconscious work changed how I hold change and more money.",
      author: "Member",
      title: "JEWELLERY BRAND OWNER"
    }
  ];

  const ribbonWords = [
    "subconscious", "strategy", "sales", "marketing", "identity", "capacity"
  ];

  const evolutionWords = [
    "Influence", "Visibility", "Cash", "Identity", "Capacity", "Strategy", "Subconscious"
  ];

  const niches = [
    "Personal Trainers",
    "Business Coaches",
    "Feminine Energy Coaches",
    "Clothing Brand Founders",
    "Nutritionists",
    "Life Coaches",
    "Yoga & Wellness Instructors",
    "Manifestation / Spiritual Coaches",
    "Beauty Brand Owners",
    "Corporate women pivoting into business",
    "Social Media Managers / Content Creators",
    "Service Providers",
    "Creators & Thought Leaders",
    "Relationship & Dating Coaches",
    "E-Commerce Founders",
    "Creative Agency Owners"
  ];

  const scrollToPricing = () => {
    const element = document.getElementById('wmhq-investment');
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const CHECKOUT_URL = 'https://www.jessicapinili.com/offers/wyacfFGV/checkout';

  return (
    <div className="min-h-screen font-sans selection:bg-[#7c1d1d] selection:text-white bg-cream">
      
      {/* Navigation */}
      <nav className="fixed w-full z-[100] top-0 px-6 py-8 md:px-16 flex justify-between items-center bg-cream/90 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-2">
          <div className="font-serif text-2xl tracking-tighter text-gray-900 lowercase font-black italic">wmhq.</div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={scrollToPricing}
            className="text-[10px] uppercase tracking-[0.4em] bg-black text-white px-8 py-4 rounded-xl font-black shadow-xl shadow-black/10 hover:translate-y-[-2px] transition-transform"
          >
            JOIN WMHQ
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-40 md:pt-24 overflow-hidden">
        {/* Subtle Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-40"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-silk-fabric-waving-31627-large.mp4" type="video/mp4" />
        </video>
        {/* Soft Wash Overlay */}
        <div className="absolute inset-0 bg-cream/85 z-[1] pointer-events-none"></div>

        {/* Desktop-only Background Motion Typography */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-[2] overflow-hidden">
          <svg viewBox="0 0 1400 800" className="w-full h-full overflow-visible">
            <defs>
              <path id="whisperArc" d="M -200 400 C 300 750 1100 750 1600 400" />
              <path id="ribbonPath" d="M 400 850 C 700 750 1200 650 1800 550" />
            </defs>
            
            {/* Curved faint grey whisper text arc */}
            <text className="font-sans text-[11px] uppercase tracking-[0.7em] fill-gray-400 font-light opacity-[0.25]">
              <textPath href="#whisperArc" startOffset="0%">
                <animate attributeName="startOffset" from="0%" to="-100%" dur="120s" repeatCount="indefinite" />
                {Array(6).fill(ribbonWords.join(" — ") + " — ").join("")}
              </textPath>
            </text>

            {/* Substantial black sweeping ribbon in lower-right with white text */}
            <g className="opacity-[0.82]">
              <use href="#ribbonPath" fill="none" stroke="black" strokeWidth="85" strokeLinecap="round" />
              <text className="font-sans text-[11px] uppercase tracking-[0.45em] fill-white font-black">
                <textPath href="#ribbonPath" startOffset="0%" dy="4">
                  <animate attributeName="startOffset" from="0%" to="-100%" dur="45s" repeatCount="indefinite" />
                  {Array(8).fill("12 MONTHS ACCESS — BUSINESS MASTERMIND — SUBCONSCIOUS MASTERY CALL — WEEKLY AUDITS — WMHQ VAULT — HQ COMMUNITY — ").join("")}
                </textPath>
              </text>
            </g>
          </svg>
        </div>

        <div className="max-w-7xl w-full text-center z-10 flex flex-col items-center relative">
          <h1 className="flex flex-col items-center w-full max-w-[1200px] mx-auto text-center mb-4 px-4">
            <span className="text-[25px] sm:text-6xl md:text-[76px] lg:text-[84px] font-serif leading-[1.2] sm:leading-[1.05] tracking-tightest text-black block md:whitespace-nowrap break-words w-full">
              <EditableText value={state.hero.title} onSave={(v) => updateSection('hero', 'title', v)} />
            </span>
            <span className="text-[22px] sm:text-5xl md:text-[68px] lg:text-[76px] font-serif leading-tight sm:leading-[1.05] tracking-tightest text-[#7c1d1d] font-bold block mt-2 sm:mt-1 break-words w-full">
              and inconsistent income into scalable revenue
            </span>
          </h1>
          <div className="max-w-2xl mx-auto mt-6">
            <p className="text-base md:text-xl text-black font-medium leading-relaxed tracking-wide text-center">
              <EditableText value={state.hero.body} onSave={(v) => updateSection('hero', 'body', v)} isTextArea />
            </p>
          </div>

          <div className="relative w-full h-32 mt-12 flex items-center justify-center">
            {/* Mobile-only Linear Marquee - preserved exactly */}
            <div className="lg:hidden absolute inset-0 flex items-center ribbon-container opacity-[0.22]">
              <div className="flex animate-marquee whitespace-nowrap items-center">
                {[1, 2, 3, 4].map((set) => (
                  <div key={set} className="flex items-center gap-16 px-8">
                    {ribbonWords.map((word, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-[11px] uppercase tracking-[0.55em] font-bold text-[#7c1d1d]">{word}</span>
                        <span className="text-xl text-[#7c1d1d]/30 font-light">—</span>
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-20 group">
              <div className="px-10 py-4 bg-cream/95 backdrop-blur-sm border border-black/5 rounded-full flex gap-6 shadow-[0_15px_40px_-12px_rgba(0,0,0,0.12)] items-center transform transition-all duration-700 hover:scale-105 hover:shadow-[0_20px_50px_-12px_rgba(123,29,29,0.15)]">
                <span className="text-2xl filter drop-shadow-sm">🤓</span>
                <span className="text-2xl filter drop-shadow-sm">🧠</span>
                <span className="text-2xl filter drop-shadow-sm">💸</span>
                <span className="text-2xl filter drop-shadow-sm">👸🏽</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-brandRed/0 via-brandRed/5 to-brandRed/0 blur-xl -z-10 rounded-full opacity-30 group-hover:opacity-60 transition-opacity"></div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-10 mb-16 md:mb-0 relative z-20">
            <button 
              onClick={scrollToPricing}
              className="group relative px-16 py-7 bg-[#7c1d1d] text-white text-[12px] uppercase tracking-[0.5em] font-black rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-[#7c1d1d]/30"
            >
              GET 12 MONTHS ACCESS
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-16 py-7 border-2 border-black/10 text-black text-[12px] uppercase tracking-[0.5em] font-black rounded-2xl flex items-center gap-4 hover:border-black/30 transition-all bg-cream/50 backdrop-blur-sm"
            >
              WATCH THE VISION
            </button>
          </div>
        </div>
      </section>

      {/* Scale Impact Section (Pic 1 Area) */}
      <section className="bg-white md:bg-dark py-32 md:py-48 px-6 overflow-hidden transition-colors duration-700">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24 relative">
          <div className="flex-1 space-y-12 z-10">
            <div className="flex justify-center lg:justify-start gap-5">
              <div className="px-5 py-2.5 rounded-full border border-black/10 md:border-white/10 text-[10px] uppercase tracking-[0.4em] text-black md:text-white font-bold bg-black/5 md:bg-white/5">STRATEGY</div>
              <div className="px-5 py-2.5 rounded-full border border-black/10 md:border-white/10 text-[10px] uppercase tracking-[0.4em] text-black md:text-white font-bold bg-black/5 md:bg-white/5">SUBCONSCIOUS</div>
            </div>
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-serif text-[#1a1a1a] md:text-white leading-[1.1] tracking-tight max-w-xl">
              Turn your audience into buyers, <br/>
              <span className="italic opacity-40">in every season of business.</span>
            </h2>
            <p className="text-xl text-gray-500 md:text-gray-400 font-light leading-relaxed max-w-lg">
              Seamless strategy + subconscious mastery inside every phase of your brand. From messaging to money to identity. <span className="font-bold text-[#7c1d1d]">You get complete instant access to support & resources for 12 months.</span>
            </p>
            <button 
              className="px-10 py-5 bg-[#7c1d1d] md:bg-white text-white md:text-black text-[11px] uppercase tracking-[0.5em] font-black rounded-2xl hover:opacity-90 transition-all"
            >
              JOIN WMHQ NOW
            </button>
          </div>

          <div className="flex-1 relative w-full flex justify-center z-10">
            <div className="w-full max-w-[420px] aspect-[9/19] bg-[#0d0d0d] rounded-[3.5rem] border-[10px] border-[#222] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden p-8 flex flex-col justify-between relative">
              <div className="flex justify-between items-center">
                 <div className="w-14 h-14 rounded-full bg-[#0d0d0d] flex flex-col items-center justify-center font-serif text-white italic text-[10px] leading-[1.1] border border-white/10">
                   <span>WM</span>
                   <span>HQ</span>
                 </div>
                 <div className="flex gap-1.5"><div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div><div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div></div>
              </div>
              <div className="space-y-4 flex-1 mt-10 overflow-y-auto scrollbar-hide pr-1 pb-10">
                <div className="bg-white/5 p-4 rounded-2xl text-[10px] text-gray-400 uppercase tracking-widest border border-white/10 flex items-center justify-between mb-4">
                   ASK JP (Scroll to see what WMHQ members ask)
                   <div className="w-2 h-2 bg-[#7c1d1d] rounded-full animate-pulse shadow-[0_0_8px_#7c1d1d]"></div>
                </div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl text-white/90 text-sm border border-white/5 shadow-lg leading-relaxed">“Let’s look at the exact sales ecosystem to scale to $100K”</div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl text-white/90 text-sm border border-white/5 shadow-lg leading-relaxed">“My revenue keeps swinging between $30K and $10K! Where is my sales system actually leaking?”</div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl text-white/90 text-sm border border-white/5 shadow-lg leading-relaxed">“My content performs but my launches underperform what am I missing in my conversion pathway?”</div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl text-white/90 text-sm border border-white/5 shadow-lg leading-relaxed">“I’m fully booked when I’m ‘on’, but nothing sells when I step back. How do I build revenue that isn’t dependent on my energy?”</div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl text-white/90 text-sm border border-white/5 shadow-lg leading-relaxed">“Can we map out what needs to shift to move from founder-led selling to a scalable ecosystem?”</div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl text-white/90 text-sm border border-white/5 shadow-lg leading-relaxed">“Why do I feel uncomfortable charging more even though I know my results justify it?”</div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl text-white/90 text-sm border border-white/5 shadow-lg leading-relaxed">“Could you review these content themes to build my personal brand?”</div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl text-white/90 text-sm border border-white/5 shadow-lg leading-relaxed">“Every time I get momentum, I pull back. What identity is still running the show?”</div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl text-white/90 text-sm border border-white/5 shadow-lg leading-relaxed">“I say I want $50K months, but I panic when my audience grows what part of me is scared of being fully seen?”</div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl text-white/90 text-sm border border-white/5 shadow-lg leading-relaxed">“Why does visibility feel exciting one week and unsafe the next — and how do I regulate through that?”</div>
                <div className="relative group bg-gradient-to-br from-[#7c1d1d]/20 to-[#1a1a1a] p-5 rounded-2xl text-white text-sm border border-[#7c1d1d]/20 shadow-2xl">
                  “Here’s how the fear of being seen is showing up — can we workshop it?”
                  <div className="absolute -bottom-6 -right-2">
                     <div className="w-12 h-12 rounded-2xl bg-[#7c1d1d] flex items-center justify-center shadow-2xl shadow-[#7c1d1d]/30 border border-white/10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                     </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center py-4">
                 <div className="waveform-container scale-125">
                    {Array.from({length: 12}).map((_, i) => (<div key={i} className="bar bg-white/20" style={{ animationDelay: `${i * 0.12}s`, height: `${Math.random() * 15 + 4}px` }}></div>))}
                 </div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] pointer-events-none opacity-[0.15] md:opacity-[0.12] blur-[1px] select-none scale-75 md:scale-100">
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {[...ribbonWords, ...ribbonWords, ...ribbonWords, ...ribbonWords].map((word, i) => (
                <div key={i} className="px-10 py-5 rounded-full border border-black/20 md:border-white/20 bg-black/5 md:bg-white/5 backdrop-blur-sm">
                  <span className="text-[12px] md:text-[14px] uppercase font-black tracking-[0.4em] text-black md:text-white">{word}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="bg-[#f9f7f2] py-32 px-6 border-t border-black/5 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto space-y-4">
            <DarkAccordionItem title="IS THIS EVEN FOR ME?">
              <div className="space-y-6">
                <p><span className="font-bold">The Myth:</span> “I’m not far enough along yet. This is for women who already have it figured out — a big audience, consistent income, or at least know what they’re doing. I should wait until I’m more ‘ready.’”</p>
                <p><span className="font-bold">The Truth:</span> You don’t need to be further along. You need support that meets you where you are. The women who join “when they’re ready” are still waiting two years later. The women who join now are running $30K months by this time next year.</p>
              </div>
            </DarkAccordionItem>
            
            <DarkAccordionItem title="I’VE TRIED EVERYTHING. WHY WOULD THIS BE DIFFERENT?">
              <div className="space-y-6">
                <p><span className="font-bold">The Myth:</span> “I’ve bought the courses, hired the coaches, done the mindset work, learned the strategies… and I’m still stuck. Maybe it’s me. Maybe nothing will actually work.”</p>
                <p><span className="font-bold">The Truth:</span> It’s not that nothing works, you were only getting half the solution. Business courses give you strategy but don’t address why you can’t execute. Mindset coaching helps you feel better but doesn’t build a business model. WMHQ treats your mindset and marketing as the same system, so you finally get both.</p>
              </div>
            </DarkAccordionItem>
            
            <DarkAccordionItem title="I DON’T HAVE TIME FOR ANOTHER PROGRAM.">
              <div className="space-y-6">
                <p><span className="font-bold">The Myth:</span> “I’m already drowning. I can barely keep up with posting, client work/customer service, life. Adding another membership will just overwhelm me more. I need to get my shit together first, then I can invest.”</p>
                <p><span className="font-bold">The Truth:</span> You’re overwhelmed because you’re doing it alone. The right support doesn’t add to your plate, it clears it. You stop guessing what to post, stop consuming 47 free trainings, and start executing with clarity. You don’t need more time. You need to stop wasting the time you have.</p>
              </div>
            </DarkAccordionItem>
            
            <DarkAccordionItem title="WHAT IF I INVEST AND IT DOESN’T WORK FOR ME?">
              <div className="space-y-6">
                <p><span className="font-bold">The Myth:</span> “I’ve invested before and didn’t get results. What if I join, don’t do the work, and I’m just out $5K with nothing to show for it? What if I’m the problem?”</p>
                <p><span className="font-bold">The Truth:</span> You’re not doing this alone anymore. You get bi-weekly live coaching, real-time feedback, subconscious work that dissolves the patterns making you quit, and a community that won’t let you disappear. The real question isn’t “what if it doesn’t work?” It’s: “How much longer are you willing to stay stuck hoping something changes without changing anything?”</p>
              </div>
            </DarkAccordionItem>
          </div>
        </div>
      </section>

      {/* Inclusions Section */}
      <section className="bg-[#f2f2f2] py-24 px-4 md:px-12 lg:py-40">
        <div className="max-w-[1500px] mx-auto bg-dark rounded-[4rem] md:rounded-[5rem] overflow-hidden p-8 sm:p-12 md:p-32 shadow-2xl shadow-black/30 border border-white/[0.03]">
          <div className="flex flex-col lg:flex-row gap-24 xl:gap-32">
            <div className="flex-1 space-y-20 lg:space-y-24">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white tracking-tightest leading-[1.1] sm:leading-[1.05] max-w-2xl break-words">
                  WMHQ is where female entrepreneurs build differently.
                </h2>
                <p className="text-[#7c1d1d] text-xl md:text-2xl font-serif tracking-tight leading-none">
                  12 months of complete access
                </p>
              </div>
              <div className="flex flex-wrap gap-4 max-w-xl">
                {Object.keys(inclusions).map((title) => (
                  <button
                    key={title}
                    onClick={() => setActiveInclusion(title)}
                    className={`px-8 py-4 rounded-full text-[11px] uppercase tracking-[0.35em] font-bold border transition-all duration-500 flex items-center gap-3 ${
                      activeInclusion === title 
                      ? 'bg-[#7c1d1d] border-[#7c1d1d] text-white shadow-[0_0_30px_rgba(123,29,29,0.4)]' 
                      : 'bg-transparent border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {activeInclusion === title && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
                    {title}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center min-h-[500px]">
              <div className="relative group bg-[#0d0d0d] p-12 md:p-20 rounded-[4rem] border border-white/5 shadow-inner transition-all duration-700 hover:border-[#7c1d1d]/20 overflow-hidden flex flex-col justify-center h-full">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#7c1d1d]/5 blur-[120px] rounded-full group-hover:bg-[#7c1d1d]/10 transition-all duration-700"></div>
                <div key={activeInclusion} className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                  <div className="text-[11px] uppercase tracking-[0.8em] text-red-400 font-black opacity-80">the inclusion</div>
                  <div className="space-y-8">
                    <h3 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white italic leading-tight">
                      {activeInclusion}
                    </h3>
                    <p className="text-2xl md:text-3xl lg:text-4xl text-gray-400 font-light leading-[1.4] max-w-2xl">
                      {inclusions[activeInclusion as keyof typeof inclusions]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 flex justify-center">
            <button 
              onClick={scrollToPricing}
              className="px-14 py-6 bg-white text-black text-[12px] uppercase tracking-[0.5em] font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/5"
            >
              JOIN WMHQ NOW
            </button>
          </div>
        </div>
      </section>

      {/* Decorative Dotted Loop Overlay */}
      <div className="relative w-full h-0 z-[5] pointer-events-none overflow-visible">
        <div 
          className="absolute top-[-300px] md:top-[-500px] left-0 w-full h-[600px] md:h-[1000px] opacity-[0.35] animate-loop-drift overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
          }}
        >
          <svg viewBox="0 0 1400 600" className="w-full h-full preserve-3d" preserveAspectRatio="none">
            <path 
              d="M-100,300 C150,50 400,550 700,300 C1000,50 1250,550 1500,300" 
              fill="none" 
              stroke="#da91ab" 
              strokeWidth="4" 
              strokeDasharray="0 18" 
              strokeLinecap="round"
            />
            <path 
              className="opacity-60"
              d="M-200,450 C300,100 600,600 900,200 C1200,-100 1400,500 1600,200" 
              fill="none" 
              stroke="#da91ab" 
              strokeWidth="3" 
              strokeDasharray="0 22" 
              strokeLinecap="round"
            />
            <path 
              className="hidden md:block opacity-40"
              d="M100,100 C400,400 800,0 1200,300" 
              fill="none" 
              stroke="#da91ab" 
              strokeWidth="2" 
              strokeDasharray="0 14" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Hybrid Carousel Section */}
      <section className="bg-[#f2f2f2] py-24 px-6 md:px-12 lg:py-40">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="lg:w-1/3 space-y-8">
            <h3 className="text-[#7c1d1d] text-4xl md:text-5xl lg:text-6xl font-serif italic leading-[1.1] tracking-tightest">
              More than a course. Deeper than a mastermind. Better than a membership.
            </h3>
            <p className="text-[#7c1d1d] text-xl md:text-2xl font-light opacity-80 leading-relaxed max-w-lg">
              WMHQ is all three, designed to meet you where growth actually happens.
            </p>
          </div>
          
          <div className="lg:w-2/3 w-full relative group">
            <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-[#f2f2f2] to-transparent pointer-events-none z-20"></div>
            
            <div 
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 cursor-grab active:cursor-grabbing select-none"
              onScroll={handleScroll}
            >
              {carouselItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`min-w-[85%] md:min-w-[450px] snap-center bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col justify-center gap-10 transition-all duration-700 ${carouselIndex === idx ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}
                >
                  <h4 className="text-3xl md:text-4xl font-serif italic text-black leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xl text-gray-600 font-light leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-6 relative z-30">
              <div className="flex gap-3">
                {carouselItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToCard(idx)}
                    className={`h-1.5 transition-all duration-500 rounded-full ${carouselIndex === idx ? 'w-12 bg-[#7c1d1d]' : 'w-6 bg-black/10 hover:bg-black/20'}`}
                  />
                ))}
              </div>
              <div className="hidden lg:flex gap-4">
                <button 
                  onClick={prevCard}
                  className="w-12 h-12 rounded-full border border-[#7c1d1d]/20 flex items-center justify-center text-[#7c1d1d] hover:bg-[#7c1d1d] hover:text-white transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button 
                  onClick={nextCard}
                  className="w-12 h-12 rounded-full border border-[#7c1d1d]/20 flex items-center justify-center text-[#7c1d1d] hover:bg-[#7c1d1d] hover:text-white transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evolution Section */}
      <section className="bg-cream py-32 md:py-48 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.06] pointer-events-none py-12 select-none border-b border-black/5 bg-cream/50 backdrop-blur-[2px] z-20">
          <div className="flex animate-marquee whitespace-nowrap gap-24">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-24 items-center">
                {ribbonWords.map(w => (
                  <span key={w} className="text-[10px] uppercase tracking-[0.6em] font-black text-black">{w} — </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 pt-20">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-6xl md:text-8xl font-serif text-black tracking-tightest leading-none">
              The WMHQ Evolution
            </h2>
            <p className="text-gray-500 text-[11px] uppercase tracking-[0.4em] font-bold">
              You don’t scale in one move. You evolve in phases.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 w-full lg:w-72">
              {phases.map((phase, idx) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(idx)}
                  className={`flex flex-col justify-center px-8 py-7 rounded-2xl border-2 transition-all duration-500 group h-32 md:h-36 ${
                    activePhase === idx 
                    ? 'bg-[#0d0d0d] border-[#7c1d1d]/40 text-white shadow-2xl scale-105 z-20' 
                    : 'bg-[#f7f4f0] border-black/5 text-gray-400 hover:border-black/20 hover:text-black hover:bg-white'
                  }`}
                >
                  <div className={`text-[10px] uppercase tracking-widest font-black mb-2 transition-opacity ${activePhase === idx ? 'opacity-60 text-red-400' : 'opacity-40 group-hover:opacity-100'}`}>Phase {phase.id}</div>
                  <div className={`font-serif italic text-xl md:text-2xl leading-tight ${activePhase === idx ? 'text-white' : ''}`}>
                    {phase.tag}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex-1 relative min-h-[600px] w-full">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none -z-10">
                <div className="flex flex-col gap-10 animate-slow-sway">
                  <div className="flex gap-20 animate-marquee whitespace-nowrap">
                    {[...evolutionWords, ...evolutionWords].map((word, i) => (
                      <span key={i} className="text-8xl md:text-[14rem] font-serif italic text-black uppercase opacity-20">{word}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div key={activePhase} className="bg-white p-12 md:p-20 rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] border border-black/[0.03] transform transition-all duration-700 animate-in fade-in slide-in-from-right-8 h-full flex flex-col justify-center">
                <div className="max-w-3xl space-y-14">
                  <div className="space-y-8">
                    <div className="inline-block px-5 py-2 bg-[#7c1d1d]/5 text-[#7c1d1d] text-[11px] uppercase tracking-[0.5em] font-black rounded-full border border-[#7c1d1d]/10">
                      PHASE 0{phases[activePhase].id} — {phases[activePhase].tag}
                    </div>
                    <h3 className="text-5xl md:text-7xl lg:text-8xl font-serif text-black leading-none italic tracking-tightest">
                      {phases[activePhase].title}
                    </h3>
                    <p className="text-2xl md:text-4xl text-[#7c1d1d] font-serif italic opacity-90 leading-[1.3] max-w-2xl">
                      {phases[activePhase].intro}
                    </p>
                  </div>
                  <ul className="space-y-8">
                    {phases[activePhase].bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-8 items-start group">
                        <div className="mt-3 w-2 h-2 rounded-full bg-[#7c1d1d] flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                        <span className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed tracking-wide">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 flex justify-center">
            <button 
              onClick={scrollToPricing}
              className="px-14 py-6 bg-black text-white text-[12px] uppercase tracking-[0.5em] font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-black/10"
            >
              GET 12 MONTHS ACCESS
            </button>
          </div>
        </div>
      </section>

      {/* Trust Divider Section */}
      <section className="bg-[#da91ab] py-14 overflow-hidden w-full relative z-30">
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h3 className="text-[#f2f2f2] font-dm text-[13px] md:text-[15px] uppercase tracking-[0.4em] font-bold">
            WMHQ Methodology trusted by 400+ female entrepreneurs.
          </h3>
        </div>
        <div className="relative flex items-center ribbon-container">
          <div className="flex animate-marquee-slow whitespace-nowrap items-center">
            {[1, 2].map((set) => (
              <div key={set} className="flex items-center gap-16 px-8">
                {niches.map((n, idx) => (
                  <span 
                    key={idx} 
                    className="text-[#f2f2f2] font-dm text-lg md:text-xl font-bold tracking-[0.15em] uppercase"
                  >
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy Meets Subconscious Section */}
      <section className="bg-cream py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex items-center">
          <div className="flex animate-marquee whitespace-nowrap gap-32">
            {[1, 2, 3].map(set => (
              <div key={set} className="flex gap-32 items-center">
                {ribbonWords.map(w => (
                  <span key={w} className="text-[12rem] font-serif italic uppercase text-black">{w}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-[1550px] mx-auto relative z-10">
          <div className="text-center mb-32 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-serif text-black tracking-tightest leading-none md:whitespace-nowrap flex flex-wrap md:flex-nowrap justify-center items-center gap-x-2 md:gap-x-4">
              <span>Where</span>
              <span className="relative inline-block px-4 py-2">
                Strategy
                <svg className="absolute inset-0 w-[115%] h-[160%] -top-[30%] -left-[7.5%] pointer-events-none overflow-visible" viewBox="0 0 100 60">
                  <path 
                    d="M 5,30 C 5,12 85,8 92,28 C 96,52 15,55 12,32 C 10,25 20,20 40,18" 
                    fill="none" 
                    stroke="#8B1E1E" 
                    strokeWidth="1.8" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-95"
                  />
                </svg>
              </span>
              <span>Meets</span>
              <span className="relative inline-block px-4 py-2">
                Subconscious
                <svg className="absolute w-full h-4 -bottom-2 left-0 pointer-events-none overflow-visible" viewBox="0 0 100 20">
                  <path 
                    d="M 2,10 C 15,8 35,14 60,10 C 85,6 98,12 98,12 M 5,14 C 20,17 50,13 75,15 C 90,16 95,14 95,14" 
                    fill="none" 
                    stroke="#8B1E1E" 
                    strokeWidth="1.8" 
                    strokeLinecap="round"
                    className="opacity-95"
                  />
                </svg>
              </span>
            </h2>
            <p className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] text-[#6e6e6e] font-sans max-w-none mx-auto mt-10 leading-relaxed tracking-wide text-center">
              Most spaces give you strategy without addressing WHY you won't execute it... OR they give you mindset work without a business model that actually scales. Spoiler: You need BOTH or nothing scales.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">
            <div className="group relative bg-white p-12 md:p-16 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-black/5 hover:scale-[1.01] transition-all duration-700">
              <div className="space-y-12">
                <div className="text-[11px] uppercase tracking-[0.6em] text-[#7c1d1d] font-black opacity-60">WMHQ Methodology</div>
                <h3 className="text-5xl md:text-6xl font-serif italic text-black">You will learn how to:</h3>
                <div className="space-y-10">
                  {[
                    { label: "Build a business that scales without running yourself into the ground", body: "Infuse strategy with subconscious strategy so your nervous system stops sabotaging your sales, pricing, and visibility—and you can finally take a weekend off without refreshing Stripe every 20 minutes." },
                    { label: "Simplify your business foundations so scaling doesn't require 47 open tabs", body: "Streamline your offers, systems, and operations so you're not Frankensteining together a dozen tools, platforms, and workflows just to onboard one client or fulfil one order." },
                    { label: "Turn your engaged audience into actual revenue", body: "Stop building fans who love your content but never buy, and start converting followers into paying clients without posting 10x a day, launching every quarter, or burning out from the all-or-nothing mentality." },
                    { label: "Break through your $12K–$35K income ceiling", body: "Identify the exact subconscious pattern keeping you stuck in revenue swings and rewire it so $50K–$80K months become your baseline—not a lucky fluke you can't explain or repeat." },
                    { label: "Show up visible without your body shutting down", body: "Overcome visibility fears, price at your actual worth, and pitch $10K–$20K opportunities without your nervous system making you ghost prospects or “forget” to send the proposal." },
                    { label: "Create predictable cash flow you can actually plan around", body: "Build sales ecosystem that generates consistent $40K–$70K months so you can hire that VA, book the holiday, and stop panicking about next month's revenue at 2am." },
                    { label: "Stop self-sabotaging right before breakthroughs", body: "Recognise when you're about to drop your prices mid-pitch, get mysteriously sick after a $40K month, or disappear from your inbox—and choose differently before you blow the opportunity." },
                    { label: "Hold money without guilt, panic, or the urge to immediately reinvest it all", body: "Keep what you earn in your account without guilt-spending to prove you're still “normal,” giving it away to feel safer, or reinvesting before you've even paid yourself." },
                    { label: "Build authority that makes ideal clients and customers seek you out", body: "Position yourself so qualified buyers come pre-sold and ready to invest in your services or products—instead of you chasing lukewarm leads who “love this but need to think about it” for six months." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="mt-3 w-1.5 h-1.5 rounded-full bg-[#7c1d1d] flex-shrink-0"></div>
                      <div>
                        {item.label && <h4 className="text-xl font-serif italic text-black/90 mb-2">{item.label}</h4>}
                        {item.body && <p className="text-xl text-black/70 font-light leading-relaxed">{item.body}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="group relative bg-[#0a0a0a] p-12 md:p-16 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-white/5 hover:scale-[1.01] transition-all duration-700 overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#7c1d1d]/5 blur-[120px] rounded-full group-hover:bg-[#7c1d1d]/10 transition-all duration-700"></div>
              <div className="space-y-12 relative z-10">
                <div className="text-[11px] uppercase tracking-[0.6em] text-red-400 font-black opacity-60">This Is For You If</div>
                <h3 className="text-5xl md:text-6xl font-serif italic text-white">Can you relate:</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { text: "You've built something real, but growth feels harder than creation ever did: You have a signature offer, testimonials, and clients who rave about you but getting consistent buyers feels like climbing Everest", width: "98%" },
                    { text: "Your revenue is all over the place: $30K one month, $9K next. You can't plan, can't hire confidently, and definitely can't relax", width: "95%" },
                    { text: "People love your content but aren't buying: Your engagement is great, DMs are full of praise, but when you open the cart? Crickets", width: "92%" },
                    { text: "You're terrified of \"next level\" visibility: You know you need to be seen more, price higher, pitch bigger but every time you think about it, your chest tightens", width: "96%" },
                    { text: "You keep sabotaging right before breakthroughs: You ghost prospects, drop your prices out of nowhere, or mysteriously get sick after a big month", width: "94%" },
                    { text: "You're stuck between $12K–$35K months and can't crack consistent $50K+: You've outgrown DIY solutions but don't know how to step into the version of yourself who scales without burning out", width: "100%" },
                    { text: "You're tired of trading time for money: You want real leverage, actual scale, and a business that doesn't require your constant hustle to survive", width: "93%" },
                    { text: "You suspect your mindset is costing you money: You've got the strategy, the systems, the discipline but something invisible keeps holding you back", width: "97%" }
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className="p-6 md:p-8 bg-white/[0.03] border border-white/[0.08] rounded-[2rem] shadow-xl shadow-black/20 backdrop-blur-sm group/chip hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500"
                      style={{ maxWidth: item.width }}
                    >
                      <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed whitespace-normal italic">
                        “{item.text}”
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="wmhq-investment" className="bg-[#f2f2f2] py-32 md:py-48 px-6 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-6xl md:text-8xl font-serif text-black tracking-tightest leading-none">
              <span className="squiggly-underline">WMHQ</span> Investment
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-light">
              Get access to WMHQ for 12 months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-20">
            <div className="bg-transparent p-12 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-[#7c1d1d] flex flex-col justify-between hover:translate-y-[-8px] transition-all duration-500 h-full">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-4xl font-serif italic text-black">Pay in Full</h3>
                  <div className="flex flex-col">
                    <span className="text-gray-300 line-through text-2xl font-light">$5400</span>
                    <span className="text-6xl font-serif text-[#7c1d1d]">$5000</span>
                    <span className="text-[#7c1d1d] text-sm font-bold uppercase tracking-widest mt-1">(save $400)</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <PricingBullet text="Instant access to all inclusions for 12 months to WMHQ" />
                  <PricingBullet text="Bonus: 2x 1:1 calls with Jess Pinili" />
                </ul>
              </div>
              <a 
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-12 py-6 border-2 border-[#7c1d1d] text-[#7c1d1d] bg-transparent text-[12px] uppercase tracking-[0.5em] font-black rounded-2xl hover:bg-[#7c1d1d]/5 transition-all shadow-xl shadow-[#7c1d1d]/10 flex items-center justify-center text-center"
              >
                JOIN WMHQ
              </a>
            </div>

            <div className="bg-white p-12 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-[#7c1d1d] flex flex-col justify-between hover:translate-y-[-8px] transition-all duration-500 relative h-full">
              <div className="absolute top-5 right-12 text-[10px] uppercase tracking-[0.4em] text-[#7c1d1d] font-black bg-[#7c1d1d]/5 px-4 py-2 rounded-full border border-[#7c1d1d]/10">MOST POPULAR</div>
              <div className="space-y-10 pt-5">
                <div className="space-y-4">
                  <h3 className="text-4xl font-serif italic text-black">Monthly Payments</h3>
                  <div className="flex flex-col">
                    <span className="text-6xl font-serif text-[#7c1d1d]">$450<span className="text-2xl">/m</span></span>
                    <span className="text-gray-400 text-sm font-light mt-1">12 months instant access</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <PricingBullet text="Instant access to all inclusions for 12 months to WMHQ" />
                </ul>
              </div>
              <a 
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-12 py-6 bg-[#7c1d1d] text-white text-[12px] uppercase tracking-[0.5em] font-black rounded-2xl hover:bg-[#5a1414] transition-all shadow-xl shadow-[#7c1d1d]/20 flex items-center justify-center text-center"
              >
                JOIN WMHQ
              </a>
            </div>

            <div className="bg-transparent p-12 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-[#7c1d1d] flex flex-col justify-between hover:translate-y-[-8px] transition-all duration-500 h-full">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-4xl font-serif italic text-black">WMHQ VIP</h3>
                  <div className="flex flex-col">
                    <span className="text-6xl font-serif text-[#7c1d1d]">$1500<span className="text-2xl">/m</span></span>
                    <span className="text-gray-400 text-sm font-light mt-1">1:1 support & proximity</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <PricingBullet text="Instant access to all inclusions for 12 months to WMHQ" />
                  <PricingBullet text="12x monthly 1:1 calls with Jess Pinili" />
                  <PricingBullet text="VIP Workshopping Document to collaborate" />
                  <PricingBullet text="Complimentary access to any paid workshops outside of WMHQ Jess launches" />
                  <PricingBullet text="Bonus: 30 minute onboarding call" />
                </ul>
              </div>
              <a 
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-12 py-6 border-2 border-[#7c1d1d] text-[#7c1d1d] bg-transparent text-[12px] uppercase tracking-[0.5em] font-black rounded-2xl hover:bg-[#7c1d1d]/5 transition-all shadow-xl shadow-[#7c1d1d]/10 flex items-center justify-center text-center"
              >
                JOIN WMHQ
              </a>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-32 bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
            <AccordionItem title="Is this for product and service-based businesses?">
              Yes. Whether you are selling digital products, high-ticket services, or physical luxury goods, the psychological principles of modern power and consistent revenue systems remain the same.
            </AccordionItem>
            <AccordionItem title="How long is access + T&Cs">
              <div className="space-y-6">
                <p>When you join Woman Mastery HQ (WMHQ), you receive 12 months of direct access to all membership inclusions: including audits, live calls, and the continuously evolving Vault of resources.</p>
                <p>With the <strong>Pay in Full</strong> option, you receive immediate access to WMHQ for 12 months. At the end of your 12-month term, your membership will automatically transition to a month-to-month subscription at the current membership rate at that time. If you wish to cancel after your initial 12 months, 30 days’ written notice via email is required prior to your renewal date.</p>
                <p>With <strong>Monthly Payments</strong>, you commit to a 12-month membership term, billed monthly. You will receive full access to all WMHQ inclusions for the duration of your active membership. After your initial 12-month term is complete, your membership will continue on a month-to-month basis at the current rate, unless 30 days’ written notice via email is provided prior to your renewal date.</p>
                <p>With <strong>WMHQ VIP</strong>, you commit to a 12-month membership term, billed monthly. You will receive full access to all WMHQ inclusions for the duration of your active membership. After your initial 12-month term is complete, your membership will continue on a month-to-month basis at the current rate, unless 30 days’ written notice via email is provided prior to your renewal date.</p>
              </div>
            </AccordionItem>
            <AccordionItem title="Pay in full bonus?">
              <div className="space-y-4">
                <p>When you choose the Pay in Full option for 12 months of WMHQ access, you will receive:</p>
                <p><strong>2 x 60-minute private 1:1 coaching calls with Jess Pinili</strong></p>
                <p>These bonus sessions are designed to give you personalised strategy, refinement, and high-level support alongside your membership experience.</p>
                <p>You may use one session per 6-month period during your 12-month term.</p>
                <p>It is your responsibility to book your sessions and submit the required intake form at least 72 hours prior to your scheduled call.</p>
                <p>Unused bonus calls do not roll over beyond your active 12-month term.</p>
              </div>
            </AccordionItem>
            <AccordionItem title="Who I’ve worked for">
              <div className="space-y-1">
                <p className="mb-4">I've mentored and coached a wide range of brand founders and entrepreneurs:</p>
                <p>✔️ Personal Trainers</p>
                <p>✔️ Business Coaches</p>
                <p>✔️ Feminine Energy Coaches</p>
                <p>✔️ Clothing Brand Founders</p>
                <p>✔️ Nutritionists</p>
                <p>✔️ Life Coaches</p>
                <p>✔️ Yoga & Wellness Instructors</p>
                <p>✔️ Manifestation / Spiritual Coaches</p>
                <p>✔️ Beauty Brand Owners</p>
                <p>✔️ Corporate women pivoting into business</p>
                <p>✔️ Social Media Managers / Content Creators</p>
                <p>✔️ Service Providers</p>
                <p>✔️ Creators & Thought Leaders</p>
                <p>✔️ Relationship & Dating Coaches</p>
                <p>✔️ E-Commerce Founders</p>
                <p>✔️ Creative Agency Owners</p>
              </div>
            </AccordionItem>
            <AccordionItem title="WMHQ is not for you if…">
              If you are looking for a ‘get rich quick’ scheme or tactical hacks without the willingness to look at your subconscious blocks, this is not the room for you. It is also not for you if you want to be handed the answers. WMHQ is a space for women who are self-led, have a willingness to execute, and a desire to learn instead of looking for a quick way to success.
            </AccordionItem>
          </div>
        </div>
      </section>

      {/* Love Letters Section */}
      <section className="bg-dark py-32 md:py-48 relative overflow-hidden rounded-t-[4rem] md:rounded-t-[6rem]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#7c1d1d]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10 text-center">
          <div className="inline-block relative">
            <h2 className="text-6xl md:text-8xl font-serif text-white tracking-tightest leading-none">
              Love letters<br/>
              <span className="italic opacity-80">to WMHQ</span>
            </h2>
            <div className="absolute -top-6 -right-12 w-12 h-12 border-t-2 border-r-2 border-[#7c1d1d]/30 rounded-tr-full animate-pulse"></div>
            <div className="absolute -bottom-6 -left-12 w-12 h-12 border-b-2 border-l-2 border-[#7c1d1d]/30 rounded-bl-full animate-pulse delay-700"></div>
          </div>
        </div>
        <div className="relative w-full overflow-hidden py-12 ribbon-container group">
          <div className="flex animate-marquee max-md:animate-[marquee_24s_linear_infinite] whitespace-nowrap gap-8 hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div 
                key={`${t.id}-${idx}`} 
                className="inline-flex flex-col items-center justify-center w-[400px] md:w-[600px] bg-[#f5f2ea] p-10 md:p-12 rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/5 transition-all duration-700 hover:scale-[1.03] hover:-translate-y-2"
              >
                <div className="text-4xl mb-8 filter drop-shadow-md">💌</div>
                <p className="text-xl md:text-2xl text-black/80 font-serif italic leading-relaxed text-center mb-10 whitespace-normal">
                  “{t.text}”
                </p>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#7c1d1d] font-bold">{t.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-[#f2f2f2] py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0">
          <div className="flex animate-marquee-slow whitespace-nowrap opacity-[0.06]">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="text-[12rem] font-serif italic text-[#da91ab] mx-12">
                Meet Jess Pinili • Founder WMHQ
              </span>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="border-2 border-[#7b1d1d] rounded-[4rem] p-12 md:p-24 relative overflow-hidden bg-[#f2f2f2]">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            <div className="flex flex-col lg:flex-row gap-20 items-center relative z-10">
              <div className="flex-1 space-y-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-400 block mb-6">ABOUT</span>
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-black tracking-tightest leading-none mb-6 whitespace-nowrap">Hi, I'm Jess! 👋🏽</h2>
                  <h3 className="text-xl md:text-2xl font-sans text-[#7c1d1d] font-medium leading-relaxed">
                    Business Strategist & Mindset Coach. Host of The Jessica Pinili Podcast. Founder of Woman Mastery HQ.
                  </h3>
                </div>
                <div className="space-y-6">
                  <p className="text-xl text-gray-600 font-light leading-relaxed max-w-xl italic">
                    Let's make this short and sweet.
                  </p>
                  <p className="text-xl text-gray-600 font-light leading-relaxed max-w-xl italic">
                    I built this business because I was tired of watching brilliant women choose between their sanity and their income. You shouldn't have to hustle yourself into burnout just to hit your revenue goals. And you shouldn't have to dim your ambition just to feel like a present human. I'm obsessed with the practical stuff aka the systems, the strategy, the spreadsheets that actually work. But I also know that no funnel on earth will save you if your nervous system thinks visibility = danger.
                  </p>
                  <p className="text-xl text-gray-600 font-light leading-relaxed max-w-xl italic">
                    So we do both.
                  </p>
                  <p className="text-xl text-gray-600 font-light leading-relaxed max-w-xl italic">
                    Strategy that works with your subconscious strategy. Systems that don't require you to override your body's signals. A business that fits your actual life—not the one you think you're supposed to be living. I can't wait to hold space for you.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {[
                    "400+ women coached",
                    "Strategy + subconscious strategy",
                    "Built for $10k–$50k+ month scale",
                    "Business Owner 7+ Years"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7c1d1d] flex-shrink-0"></div>
                      <span className="text-[13px] uppercase tracking-[0.2em] font-bold text-gray-500">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-10">
                  <button 
                    onClick={scrollToPricing}
                    className="px-14 py-6 bg-[#7c1d1d] text-white text-[12px] uppercase tracking-[0.5em] font-black rounded-2xl hover:bg-[#5a1414] hover:scale-105 transition-all shadow-xl shadow-[#7c1d1d]/20"
                  >
                    WORK WITH ME INSIDE WMHQ
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-[450px] shrink-0">
                <div className="aspect-[4/5] overflow-hidden rounded-[3rem] border border-black/5 shadow-2xl relative group">
                  <img 
                    src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2161101433/settings_images/60d4-5587-aa7-d20e-6dfc5b2d7de5__Sales_Page_-_Hero_Image.png" 
                    alt="Jess Pinili" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-cream border-t border-black/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
           <div className="font-serif text-3xl font-black lowercase italic tracking-tighter">wmhq.</div>
           <div className="flex flex-col items-center gap-6">
              <div className="flex gap-16 text-[11px] uppercase tracking-[0.4em] font-bold text-gray-400">
                 <a href="https://www.jessicapinili.com/jpinili-terms-conditions" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Terms</a>
              </div>
              <div className="flex gap-6 items-center">
                 <a href="https://www.instagram.com/jesspinili/" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                 </a>
                 <a href="https://www.tiktok.com/@jesspinili" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                 </a>
                 <a href="https://www.youtube.com/@jesspinili" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                 </a>
              </div>
           </div>
           <p className="text-[10px] text-gray-300 uppercase tracking-widest-lg font-bold">© 2023 WOMAN MASTERY HQ</p>
        </div>
      </footer>

      {/* Video Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 wmhq-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full wmhq-modal-container bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-[1001] w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="aspect-video w-full">
              <iframe 
                src="https://www.loom.com/embed/8744a2d230244af685987a87d08df158?hide_owner=true&hide_share=true&hide_title=true&hide_status_bar=true&autoplay=1" 
                title="WMHQ Vision Video"
                style={{ border: 0 }}
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;