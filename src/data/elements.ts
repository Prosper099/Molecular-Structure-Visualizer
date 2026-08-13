/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AtomPreset, MoleculePreset } from '../types';
import { ALL_118_ELEMENTS } from './periodicTable';

export function getAtomPresetById(symbol: string): AtomPreset {
  const preset = ATOM_PRESETS.find(a => a.symbol.toUpperCase() === symbol.toUpperCase());
  if (preset) return preset;

  const found = ALL_118_ELEMENTS.find(e => e.symbol.toUpperCase() === symbol.toUpperCase());
  if (found) {
    const protons = found.number;
    const neutrons = Math.round(found.mass - found.number);
    return {
      symbol: found.symbol,
      name: found.name,
      protonsByShell: found.shells,
      protons,
      neutrons,
      massNumber: Math.round(found.mass),
      category: found.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: `A fundamental chemical entity belonging to the ${found.category} group. Sits at period ${found.period}, group ${found.group > 0 ? found.group : 'F-Block'} of the quantum element registry.`,
      funFact: `It has atomic number ${found.number} with a molecular relative weight of ${found.mass} unified atomic mass units.`,
      formulaDescription: `Arranges ${protons} protons and ${neutrons} neutrons in the nucleus, surrounded by ${protons} orbiting electrons in ${found.shells.length} quantum configuration levels.`
    };
  }

  return ATOM_PRESETS[0];
}

export const ATOM_PRESETS: AtomPreset[] = [
  {
    symbol: 'H',
    name: 'Hydrogen',
    protonsByShell: [1],
    protons: 1,
    neutrons: 0,
    massNumber: 1,
    category: 'Reactive Nonmetal',
    description: 'The simplest and most abundant chemical element in the universe, constituting about 75% of all baryonic mass.',
    funFact: 'Hydrogen is the fuel that powers the Sun and other stars through nuclear fusion.',
    formulaDescription: 'Single electron orbiting a solitary proton. Highly reactive due to its half-filled shell.'
  },
  {
    symbol: 'He',
    name: 'Helium',
    protonsByShell: [2],
    protons: 2,
    neutrons: 2,
    massNumber: 4,
    category: 'Noble Gas',
    description: 'A colorless, odorless, tasteless, non-toxic, and inert noble gas that heads the helium group.',
    funFact: 'Helium is the only element that cannot be solidified by sufficient cooling at normal atmospheric pressure; it remains liquid down to absolute zero.',
    formulaDescription: 'Fully filled first electron shell (duet rule). Extremely stable, zero chemical reactivity.'
  },
  {
    symbol: 'C',
    name: 'Carbon',
    protonsByShell: [2, 4],
    protons: 6,
    neutrons: 6,
    massNumber: 12,
    category: 'Nonmetal - Tetravalent',
    description: 'The chemical basis for all known organic life. Tetravalent structure allows complex covalent bonding.',
    funFact: 'Carbon can form both the softest material (graphite) and one of the hardest materials (diamond) just by changing its crystal layout.',
    formulaDescription: 'Inner shell has 2 electrons, outer valence shell has 4 electrons. Ready to form four bonds.'
  },
  {
    symbol: 'O',
    name: 'Oxygen',
    protonsByShell: [2, 6],
    protons: 8,
    neutrons: 8,
    massNumber: 16,
    category: 'Chalcogen',
    description: 'A highly reactive nonmetal and oxidizing agent that readily forms oxides with most elements.',
    funFact: 'Liquid and solid oxygen are pale blue and are strongly paramagnetic (attracted to magnets).',
    formulaDescription: 'Inner shell of 2, valence shell of 6. Highly electronegative, seeking 2 electrons to complete its octet.'
  },
  {
    symbol: 'Ne',
    name: 'Neon',
    protonsByShell: [2, 8],
    protons: 10,
    neutrons: 10,
    massNumber: 20,
    category: 'Noble Gas',
    description: 'A noble gas that glows with a reddish-orange light when utilized in high-voltage electrical discharge glow lamps.',
    funFact: 'Neon is the fifth most abundant chemical element in the universe by mass, but is extremely rare on Earth.',
    formulaDescription: 'Fully complete inner (2) and outer (8) shells (octet rule). Completely stable, inert gas.'
  }
];

