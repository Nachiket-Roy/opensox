"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Calendar, User, ArrowRight, X, ArrowLeft } from 'lucide-react';

interface Newsletter {
  id: number;
  title: string;
  date: string;
  author: string;
  preview: string;
  category: string;
  content: string;
}

const NewsletterTimeline = () => {
  const [lineHeight, setLineHeight] = useState<number>(0);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [activeProgress, setActiveProgress] = useState<number>(0);
  const [glowingDot, setGlowingDot] = useState<number | null>(null);
  const [expandingCard, setExpandingCard] = useState<number | null>(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const newsletters: Newsletter[] = [
    {
      id: 1,
      title: "Product Launch 2.0",
      date: "Nov 15, 2025",
      author: "Sarah Chen",
      preview: "Exciting new features including AI-powered analytics, custom workflows, and enterprise security enhancements.",
      category: "Product Update",
      content: "We're thrilled to announce the launch of our completely redesigned platform. This update includes AI-powered analytics that provide real-time insights, custom workflow builders that adapt to your team's needs, and enterprise-grade security features including SSO, audit logs, and advanced permission controls. Our beta users have reported 50% faster workflows and 80% reduction in manual tasks."
    },
    {
      id: 2,
      title: "Q4 Growth Insights",
      date: "Nov 8, 2025",
      author: "Mike Johnson",
      preview: "Quarterly review showing 145% revenue growth, 50K new users, and expansion into 3 new markets.",
      category: "Business",
      content: "This quarter has been exceptional for our growth trajectory. We've achieved 145% year-over-year revenue growth, welcomed 50,000 new users to our platform, and successfully expanded into the European, Asian, and South American markets. Customer retention remains strong at 95%, and our enterprise segment has grown by 200%. Looking ahead, we're investing heavily in product development and customer success to maintain this momentum."
    },
    {
      id: 3,
      title: "Engineering Deep Dive",
      date: "Nov 1, 2025",
      author: "Alex Rivera",
      preview: "Technical walkthrough of our new microservices architecture and how it improved performance by 300%.",
      category: "Technical",
      content: "Our engineering team has completed a major architectural overhaul, transitioning from a monolithic structure to a microservices-based system. This migration resulted in 300% performance improvements, 99.99% uptime, and dramatically improved scalability. We've implemented event-driven architecture, containerization with Kubernetes, and distributed caching. API response times have dropped from 800ms to 150ms on average."
    },
    {
      id: 4,
      title: "Customer Success Stories",
      date: "Oct 25, 2025",
      author: "Emily Watson",
      preview: "How three enterprise clients transformed their workflows and achieved 10x productivity gains.",
      category: "Case Study",
      content: "This month, we're spotlighting three remarkable customer success stories. TechCorp reduced their deployment time from 2 weeks to 2 days. FinanceHub automated 90% of their reporting workflows, saving 200 hours per month. HealthSystems integrated our platform with their existing tools, resulting in 10x productivity improvements across their operations team. These stories showcase the transformative power of our platform."
    },
    {
      id: 5,
      title: "Team Expansion",
      date: "Oct 18, 2025",
      author: "David Park",
      preview: "Welcoming 12 new team members across engineering, design, and customer success departments.",
      category: "Company News",
      content: "We're excited to welcome 12 talented individuals to our growing team. Our engineering department has added 6 senior developers specializing in backend infrastructure and AI/ML. The design team has expanded with 3 product designers focused on user experience. Customer success has grown with 3 new team members dedicated to enterprise support. Each brings unique expertise and passion for building exceptional products."
    },
    {
      id: 6,
      title: "Security Audit Results",
      date: "Oct 11, 2025",
      author: "Lisa Martinez",
      preview: "Achieved SOC 2 Type II compliance with zero critical findings. Details on our security posture.",
      category: "Security",
      content: "We're proud to announce that we've achieved SOC 2 Type II compliance with zero critical findings. Our comprehensive security audit covered data encryption, access controls, incident response, and monitoring systems. We've implemented bank-level encryption, regular penetration testing, 24/7 security monitoring, and comprehensive backup systems. Security isn't just a feature—it's the foundation of everything we build."
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLineHeight(100);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt((entry.target as HTMLElement).dataset.index || '0', 10);
          
          if (entry.isIntersecting && !visibleCards.has(index)) {
            setTimeout(() => {
              setVisibleCards(prev => new Set([...prev, index]));
              setGlowingDot(index);
              setTimeout(() => setGlowingDot(null), 300);
            }, index * 150);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-50px' }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visibleCards]);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const timelineTop = timelineRect.top;
      const timelineHeight = timelineRect.height;
      
      let progress = 0;
      if (timelineTop < viewportHeight / 2) {
        progress = Math.min(
          100,
          ((viewportHeight / 2 - timelineTop) / timelineHeight) * 100
        );
      }
      
      setActiveProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E10] via-[#15161A] to-[#0E0E10] text-white">
      {/* Header */}
      <div className="pt-16 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#9455f4]/10 border border-[#9455f4]/20 rounded-full mb-6">
          <Mail className="w-4 h-4 text-[#9455f4]" />
          <span className="text-sm text-[#9455f4]">Newsletter Archive</span>
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#9455f4] via-[#7A45C3] to-[#9455f4] bg-clip-text text-transparent">
          Product Updates
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Stay informed with our latest releases, insights, and company news
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-6xl mx-auto px-4 pb-32" ref={timelineRef}>
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
          {/* Background line */}
          <div className="absolute inset-0 bg-[#15161A]"></div>
          
          {/* Animated initial growth */}
          <div 
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#9455f4] via-[#7A45C3] to-[#9455f4] transition-all duration-1000 ease-out"
            style={{ height: `${lineHeight}%` }}
          ></div>
          
          {/* Scroll progress line */}
          <div 
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#9455f4] via-[#7A45C3] to-[#9455f4] transition-all duration-300"
            style={{ height: `${activeProgress}%` }}
          ></div>
        </div>

        {/* Newsletter Cards */}
        <div className="relative space-y-24 pt-8">
          {newsletters.map((newsletter, index) => {
            const isLeft = index % 2 === 0;
            const isVisible = visibleCards.has(index);
            const isGlowing = glowingDot === index;

            return (
              <div
                key={newsletter.id}
                ref={el => {cardRefs.current[index] = el}}
                data-index={index}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 top-8 -translate-x-1/2 z-10">
                  <div className={`relative w-4 h-4 rounded-full bg-[#0E0E10] border-2 transition-all duration-300 ${
                    isVisible 
                      ? 'border-[#9455f4] shadow-lg shadow-[#9455f4]/50' 
                      : 'border-[#15161A]'
                  }`}>
                    {isGlowing && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-[#9455f4] animate-ping"></div>
                        <div className="absolute inset-0 rounded-full bg-[#9455f4] blur-md"></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Card */}
                <div className={`grid grid-cols-2 gap-8 items-center ${
                  isLeft ? '' : 'direction-rtl'
                }`}>
                  <div className={isLeft ? 'col-start-1' : 'col-start-2'}>
                    <div
                      className={`bg-[#15161A]/80 backdrop-blur-sm border border-[#15161A] rounded-2xl p-6 transition-all duration-700 hover:border-[#9455f4]/30 hover:shadow-2xl hover:shadow-[#9455f4]/10 ${
                        isVisible
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-4'
                      } ${
                        expandingCard === index
                          ? 'fixed inset-0 z-50 !scale-150 !opacity-0'
                          : 'relative'
                      }`}
                      style={{
                        transitionDelay: `${index * 120}ms`,
                        ...(expandingCard === index && {
                          top: cardRefs.current[index]?.getBoundingClientRect().top,
                          left: cardRefs.current[index]?.getBoundingClientRect().left,
                          width: cardRefs.current[index]?.offsetWidth,
                          height: cardRefs.current[index]?.offsetHeight,
                          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        })
                      }}
                    >
                      {/* Category Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#9455f4]/10 to-[#7A45C3]/10 border border-[#9455f4]/20 rounded-full mb-4">
                        <span className="text-xs font-medium text-[#9455f4]">
                          {newsletter.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-3 text-white">
                        {newsletter.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{newsletter.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          <span>{newsletter.author}</span>
                        </div>
                      </div>

                      {/* Preview */}
                      <p className="text-slate-300 mb-6 leading-relaxed">
                        {newsletter.preview}
                      </p>

                      {/* Read More Button */}
                      <button 
                        onClick={() => {
                          setExpandingCard(index);
                          setTimeout(() => {
                            setSelectedNewsletter(newsletter);
                          }, 600);
                        }}
                        className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9455f4] to-[#7A45C3] rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-[#9455f4]/25 transition-all"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* End Marker */}
        <div className="relative mt-24 flex justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9455f4] to-[#7A45C3] shadow-lg shadow-[#9455f4]/50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#0E0E10]"></div>
          </div>
        </div>
      </div>

      {/* Full Article View */}
      {selectedNewsletter && (
        <div 
          className="fixed inset-0 z-50 bg-[#0E0E10]/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => {
            setSelectedNewsletter(null);
            setExpandingCard(null);
          }}
        >
          <div 
            className="h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-4xl mx-auto px-4 py-16">
              {/* Back Button */}
              <button
                onClick={() => {
                  setSelectedNewsletter(null);
                  setExpandingCard(null);
                }}
                className="group inline-flex items-center gap-2 px-4 py-2 mb-8 bg-[#15161A] hover:bg-[#15161A]/80 border border-[#15161A] rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Timeline
              </button>

              {/* Article Card */}
              <div className="bg-[#15161A] backdrop-blur-sm border border-[#15161A] rounded-2xl p-8 shadow-2xl">
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#9455f4]/10 to-[#7A45C3]/10 border border-[#9455f4]/20 rounded-full mb-6">
                  <span className="text-xs font-medium text-[#9455f4]">
                    {selectedNewsletter.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4 text-white">
                  {selectedNewsletter.title}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#15161A]">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-5 h-5" />
                    <span>{selectedNewsletter.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <User className="w-5 h-5" />
                    <span>{selectedNewsletter.author}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-slate-300 leading-relaxed text-lg mb-6">
                    {selectedNewsletter.content}
                  </p>
                  
                  <div className="mt-12 p-6 bg-gradient-to-r from-[#9455f4]/10 to-[#7A45C3]/10 border border-[#9455f4]/20 rounded-xl">
                    <h3 className="text-xl font-semibold text-white mb-3">Key Takeaways</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li>Comprehensive platform improvements and new features</li>
                      <li>Enhanced performance and security measures</li>
                      <li>Strong focus on user experience and customer success</li>
                      <li>Continued investment in innovation and growth</li>
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-8 border-t border-[#15161A]">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-[#9455f4] to-[#7A45C3] rounded-lg font-medium hover:shadow-lg hover:shadow-[#9455f4]/25 transition-all">
                    Share Article
                  </button>
                  <button className="px-6 py-3 bg-[#15161A] hover:bg-[#15161A]/80 border border-[#15161A] rounded-lg font-medium transition-all">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterTimeline;