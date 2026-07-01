// The 20 assessment questions and the four forces they map to.
// This file is the single source of truth for the question set.

export type Force = "noise" | "bias" | "accumulation" | "incentive";

export type ForceInfo = {
  id: Force;
  name: string;
  description: string;
};

// The four Decision Distortion forces, in canonical order. This order is also
// used to break ties when picking the dominant force.
export const FORCES: ForceInfo[] = [
  {
    id: "noise",
    name: "Noise",
    description:
      "Unwanted variability in judgment — identical inputs producing different conclusions, with no principled reason.",
  },
  {
    id: "bias",
    name: "Bias",
    description:
      "Directional distortion — the same kind of mistake, repeatedly, pointing the same way.",
  },
  {
    id: "accumulation",
    name: "Accumulation",
    description:
      "Individually defensible decisions that become unsteerable in aggregate, with the subtractive option kept invisible.",
  },
  {
    id: "incentive",
    name: "Incentive Misalignment",
    description:
      "The environmental layer — metrics, compensation, reward structures — that governs how fast the other three forces compound.",
  },
];

export type Question = {
  id: string;
  force: Force;
  text: string;
  // Every question is worded as a healthy behavior and reverse-scored, so
  // Disagree = distortion present. Kept as a flag in case an item ever needs
  // standard scoring.
  reverseScored: boolean;
};

export const QUESTIONS: Question[] = [
  // NOISE
  {
    id: "N1",
    force: "noise",
    text: "Before a major decision, we explicitly agree on which data we need — before anyone starts analyzing anything.",
    reverseScored: true,
  },
  {
    id: "N2",
    force: "noise",
    text: "Before we look at the data, we agree on what good looks like — so the data can't be interpreted to fit a conclusion we've already reached.",
    reverseScored: true,
  },
  {
    id: "N3",
    force: "noise",
    text: "After a major decision is made, people in the room would describe what was decided the same way.",
    reverseScored: true,
  },
  {
    id: "N4",
    force: "noise",
    text: "Across our organization, two people given identical information would reach the same conclusion — without needing to consult each other first.",
    reverseScored: true,
  },
  {
    id: "N5",
    force: "noise",
    text: "When we make a major decision, we document the reasoning behind it — including what we considered and rejected — so we can learn from it later rather than repeat it.",
    reverseScored: true,
  },

  // BIAS
  {
    id: "B1",
    force: "bias",
    text: "When evidence pushes back on a direction we favor, we treat it as signal — not as a problem to be explained away.",
    reverseScored: true,
  },
  {
    id: "B2",
    force: "bias",
    text: "In our organization, the person who challenges the prevailing view in a meeting is respected for it — not quietly noted for it.",
    reverseScored: true,
  },
  {
    id: "B3",
    force: "bias",
    text: "Before we use a past success to justify a current decision, we explicitly examine whether the conditions that produced that success still exist.",
    reverseScored: true,
  },
  {
    id: "B4",
    force: "bias",
    text: "Before major decisions, we deliberately look for risks we wouldn't recognize from experience alone — because the most dangerous risks are the ones our past hasn't prepared us to see.",
    reverseScored: true,
  },
  {
    id: "B5",
    force: "bias",
    text: "In our organization, the sequence in which people share views during a major decision is actively managed to prevent early opinions from dominating the outcome.",
    reverseScored: true,
  },

  // ACCUMULATION
  {
    id: "A1",
    force: "accumulation",
    text: "When something isn't working, we seriously consider eliminating it — not just fixing it or adding resources to it.",
    reverseScored: true,
  },
  {
    id: "A2",
    force: "accumulation",
    text: "In our strategic discussions, subtraction — stopping, exiting, or simplifying — gets the same consideration as addition.",
    reverseScored: true,
  },
  {
    id: "A3",
    force: "accumulation",
    text: "When performance falls short, we diagnose what's actually wrong before adding people, budget, or features — because more resources applied to the wrong problem make the problem worse.",
    reverseScored: true,
  },
  {
    id: "A4",
    force: "accumulation",
    text: "We regularly step back to assess what all of our decisions together have created — because individually defensible choices can combine into a position no single decision would have produced.",
    reverseScored: true,
  },
  {
    id: "A5",
    force: "accumulation",
    text: "When we've invested significantly in a direction, we evaluate whether to continue based on future potential — not on what we've already spent.",
    reverseScored: true,
  },

  // INCENTIVE MISALIGNMENT
  {
    id: "I1",
    force: "incentive",
    text: "The metrics we report to outside evaluators and the metrics we actually run the business by are the same list.",
    reverseScored: true,
  },
  {
    id: "I2",
    force: "incentive",
    text: "In our organization, people are rewarded for the quality of their decisions — not just for whether those decisions happened to work out.",
    reverseScored: true,
  },
  {
    id: "I3",
    force: "incentive",
    text: "In our organization, the person who raises a difficult problem early is valued for it — not treated as the person who created the problem by naming it.",
    reverseScored: true,
  },
  {
    id: "I4",
    force: "incentive",
    text: "The metrics we use to evaluate performance measure what actually matters — not what's convenient to track, which over time becomes what people optimize instead.",
    reverseScored: true,
  },
  {
    id: "I5",
    force: "incentive",
    text: "In our organization, what's good for an individual team and what's good for the organization are pointed in the same direction — so teams aren't winning while the company is losing.",
    reverseScored: true,
  },
];