export const MOLECULE_PRESETS: MoleculePreset[] = [
  {
    id: 'H2O',
    name: 'Water',
    formula: 'H₂O',
    bondingType: 'Covalent Polar',
    description: 'A polar inorganic compound that is the main constituent of Earth\'s hydrosphere and the fluids of all known living organisms.',
    funFact: 'Water expands when it freezes, which is why ice floats. This is rare; most liquids contract when solidifying.',
    atoms: [
      {
        symbol: 'O',
        elementName: 'Oxygen',
        offset: { x: 0, y: -8, z: 0 },
        protons: 8,
        neutrons: 8,
        shells: [2, 4], // valence shared
        color: '#EF4444' // red
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: -42, y: 32, z: 0 },
        protons: 1,
        neutrons: 0,
        shells: [0], // fully shared
        color: '#60A5FA' // light blue
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: 42, y: 32, z: 0 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      }
    ]
  },
  {
    id: 'CO2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    bondingType: 'Linear Double Covalent',
    description: 'A vital greenhouse gas consisting of a carbon atom covalently double-bonded to two oxygen atoms.',
    funFact: 'Liquid carbon dioxide does not exist at standard atmospheric pressure; instead, dry ice sublimes directly into gas at -78.5°C.',
    atoms: [
      {
        symbol: 'C',
        elementName: 'Carbon',
        offset: { x: 0, y: 0, z: 0 },
        protons: 6,
        neutrons: 6,
        shells: [2],
        color: '#374151' // dark gray
      },
      {
        symbol: 'O',
        elementName: 'Oxygen',
        offset: { x: -55, y: 0, z: 0 },
        protons: 8,
        neutrons: 8,
        shells: [2, 4],
        color: '#EF4444'
      },
      {
        symbol: 'O',
        elementName: 'Oxygen',
        offset: { x: 55, y: 0, z: 0 },
        protons: 8,
        neutrons: 8,
        shells: [2, 4],
        color: '#EF4444'
      }
    ]
  },
  {
    id: 'CH4',
    name: 'Methane',
    formula: 'CH₄',
    bondingType: 'Tetrahedral Covalent',
    description: 'The simplest alkane and the main constituent of natural gas. It forms a geometric three-dimensional tetrahedron.',
    funFact: 'Methane is a potent greenhouse gas, around 25 times more efficient at trapping heat in the atmosphere than carbon dioxide over a 100-year timescale.',
    atoms: [
      {
        symbol: 'C',
        elementName: 'Carbon',
        offset: { x: 0, y: 0, z: 0 },
        protons: 6,
        neutrons: 6,
        shells: [2],
        color: '#374151'
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: 34, y: 34, z: 34 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: -34, y: -34, z: 34 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: 34, y: -34, z: -34 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: -34, y: 34, z: -34 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      }
    ]
  },
  {
    id: 'O2',
    name: 'Oxygen Gas',
    formula: 'O₂',
    bondingType: 'Diatomic Double Covalent',
    description: 'Diatomic oxygen is a chemical element with symbol O and atomic number 8. It constitutes 20.9% of the Earth\'s atmosphere.',
    funFact: 'The oxygen we breathe was originally produced by ancient micro-organisms called cyanobacteria over 2.4 billion years ago.',
    atoms: [
      {
        symbol: 'O',
        elementName: 'Oxygen',
        offset: { x: -35, y: 0, z: 0 },
        protons: 8,
        neutrons: 8,
        shells: [2, 4],
        color: '#EF4444'
      },
      {
        symbol: 'O',
        elementName: 'Oxygen',
        offset: { x: 35, y: 0, z: 0 },
        protons: 8,
        neutrons: 8,
        shells: [2, 4],
        color: '#EF4444'
      }
    ]
  },
  {
    id: 'NH3',
    name: 'Ammonia',
    formula: 'NH₃',
    bondingType: 'Trigonal Pyramidal Covalent',
    description: 'A colorless gas with a characteristic pungent smell. It is a stable binary hydride and a vital building block for proteins and fertilizers.',
    funFact: 'The trigonal pyramidal shape is caused by a single non-bonding lone pair of valence electrons on the Nitrogen atom, which pushes the Hydrogen-Nitrogen bonds downward with powerful Coulomb forces.',
    atoms: [
      {
        symbol: 'N',
        elementName: 'Nitrogen',
        offset: { x: 0, y: 15, z: 0 },
        protons: 7,
        neutrons: 7,
        shells: [2, 3],
        color: '#8B5CF6' // Purple/Indigo N
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: 0, y: -20, z: -40 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: -35, y: -20, z: 20 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: 35, y: -20, z: 20 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      }
    ]
  },
  {
    id: 'C2H5OH',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    bondingType: 'Organic Covalent Chain',
    description: 'Commonly known as alcohol, ethyl alcohol, or drinking alcohol. It contains a strong hydrocarbon chain terminated by a reactive polar hydroxyl group.',
    funFact: 'Ethanol is highly soluble in both water and organic solvents because its hydroxyl group is polar while its ethyl group is nonpolar.',
    atoms: [
      {
        symbol: 'C',
        elementName: 'Carbon',
        offset: { x: -30, y: -10, z: 0 },
        protons: 6,
        neutrons: 6,
        shells: [2],
        color: '#374151'
      },
      {
        symbol: 'C',
        elementName: 'Carbon',
        offset: { x: 20, y: -10, z: 0 },
        protons: 6,
        neutrons: 6,
        shells: [2],
        color: '#374151'
      },
      {
        symbol: 'O',
        elementName: 'Oxygen',
        offset: { x: 45, y: 25, z: 15 },
        protons: 8,
        neutrons: 8,
        shells: [2, 4],
        color: '#EF4444'
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: 72, y: 32, z: -5 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      },
      // Hydrogens on C1
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: -50, y: 5, z: 25 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: -50, y: 5, z: -25 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: -30, y: -38, z: 0 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      },
      // Hydrogens on C2
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: 20, y: -38, z: -25 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      },
      {
        symbol: 'H',
        elementName: 'Hydrogen',
        offset: { x: 20, y: -38, z: 25 },
        protons: 1,
        neutrons: 0,
        shells: [0],
        color: '#60A5FA'
      }
    ]
  },
  {
    id: 'NaCl',
    name: 'Sodium Chloride (Salt)',
    formula: 'Na₈Cl₈ Cube',
    bondingType: 'Ionic Lattice',
    description: 'A fundamental cubic unit cellular segment of a table salt crystal. Demonstrates how Sodium cations transfer valence charge fully to Chlorine anions resulting in an electrostatic lattice hold.',
    funFact: 'When salt dissolves, the polar ends of water molecules form hydration shells around the sodium and chloride ions, completely breaking the electrostatic grid locks!',
    atoms: [
      // Top layer
      { symbol: 'Na', elementName: 'Sodium', offset: { x: -28, y: -28, z: -28 }, protons: 11, neutrons: 12, shells: [2, 8], color: '#FBBF24' },
      { symbol: 'Cl', elementName: 'Chlorine', offset: { x: 28, y: -28, z: -28 }, protons: 17, neutrons: 18, shells: [2, 8, 8], color: '#10B981' },
      { symbol: 'Na', elementName: 'Sodium', offset: { x: 28, y: -28, z: 28 }, protons: 11, neutrons: 12, shells: [2, 8], color: '#FBBF24' },
      { symbol: 'Cl', elementName: 'Chlorine', offset: { x: -28, y: -28, z: 28 }, protons: 17, neutrons: 18, shells: [2, 8, 8], color: '#10B981' },
      // Bottom layer
      { symbol: 'Cl', elementName: 'Chlorine', offset: { x: -28, y: 28, z: -28 }, protons: 17, neutrons: 18, shells: [2, 8, 8], color: '#10B981' },
      { symbol: 'Na', elementName: 'Sodium', offset: { x: 28, y: 28, z: -28 }, protons: 11, neutrons: 12, shells: [2, 8], color: '#FBBF24' },
      { symbol: 'Cl', elementName: 'Chlorine', offset: { x: 28, y: 28, z: 28 }, protons: 17, neutrons: 18, shells: [2, 8, 8], color: '#10B981' },
      { symbol: 'Na', elementName: 'Sodium', offset: { x: -28, y: 28, z: 28 }, protons: 11, neutrons: 12, shells: [2, 8], color: '#FBBF24' }
    ]
  },
  {
    id: 'Caffeine',
    name: 'Caffeine',
    formula: 'C₈H₁₀N₄O₂',
    bondingType: 'Complex Covalent Purine Ring',
    description: 'A methylxanthine central nervous system stimulant. Displays the famous dual nitrogenous ring structure composed of a fused pyrimidinedione and imidazole skeleton.',
    funFact: 'Caffeine promotes cognitive alertness by acting as an antagonist at adenosine receptor sites in your biological brain, mimicking the physical shape of built-up chemical sleep triggers.',
    atoms: [
      // Fused ring heavy atoms (Nitrogens + Carbons)
      { symbol: 'N', elementName: 'Nitrogen', offset: { x: -35, y: -25, z: 0 }, protons: 7, neutrons: 7, shells: [2, 3], color: '#8B5CF6' },
      { symbol: 'C', elementName: 'Carbon', offset: { x: -35, y: 15, z: 0 }, protons: 6, neutrons: 6, shells: [2], color: '#374151' },
      { symbol: 'N', elementName: 'Nitrogen', offset: { x: 0, y: 35, z: 5 }, protons: 7, neutrons: 7, shells: [2, 3], color: '#8B5CF6' },
      { symbol: 'C', elementName: 'Carbon', offset: { x: 35, y: 15, z: 0 }, protons: 6, neutrons: 6, shells: [2], color: '#374151' },
      { symbol: 'C', elementName: 'Carbon', offset: { x: 35, y: -25, z: 0 }, protons: 6, neutrons: 6, shells: [2], color: '#374151' },
      { symbol: 'N', elementName: 'Nitrogen', offset: { x: 0, y: -45, z: -5 }, protons: 7, neutrons: 7, shells: [2, 3], color: '#8B5CF6' },
      
      // Imidazole ring extensions
      { symbol: 'C', elementName: 'Carbon', offset: { x: 62, y: -5, z: -10 }, protons: 6, neutrons: 6, shells: [2], color: '#374151' },
      { symbol: 'N', elementName: 'Nitrogen', offset: { x: 55, y: -38, z: -5 }, protons: 7, neutrons: 7, shells: [2, 3], color: '#8B5CF6' },
      
      // Double bonded Oxygens (Carbonyls)
      { symbol: 'O', elementName: 'Oxygen', offset: { x: -62, y: -40, z: 5 }, protons: 8, neutrons: 8, shells: [2, 4], color: '#EF4444' },
      { symbol: 'O', elementName: 'Oxygen', offset: { x: -62, y: 30, z: -5 }, protons: 8, neutrons: 8, shells: [2, 4], color: '#EF4444' },

      // Representative Hydrogens
      { symbol: 'H', elementName: 'Hydrogen', offset: { x: 80, y: -2, z: -20 }, protons: 1, neutrons: 0, shells: [0], color: '#60A5FA' },
      { symbol: 'H', elementName: 'Hydrogen', offset: { x: 10, y: -65, z: -8 }, protons: 1, neutrons: 0, shells: [0], color: '#60A5FA' },
      { symbol: 'H', elementName: 'Hydrogen', offset: { x: -10, y: -65, z: 8 }, protons: 1, neutrons: 0, shells: [0], color: '#60A5FA' }
    ]
  }
];
