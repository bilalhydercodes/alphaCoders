'use client';

import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is Life RPG?',
    answer:
      'Life RPG is a gamified productivity web application that translates real-world daily tasks, studying, and fitness into an engaging virtual Role-Playing Game. Users earn Experience Points (XP) and Bounty Gold (GP) for completing tasks, level up their character across five real-life attributes, and interact with an autonomous 3D companion mascot named Lumi.',
  },
  {
    question: 'How does Life RPG solve the delayed gratification problem?',
    answer:
      'Traditional to-do apps fail because real-world results take months to feel rewarding, causing tasks to feel like chores. Life RPG replaces this delayed gratification with instant dopamine loops: ballistic XP particle animations, celebratory audio chimes, streak protection, and tangible gold currency that can be spent in the Guild Emporium.',
  },
  {
    question: 'Who is Lumi, and what does the 3D companion do?',
    answer:
      'Lumi is an autonomous 3D companion mascot who inhabits the interface of Life RPG. Unlike static illustrations or decorative images, Lumi uses a real-time behavioral decision engine to track user attention, react to quest completions, celebrate level-ups with synchronized choreography, and study alongside you in deep focus mode.',
  },
  {
    question: 'How does the non-linear leveling progression engine work?',
    answer:
      'Each subsequent level in Life RPG requires compounding XP calculated dynamically as baseXP * (level ^ 1.5). This non-linear curve ensures that beginners gain rapid early momentum while veteran adventurers experience meaningful long-term progression that mirrors real-world skill mastery.',
  },
  {
    question: 'Is user data securely stored and synced across devices?',
    answer:
      'Yes. Life RPG runs on a full-stack relational architecture using Prisma ORM with SQLite or PostgreSQL database persistence. User accounts are protected with secure bcrypt password hashing and HTTP-only session cookies, ensuring historical quest completions and character stats persist reliably across any device.',
  },
];

export const LandingFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generate FAQPage JSON-LD for Search Engines
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-20 sm:py-24 px-4 sm:px-8 md:px-12 lg:px-16 bg-draft-paper scroll-mt-20 select-none" aria-label="Frequently Asked Questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-[880px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-5xl font-semibold text-[#1F1730] tracking-[-0.035em] leading-[1.06] font-headline">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg text-[#5C5070] font-medium mt-3 leading-relaxed max-w-xl mx-auto">
            Everything you need to know about quests, character progression, and Lumi.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3.5 w-full">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`border transition-colors duration-150 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#9966CC]/60 shadow-xs'
                    : 'bg-white border-[#E2D9F3] hover:border-[#9966CC]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-primary gap-4"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-[#1F1730] font-headline">{item.question}</h3>
                  <span
                    className={`w-7 h-7 flex items-center justify-center text-xs font-bold transition-transform duration-200 shrink-0 border border-[#2E2438] ${
                      isOpen
                        ? 'bg-[#9966CC] text-white rotate-180'
                        : 'bg-[#F4EFFF] text-[#1F1730]'
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#5C5070] font-normal leading-relaxed border-t border-[#E2D9F3]/50">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
