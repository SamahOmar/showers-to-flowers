export const GROWTH_THRESHOLDS = {
  SEED: 0,
  SPROUT: 40,
  BLOOM: 100,
  OVERWATERED: 110,
  MAX: 120,
};

export const PLANT_STAGES = [
  { threshold: GROWTH_THRESHOLDS.SEED, emoji: "\u{1F331}", label: "seed", cls: "stage-seed" },
  { threshold: GROWTH_THRESHOLDS.SPROUT, emoji: "\u{1F33F}", label: "sprout", cls: "stage-sprout" },
  { threshold: GROWTH_THRESHOLDS.BLOOM, emoji: "\u{1F338}", label: "bloom", cls: "stage-bloom" },
  { threshold: GROWTH_THRESHOLDS.OVERWATERED, emoji: "\u{1F940}", label: "overwatered", cls: "stage-dead" },
];

export const GROWTH_LABELS = {
  seed: "\u{1F331} Seed",
  sprout: "\u{1F33F} Sprout",
  bloom: "\u{1F338} Flower!",
  overwatered: "\u{1F940} Overwatered",
};



// Game configurations and layout definitions
export const GROWTH_STAGES = {
    SEED: 0,
    SPROUT: 40,
    BLOOM: 100,
    DRAMA_QUEEN: 110,
    MAX_CAP: 120
};

export const RAIN_SETTINGS = {
    MAX_DROPS: 150,
    DROP_SPEED_MIN: 4,
    DROP_SPEED_MAX: 8,
    GLITTER_GLOW_RADIUS: 12
};

// 🌟 Make sure this exact block is exported perfectly
export const GLAMOUR_COLORS = {
    NEON_PINK: '#FF69B4',
    PASTEL_PINK: '#FFB6C1',
    GOLDEN_HOUR: '#FFD700',
    DRAMA_SHADES: '#000000'
};
