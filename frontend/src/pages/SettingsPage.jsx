"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiLock,
  FiBell,
  FiGlobe,
  FiSettings,
  FiMoon,
  FiLogOut,
  FiHelpCircle,
  FiList,
} from "react-icons/fi";

const sidebarSections = [
  {
    key: "general",
    label: "General",
    icon: <FiUser />,
  },
  {
    key: "security",
    label: "Security",
    icon: <FiLock />,
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: <FiBell />,
  },
  {
    key: "preference",
    label: "Preference",
    icon: <FiList />,
  },
  {
    key: "language",
    label: "Language",
    icon: <FiGlobe />,
  },
  {
    key: "advanced",
    label: "Advanced",
    icon: <FiSettings />,
  },
  {
    key: "help",
    label: "Help",
    icon: <FiHelpCircle />,
  },
  {
    key: "logout",
    label: "Logout",
    icon: <FiLogOut />,
  },
];

function SectionCard({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="mb-7 w-full rounded-2xl bg-gradient-to-tr from-neutral-900 via-[#171c29] to-neutral-900/80 p-7 shadow-2xl ring-1 ring-white/10"
    >
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-white mb-1">
          {title}
        </h3>
        {description && (
          <div className="text-sm text-neutral-300">{description}</div>
        )}
      </div>
      {children}
    </motion.div>
  );
}

const onboardingQuestions = [
  {
    id: "exploreStyle",
    label: "How do you like to explore space?",
    description: "Choose what resonates with you",
    options: [
      "Simple visuals",
      "Detailed science",
      "Advanced astronomy",
      "Immersive experiences",
    ],
  },
  {
    id: "journeyLevel",
    label: "Where are you on your space journey?",
    description: "Choose what resonates with you",
    options: [
      "Just starting",
      "Some basics",
      "Advanced explorer",
      "Expert navigator",
    ],
  },
  {
    id: "wowFactor",
    label: "What kind of space wonders make you go wow?",
    description: "Choose what resonates with you",
    options: [
      "Quick fun facts",
      "Deep science",
      "Stories & myths",
      "A mix of everything",
    ],
  },
  {
    id: "favoriteDomain",
    label: "Which part of the universe sparks your imagination the most?",
    description: "Choose what resonates with you",
    options: [
      "Stars & constellations",
      "Planets & orbits",
      "Life in space",
      "Space missions",
    ],
  },
];

