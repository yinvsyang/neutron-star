import { StarStage, StageInfo } from './types';

export const STAGE_DATA: Record<StarStage, StageInfo> = {
  [StarStage.MAIN_SEQUENCE]: {
    id: StarStage.MAIN_SEQUENCE,
    title: "Massive Main Sequence Star",
    description: "A blue supergiant burning hydrogen into helium.",
    details: "This star is 10-25 times the mass of our Sun. It burns bright and hot (blue) and lives a relatively short life (millions of years vs billions). Gravity is balanced by the outward pressure of nuclear fusion.",
    color: "#4488ff",
    cameraDist: 12,
  },
  [StarStage.RED_SUPERGIANT]: {
    id: StarStage.RED_SUPERGIANT,
    title: "Red Supergiant",
    description: "Running out of fuel, the star expands massively.",
    details: "As hydrogen runs out, the core contracts and heats up, causing the outer layers to expand and cool, turning red. It begins fusing heavier elements: helium -> carbon -> neon -> oxygen -> silicon -> iron.",
    color: "#ff3300",
    cameraDist: 18,
  },
  [StarStage.SUPERNOVA]: {
    id: StarStage.SUPERNOVA,
    title: "Type II Supernova",
    description: "Core collapse and catastrophic explosion.",
    details: "Once iron is formed, fusion stops. The core collapses under gravity in a fraction of a second, rebounding and sending a shockwave that blasts the outer layers into space. This explosion outshines entire galaxies.",
    color: "#ffaa00",
    cameraDist: 25,
  },
  [StarStage.NEUTRON_STAR]: {
    id: StarStage.NEUTRON_STAR,
    title: "Neutron Star",
    description: "The ultra-dense city-sized remnant.",
    details: "Protons and electrons are crushed together to form neutrons. The result is a sphere only ~20km wide but with 1.5x the mass of the Sun. It spins rapidly and possesses an incredibly strong magnetic field.",
    color: "#00f3ff",
    cameraDist: 8,
  }
};
