/**
 * Subject-specific encouragement messages that connect learning to real life.
 * These messages show students how what they're learning applies to their everyday activities.
 */

/**
 * Encouragement messages organized by subject.
 * Each array contains i18n keys for subject-specific real-life connections.
 */
export const encouragement: Record<string, string[]> = {
  math: [
    'encouragement.math.0', // Percentages: spotting fake sales
    'encouragement.math.1', // Ratios: scaling recipes
    'encouragement.math.2', // Interest: understanding loan costs
    'encouragement.math.3', // Statistics: seeing through misleading graphs
    'encouragement.math.4', // Mental math: splitting bills
    'encouragement.math.5', // Probability: why lottery doesn't work
    'encouragement.math.6', // Area: how much paint to buy
    'encouragement.math.7', // Scale: reading maps
    'encouragement.math.8', // Fractions: splitting fairly
    'encouragement.math.9', // Unit conversion: recipes with cups/ounces
  ],

  physics: [
    'encouragement.physics.0', // Phone battery in winter
    'encouragement.physics.1', // Optics: mirrors making you look different
    'encouragement.physics.2', // Heat transfer: freezing in wet clothes
    'encouragement.physics.3', // Electricity: charger speeds
    'encouragement.physics.4', // Mechanics: not falling off a bike
    'encouragement.physics.5', // Sound: lightning before thunder
    'encouragement.physics.6', // Aerodynamics: car spoilers
    'encouragement.physics.7', // Friction: winter tires
    'encouragement.physics.8', // Pressure: ears hurting on planes
    'encouragement.physics.9', // Buoyancy: steel ships floating
  ],

  logic: [
    'encouragement.logic.0', // Fake news detection
    'encouragement.logic.1', // Spotting bad arguments
    'encouragement.logic.2', // Fake vs real reviews
    'encouragement.logic.3', // Pattern recognition in games
    'encouragement.logic.4', // Fastest vs shortest route
    'encouragement.logic.5', // Seeing through manipulative ads
    'encouragement.logic.6', // Debugging code or devices
    'encouragement.logic.7', // Clickbait vs real news
    'encouragement.logic.8', // If-then: foreseeing consequences
    'encouragement.logic.9', // Finding liars in social deduction games
  ],

  music: [
    'encouragement.music.0', // Rhythm for dancing/sports
    'encouragement.music.1', // Ear training: off-key karaoke
    'encouragement.music.2', // Why songs sound sad/happy
    'encouragement.music.3', // Keeping time: rapping, editing videos
    'encouragement.music.4', // Intervals: playing by ear
    'encouragement.music.5', // Harmony: goosebumps from chords
    'encouragement.music.6', // Sheet music: play without hearing first
    'encouragement.music.7', // Dynamics: perceiving emotions
    'encouragement.music.8', // Music theory for beat production
    'encouragement.music.9', // Rhythm: staying on beat
  ],

  german: [
    'encouragement.german.0', // Understanding contracts/terms
    'encouragement.german.1', // Spotting manipulative ads
    'encouragement.german.2', // Writing effective complaints
    'encouragement.german.3', // Protection from phishing/scams
    'encouragement.german.4', // Vocabulary: precise expression
    'encouragement.german.5', // Grammar: avoiding misunderstandings
    'encouragement.german.6', // Seeing through political rhetoric
    'encouragement.german.7', // Understanding medication instructions
    'encouragement.german.8', // Writing messages that get taken seriously
    'encouragement.german.9', // Clickbait vs real news
  ],

  english: [
    'encouragement.english.0', // Games/shows without subtitles
    'encouragement.english.1', // Programming tutorials
    'encouragement.english.2', // Traveling
    'encouragement.english.3', // Chatting and gaming worldwide
    'encouragement.english.4', // Understanding lyrics
    'encouragement.english.5', // Error messages save troubleshooting time
    'encouragement.english.6', // Reddit, Discord communities
    'encouragement.english.7', // Tech news first in English
    'encouragement.english.8', // International collaborations
    'encouragement.english.9', // Product reviews before buying
  ],

  history: [
    'encouragement.history.0', // Understanding current conflicts through their roots
    'encouragement.history.1', // Recognizing propaganda patterns
    'encouragement.history.2', // Why borders and countries are shaped this way
    'encouragement.history.3', // Understanding traditions and customs
    'encouragement.history.4', // Seeing through political manipulation
    'encouragement.history.5', // Why some places are richer than others
    'encouragement.history.6', // Understanding monuments and memorials
    'encouragement.history.7', // Why laws and rights exist
    'encouragement.history.8', // Learning from past mistakes
    'encouragement.history.9', // Understanding family stories and heritage
  ],

  fallback: [
    'encouragement.fallback.0', // Real problems in everyday life
    'encouragement.fallback.1', // Knowledge protects from being ripped off
    'encouragement.fallback.2', // Understanding > memorizing
    'encouragement.fallback.3', // Mistakes are fine if you learn
    'encouragement.fallback.4', // Every topic connects to real life
    'encouragement.fallback.5', // Understanding makes you harder to manipulate
    'encouragement.fallback.6', // Difficult tasks make you stronger
    'encouragement.fallback.7', // Curiosity drives learning
    'encouragement.fallback.8', // Critical thinking: good vs bad info
    'encouragement.fallback.9', // Understanding = better decisions
  ],
}