export default function SettingsPage() {
  const [selected, setSelected] = useState("general");
  const [settings, setSettings] = useState({
    name: "Jane Astrea",
    bio: "Star chaser & planetary explorer",
    email: "jane@exosky.com",
    darkMode: true,
    language: "English",
    twoFA: false,
    newsUpdates: true,
    productEmails: false,
    fontSize: "Medium",
    // --- Onboarding preferences state below ---
    exploreStyle: "Simple visuals",
    journeyLevel: "Just starting",
    wowFactor: "Quick fun facts",
    favoriteDomain: "Stars & constellations",
  });

  // Helper to update any setting
  function updateSetting(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  // --- Section content definitions ---
  const sectionContent = {
    general: (
      <>
        <SectionCard title="Profile">
          <div className="flex items-center gap-6">
            <img
              src="https://i.pravatar.cc/120?u=exosky_demo"
              alt="avatar"
              className="h-16 w-16 rounded-full border-2 border-indigo-500"
            />
            <div>
              <input
                value={settings.name}
                onChange={(e) => updateSetting("name", e.target.value)}
                className="text-lg bg-neutral-800 rounded-md px-3 py-2 text-white font-semibold w-full mb-2"
                placeholder="Your name"
              />
              <input
                value={settings.bio}
                onChange={(e) => updateSetting("bio", e.target.value)}
                className="text-sm bg-neutral-800 rounded-md px-3 py-2 text-neutral-300 w-full"
                placeholder="Short bio"
              />
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Email">
          <input
            value={settings.email}
            onChange={(e) => updateSetting("email", e.target.value)}
            className="text-base w-full bg-neutral-800 rounded-md px-4 py-3 text-white font-medium"
            placeholder="Email Address"
          />
        </SectionCard>
      </>
    ),
    security: (
      <>
        <SectionCard
          title="Password"
          description="Change your account password."
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
            onClick={() => alert("Password reset modal!")}
          >
            Change Password
          </motion.button>
        </SectionCard>
        <SectionCard
          title="Two-Factor Authentication"
          description="Enhance your account security with 2FA."
        >
          <div className="flex items-center justify-between">
            <div className="text-white">Enable 2FA</div>
            <input
              type="checkbox"
              className="h-5 w-5 accent-indigo-500 rounded"
              checked={settings.twoFA}
              onChange={(e) => updateSetting("twoFA", e.target.checked)}
            />
          </div>
        </SectionCard>
      </>
    ),
    notifications: (
      <>
        <SectionCard
          title="Announcements & Updates"
          description="Choose which emails you'd like to receive."
        >
          <div className="flex flex-col gap-4">
            <label className="flex justify-between items-center">
              <span className="text-white">News and Updates</span>
              <input
                type="checkbox"
                className="accent-indigo-500 h-5 w-5 rounded"
                checked={settings.newsUpdates}
                onChange={(e) => updateSetting("newsUpdates", e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center">
              <span className="text-white">Product Emails</span>
              <input
                type="checkbox"
                className="accent-indigo-500 h-5 w-5 rounded"
                checked={settings.productEmails}
                onChange={(e) =>
                  updateSetting("productEmails", e.target.checked)
                }
              />
            </label>
          </div>
        </SectionCard>
      </>
    ),
    preference: (
      <>
        {onboardingQuestions.map((question) => (
          <SectionCard
            key={question.id}
            title={question.label}
            description={question.description}
          >
            <div className="flex flex-col gap-4 w-full">
              {question.options.map((option) => (
                <motion.label
                  whileHover={{
                    scale: 1.015,
                    boxShadow: "0px 2px 16px #15192b44",
                  }}
                  key={option}
                  htmlFor={`${question.id}-${option}`}
                  className={`flex items-center justify-between px-6 py-4 rounded-xl cursor-pointer transition-colors border border-transparent text-lg
                      bg-neutral-800
                      ${
                        settings[question.id] === option
                          ? "ring-2 ring-indigo-500 bg-indigo-900/30 border-indigo-600"
                          : "hover:bg-neutral-700/60"
                      }
                    `}
                >
                  <span className="text-white">{option}</span>
                  <span className="ml-8">
                    <input
                      id={`${question.id}-${option}`}
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={settings[question.id] === option}
                      onChange={() => updateSetting(question.id, option)}
                      className="w-5 h-5 accent-indigo-500 bg-transparent rounded-full border border-indigo-500 transition"
                    />
                  </span>
                </motion.label>
              ))}
            </div>
          </SectionCard>
        ))}
      </>
    ),
    language: (
      <SectionCard title="Language">
        <select
          value={settings.language}
          onChange={(e) => updateSetting("language", e.target.value)}
          className="bg-neutral-800 text-white px-4 py-2 rounded-md"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </SectionCard>
    ),
    advanced: (
      <SectionCard
        title="Reset All Settings"
        description="Restore all settings to their defaults."
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          onClick={() => alert("All settings reset!")}
        >
          Reset Settings
        </motion.button>
      </SectionCard>
    ),
    help: (
      <SectionCard title="Get Help">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          onClick={() => alert("Contact support!")}
        >
          Contact Support
        </motion.button>
      </SectionCard>
    ),
    logout: (
      <SectionCard title="Logout">
        <motion.button
          whileHover={{ scale: 1.08 }}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-white/10 hover:bg-neutral-950 transition"
          onClick={() => alert("User logged out!")}
        >
          Logout
        </motion.button>
      </SectionCard>
    ),
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-[#131521] via-[#191a28] to-[#101019]">
      {/* Sidebar */}
      <aside className="h-full w-[250px] min-w-[210px] border-r border-white/10 py-8 px-4 flex flex-col bg-gradient-to-b from-[#18192b]/90 to-[#0e0f13]/90 shadow-xl">
        <nav className="flex flex-col gap-2">
          {sidebarSections.map(({ key, label, icon }) => (
            <motion.button
              key={key}
              className={`flex items-center gap-4 px-3 py-3 text-left rounded-lg font-semibold text-md transition ${
                selected === key
                  ? "bg-indigo-600/80 text-white ring-2 ring-indigo-400/50"
                  : "text-neutral-300 hover:bg-white/5"
              }`}
              onClick={() => setSelected(key)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              aria-current={selected === key ? "page" : undefined}
            >
              <span className="text-lg">{icon}</span>
              <span className="tracking-wide">{label}</span>
            </motion.button>
          ))}
        </nav>
      </aside>
      {/* Content Area */}
      <main className="flex-1 h-full overflow-y-auto px-8 py-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, type: "spring" }}
            className="mx-auto max-w-2xl"
          >
            {sectionContent[selected]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
