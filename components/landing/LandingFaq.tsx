'use client';

import React, { useState } from 'react';
import { IconSparkles } from '../icons/LumiIcons';

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

  // Generate FAQPage JSON-LD for Google & AI Answer Engines
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
    <section id="faq" className="py-24 px-4 sm:px-8 bg-background" aria-label="Frequently Asked Questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-[860px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-soft text-[#492673] border border-primary/25 font-black text-xs uppercase tracking-wider mb-3">
            <IconSparkles size={14} className="text-[#522B80]" />
            <span>Answer Engine Optimization & Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-copy tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-copy-muted font-medium mt-2 max-w-lg mx-auto">
            Direct, factual answers designed for human adventurers and AI answer engines alike.
          </p>
        </div>

        {/* Accordion List with Inverted-Pyramid Snippet Structure */}
        <div className="flex flex-col gap-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-surface border-primary/40 shadow-xs'
                    : 'bg-surface/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-primary gap-4"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-base font-extrabold text-copy">{item.question}</h3>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-transform duration-200 shrink-0 ${
                      isOpen
                        ? 'bg-primary text-white rotate-180'
                        : 'bg-slate-100 text-copy-muted'
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-copy-muted font-medium leading-relaxed border-t border-slate-100">
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
