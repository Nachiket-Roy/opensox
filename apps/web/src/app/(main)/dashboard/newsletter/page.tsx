"use client";
import React, { useState, useEffect, useRef } from "react";
import { Calendar, User, ArrowRight, ArrowLeft } from "lucide-react";
import { Newsletter, newsletters } from "@/data/newsletter";

const NewsletterTimeline = () => {
  const [lineHeight, setLineHeight] = useState<number>(0);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [activeProgress, setActiveProgress] = useState<number>(0);
  const [glowingDot, setGlowingDot] = useState<number | null>(null);
  const [activeDot, setActiveDot] = useState<number | null>(null);
  const [expandingCard, setExpandingCard] = useState<number | null>(null);
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<Newsletter | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [sortType, setSortType] = useState<"newest" | "oldest">("newest");
  const previousActiveElement = useRef<HTMLElement | null>(null); 

  const closeModal = () => {
  setSelectedNewsletter(null);
  setExpandingCard(null);
  previousActiveElement.current?.focus();
};


  const parseDate = (dateStr: string): Date => {
    const months: Record<string, number> = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const [month, dayWithComma, year] = dateStr.split(" ");

    return new Date(
      Number(year),
      months[month],
      Number(dayWithComma.replace(",", ""))
    );
  };

  const filteredNewsletters = newsletters
    .filter((n) => {
      const d = parseDate(n.date);
      const month = d.getMonth() + 1;
      const year = d.getFullYear();

      const monthMatches =
        filterMonth === "all" || Number(filterMonth) === month;
      const yearMatches = filterYear === "all" || Number(filterYear) === year;

      return monthMatches && yearMatches;
    })
    .sort((a, b) => {
      const da = parseDate(a.date).getTime();
      const db = parseDate(b.date).getTime();
      return sortType === "newest" ? db - da : da - db;
    });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLineHeight(100);
      setActiveDot(0);
      setVisibleCards(new Set([0]));
      setGlowingDot(0);
      setTimeout(() => setGlowingDot(null), 300);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
  if (!selectedNewsletter) return;

  const modal = document.getElementById("newsletter-modal");
  const firstFocusable = document.getElementById("modal-back-button");

  // store old focus
  previousActiveElement.current = document.activeElement as HTMLElement;

  // move focus into modal
  firstFocusable?.focus();

  const handleTab = (e: KeyboardEvent) => {
    if (!modal) return;

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener("keydown", handleTab);
  return () => {
    document.removeEventListener("keydown", handleTab);
  };
}, [selectedNewsletter]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(
            (entry.target as HTMLElement).dataset.index || "0",
            10
          );

          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              if (prev.has(index)) return prev;
              return new Set([...prev, index]);
            });
            setActiveDot((prev) => {
              if (prev !== index) {
                setGlowingDot(index);
                setTimeout(() => setGlowingDot(null), 300);
              }
              return index;
            });
          }
        });
      },
      { threshold: 0.5, rootMargin: "-100px 0px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

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

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (!selectedNewsletter) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedNewsletter(null);
        setExpandingCard(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selectedNewsletter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E10] via-[#15161A] to-[#0E0E10] text-white">
      {/* Header */}
      <div className="pt-16 pb-12 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#9455f4] via-[#7A45C3] to-[#9455f4] bg-clip-text text-transparent">
          Newsletter
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Stay informed with our latest releases, insights, and company news
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as "newest" | "oldest")}
          className="bg-[#15161A] border border-[#27272A] rounded-lg px-3 py-2"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="bg-[#15161A] border border-[#27272A] rounded-lg px-3 py-2"
        >
          <option value="all">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="bg-[#15161A] border border-[#27272A] rounded-lg px-3 py-2"
        >
          <option value="all">All Years</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-7xl mx-auto px-4 pb-32" ref={timelineRef}>
        {/* Central Timeline Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
          <div className="absolute inset-0 bg-[#15161A]"></div>
          <div
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#9455f4] via-[#7A45C3] to-[#9455f4] transition-all duration-1000 ease-out"
            style={{ height: `${lineHeight}%` }}
          ></div>
          <div
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#9455f4] via-[#7A45C3] to-[#9455f4] transition-all duration-300"
            style={{ height: `${activeProgress}%` }}
          ></div>
        </div>

        {/* Newsletter Cards */}
        <div className="relative space-y-8 md:space-y-24 pt-8">
          {filteredNewsletters.map((newsletter, index) => {
            const isLeft = index % 2 === 0;
            const isVisible = visibleCards.has(index);
            const isGlowing = glowingDot === index;
            const isActive = activeDot === index;

            return (
              <div
                key={newsletter.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                data-index={index}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2 z-10">
                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9455f4] to-[#7A45C3] shadow-lg shadow-[#9455f4]/50 flex items-center justify-center transition-all duration-500">
                      <div className="w-3 h-3 rounded-full bg-[#0E0E10]"></div>
                      {isGlowing && (
                        <>
                          <div className="absolute inset-0 rounded-full bg-[#9455f4] animate-ping"></div>
                          <div className="absolute inset-0 rounded-full bg-[#9455f4] blur-md"></div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`relative w-4 h-4 rounded-full bg-[#0E0E10] border-2 transition-all duration-500 ${
                        isVisible
                          ? "border-[#9455f4] shadow-lg shadow-[#9455f4]/50"
                          : "border-[#15161A]"
                      }`}
                    ></div>
                  )}
                </div>

                {/* Horizontal Connector Line */}
                <div
                  className={`hidden md:block absolute top-8 h-0.5 transition-all duration-700 ${
                    isLeft ? "right-1/2 mr-2" : "left-1/2 ml-2"
                  }`}
                  style={{
                    width: isVisible ? "calc(50% - 2rem)" : "0",
                    transitionDelay: isVisible
                      ? "0ms"
                      : `${index * 120 + 200}ms`,
                    background: isVisible
                      ? `linear-gradient(to ${isLeft ? "left" : "right"}, #9455f4, #7A45C3)`
                      : "#15161A",
                    transformOrigin: isLeft ? "right" : "left",
                  }}
                />

                {/* Card */}
                <div className="md:grid md:grid-cols-2 md:gap-4 items-center">
                  <div
                    className={
                      isLeft
                        ? "md:col-start-1 md:pr-4"
                        : "md:col-start-2 md:pl-4"
                    }
                  >
                    <div
                      className={`bg-[#15161A]/80 backdrop-blur-sm border border-[#15161A] rounded-2xl overflow-hidden transition-all duration-700 hover:border-[#9455f4]/30 hover:shadow-2xl hover:shadow-[#9455f4]/10 ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      } ${
                        expandingCard === index
                          ? "fixed inset-0 z-50 !scale-150 !opacity-0"
                          : "relative"
                      }`}
                      style={{
                        transitionDelay: isVisible ? "0ms" : `${index * 120}ms`,
                        ...(expandingCard === index && {
                          top: cardRefs.current[index]?.getBoundingClientRect()
                            .top,
                          left: cardRefs.current[index]?.getBoundingClientRect()
                            .left,
                          width: cardRefs.current[index]?.offsetWidth,
                          height: cardRefs.current[index]?.offsetHeight,
                          transition:
                            "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }),
                      }}
                    >
                      {/* Image */}
                      {newsletter.image && (
                        <div className="relative w-full h-48 overflow-hidden">
                          <img
                            src={newsletter.image}
                            alt={newsletter.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#15161A] to-transparent"></div>
                        </div>
                      )}

                      <div className="p-6">
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
              </div>
            );
          })}
        </div>

        {/* End Marker */}
        <div className="hidden md:flex relative mt-24 justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9455f4] to-[#7A45C3] shadow-lg shadow-[#9455f4]/50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#0E0E10]"></div>
          </div>
        </div>
      </div>

      {/* Full Article View */}
      {selectedNewsletter && (
        <div
          id="newsletter-modal"
          className="fixed inset-0 z-50 bg-[#0E0E10]/95 backdrop-blur-md animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
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
                id="modal-back-button" 
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
              <div className="bg-[#15161A] backdrop-blur-sm border border-[#15161A] rounded-2xl overflow-hidden shadow-2xl">
                {/* Hero Image */}
                {selectedNewsletter.image && (
                  <div className="relative w-full h-96 overflow-hidden">
                    <img
                      src={selectedNewsletter.image}
                      alt={selectedNewsletter.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#15161A] via-[#15161A]/50 to-transparent"></div>
                  </div>
                )}

                <div className="p-8">
                  {/* Title */}
                  <h1
                    id="modal-title"
                    className="text-4xl font-bold mb-4 text-white"
                  >
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

                    {selectedNewsletter.takeaways && (
                      <div className="mt-12 p-6 bg-gradient-to-r from-[#9455f4]/10 to-[#7A45C3]/10 border border-[#9455f4]/20 rounded-xl">
                        <h3 className="text-xl font-semibold text-white mb-3">
                          Key Takeaways
                        </h3>
                        <ul className="space-y-2 text-slate-300">
                          {selectedNewsletter.takeaways.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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
