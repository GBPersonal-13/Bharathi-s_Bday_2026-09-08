/**
 * =====================================================================
 * HER BIRTHDAY STORY — CONFIGURATION
 * Personalize your memories, quiz questions, and secret date here.
 * =====================================================================
 */
window.HER_CONFIG = {
  // Page 2: Our Story timeline chapters
  CHAPTERS: [
    {
      label: "CHAPTER 01",
      title: "The Beginning",
      icon: "🌸",
      date: "[Date]",
      note: "This is where our story quietly began.",
      body: "[Write a short description of how you two met or first started talking.]"
    },
    {
      label: "CHAPTER 02",
      title: "The First Memory",
      icon: "🎏",
      date: "[Date]",
      note: "I still think about this one.",
      body: "[Write a short, personal message about your first real memory together.]"
    },
    {
      label: "CHAPTER 03",
      title: "That One Day",
      icon: "🕊️",
      date: "[Date]",
      note: "One of my favorite days.",
      body: "[Describe one specific, memorable moment — funny, meaningful, or both.]"
    },
    {
      label: "CHAPTER 04",
      title: "Somehow, You Became Home",
      icon: "🌙",
      date: "[Date]",
      note: "You, unexpectedly, everywhere.",
      body: "[Write something more emotional — when you realized how much she meant to you.]"
    },
    {
      label: "FINAL CHAPTER",
      title: "And we're still writing it...",
      icon: "🎐",
      date: "[Today]",
      note: "To be continued.",
      body: "[A closing line about where things stand now, and where you hope they go.]"
    }
  ],

  // Page 3: Love Quiz questions
  QUIZ: [
    { q: "Who fell first?", options: ["Me", "You", "Honestly, both at once"] },
    { q: "Who is more dramatic?", options: ["Me", "You", "We're equally unwell"] },
    { q: "What would we probably do on a rainy day?", options: ["Stay in bed all day", "Watch a movie and complain about the ending", "Order way too much food"] },
    { q: "Which place would I take you to?", options: ["[Place 1]", "[Place 2]", "[Place 3]"] },
    { q: "What's our most chaotic memory?", options: ["[Memory 1]", "[Memory 2]", "[Memory 3]"] },
    { q: "Who is more likely to say \"I'm not hungry\" and then steal your food?", options: ["Me", "You", "Both 😂"] }
  ],

  correctFeedback: [
    "You know us too well. 🌸",
    "That's exactly right.",
    "Yes — you get it."
  ],

  wrongFeedback: [
    "Hmm... I'll allow it. 😂",
    "Close enough, honestly.",
    "We'll pretend that's right."
  ],

  // Page 6: Secret password(s) — case-insensitive, ignores spaces
  SECRET_ANSWERS: [
    "dd.mm.yyyy",
    "[your real date here]"
  ]
};
