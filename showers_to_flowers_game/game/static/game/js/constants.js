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

export const RAIN_SETTINGS = {
  INTERVAL_MS: 95,
  FALL_SPEED: 7.5,
  STREAM_FOLLOW: 0.18,
  DROP_ORIGIN_X: 32,
  DROP_ORIGIN_Y: 48,
  WATER_AMOUNT: 2,
};
