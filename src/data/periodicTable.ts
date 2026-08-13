/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PeriodicElement {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string;
  period: number;
  group: number; // 1 to 18 (0 for lanthanides/actinides to place them below)
  shells: number[];
}

export const ALL_118_ELEMENTS: PeriodicElement[] = [
  // Period 1
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'reactive-nonmetal', period: 1, group: 1, shells: [1] },
  { number: 2, symbol: 'He', name: 'Helium', mass: 4.0026, category: 'noble-gas', period: 1, group: 18, shells: [2] },

  // Period 2
  { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, category: 'alkali-metal', period: 2, group: 1, shells: [2, 1] },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.0122, category: 'alkaline-earth-metal', period: 2, group: 2, shells: [2, 2] },
  { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid', period: 2, group: 13, shells: [2, 3] },
  { number: 6, symbol: 'C', name: 'Carbon', mass: 12.011, category: 'reactive-nonmetal', period: 2, group: 14, shells: [2, 4] },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, category: 'reactive-nonmetal', period: 2, group: 15, shells: [2, 5] },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, category: 'reactive-nonmetal', period: 2, group: 16, shells: [2, 6] },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, category: 'reactive-nonmetal', period: 2, group: 17, shells: [2, 7] },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.180, category: 'noble-gas', period: 2, group: 18, shells: [2, 8] },

  // Period 3
  { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.990, category: 'alkali-metal', period: 3, group: 1, shells: [2, 8, 1] },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, category: 'alkaline-earth-metal', period: 3, group: 2, shells: [2, 8, 2] },
  { number: 13, symbol: 'Al', name: 'Aluminium', mass: 26.982, category: 'post-transition-metal', period: 3, group: 13, shells: [2, 8, 3] },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.085, category: 'metalloid', period: 3, group: 14, shells: [2, 8, 4] },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, category: 'reactive-nonmetal', period: 3, group: 15, shells: [2, 8, 5] },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, category: 'reactive-nonmetal', period: 3, group: 16, shells: [2, 8, 6] },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'reactive-nonmetal', period: 3, group: 17, shells: [2, 8, 7] },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.948, category: 'noble-gas', period: 3, group: 18, shells: [2, 8, 8] },

  // Period 4
  { number: 19, symbol: 'K', name: 'Potassium', mass: 39.098, category: 'alkali-metal', period: 4, group: 1, shells: [2, 8, 8, 1] },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, category: 'alkaline-earth-metal', period: 4, group: 2, shells: [2, 8, 8, 2] },
  { number: 21, symbol: 'Sc', name: 'Scandium', mass: 44.956, category: 'transition-metal', period: 4, group: 3, shells: [2, 8, 9, 2] },
  { number: 22, symbol: 'Ti', name: 'Titanium', mass: 47.867, category: 'transition-metal', period: 4, group: 4, shells: [2, 8, 10, 2] },
  { number: 23, symbol: 'V', name: 'Vanadium', mass: 50.942, category: 'transition-metal', period: 4, group: 5, shells: [2, 8, 11, 2] },
  { number: 24, symbol: 'Cr', name: 'Chromium', mass: 51.996, category: 'transition-metal', period: 4, group: 6, shells: [2, 8, 13, 1] },
  { number: 25, symbol: 'Mn', name: 'Manganese', mass: 54.938, category: 'transition-metal', period: 4, group: 7, shells: [2, 8, 13, 2] },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, category: 'transition-metal', period: 4, group: 8, shells: [2, 8, 14, 2] },
  { number: 27, symbol: 'Co', name: 'Cobalt', mass: 58.933, category: 'transition-metal', period: 4, group: 9, shells: [2, 8, 15, 2] },
  { number: 28, symbol: 'Ni', name: 'Nickel', mass: 58.693, category: 'transition-metal', period: 4, group: 10, shells: [2, 8, 16, 2] },
  { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, category: 'transition-metal', period: 4, group: 11, shells: [2, 8, 18, 1] },
  { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'transition-metal', period: 4, group: 12, shells: [2, 8, 18, 2] },
  { number: 31, symbol: 'Ga', name: 'Gallium', mass: 69.723, category: 'post-transition-metal', period: 4, group: 13, shells: [2, 8, 18, 3] },
  { number: 32, symbol: 'Ge', name: 'Germanium', mass: 72.630, category: 'metalloid', period: 4, group: 14, shells: [2, 8, 18, 4] },
  { number: 33, symbol: 'As', name: 'Arsenic', mass: 74.922, category: 'metalloid', period: 4, group: 15, shells: [2, 8, 18, 5] },
  { number: 34, symbol: 'Se', name: 'Selenium', mass: 78.971, category: 'reactive-nonmetal', period: 4, group: 16, shells: [2, 8, 18, 6] },
  { number: 35, symbol: 'Br', name: 'Bromine', mass: 79.904, category: 'reactive-nonmetal', period: 4, group: 17, shells: [2, 8, 18, 7] },
  { number: 36, symbol: 'Kr', name: 'Krypton', mass: 83.798, category: 'noble-gas', period: 4, group: 18, shells: [2, 8, 18, 8] },

  // Period 5
  { number: 37, symbol: 'Rb', name: 'Rubid', mass: 85.468, category: 'alkali-metal', period: 5, group: 1, shells: [2, 8, 18, 8, 1] },
  { number: 38, symbol: 'Sr', name: 'Stront', mass: 87.62, category: 'alkaline-earth-metal', period: 5, group: 2, shells: [2, 8, 18, 8, 2] },
  { number: 39, symbol: 'Y', name: 'Yttrium', mass: 88.906, category: 'transition-metal', period: 5, group: 3, shells: [2, 8, 18, 9, 2] },
  { number: 40, symbol: 'Zr', name: 'Zircon', mass: 91.224, category: 'transition-metal', period: 5, group: 4, shells: [2, 8, 18, 10, 2] },
  { number: 41, symbol: 'Nb', name: 'Niob', mass: 92.906, category: 'transition-metal', period: 5, group: 5, shells: [2, 8, 18, 12, 1] },
  { number: 42, symbol: 'Mo', name: 'Molyb', mass: 95.95, category: 'transition-metal', period: 5, group: 6, shells: [2, 8, 18, 13, 1] },
  { number: 43, symbol: 'Tc', name: 'Technet', mass: 98, category: 'transition-metal', period: 5, group: 7, shells: [2, 8, 18, 13, 2] },
  { number: 44, symbol: 'Ru', name: 'Ruthen', mass: 101.07, category: 'transition-metal', period: 5, group: 8, shells: [2, 8, 18, 15, 1] },
  { number: 45, symbol: 'Rh', name: 'Rhod', mass: 102.91, category: 'transition-metal', period: 5, group: 9, shells: [2, 8, 18, 16, 1] },
  { number: 46, symbol: 'Pd', name: 'Pallad', mass: 106.42, category: 'transition-metal', period: 5, group: 10, shells: [2, 8, 18, 18, 0] },
  { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87, category: 'transition-metal', period: 5, group: 11, shells: [2, 8, 18, 18, 1] },
  { number: 48, symbol: 'Cd', name: 'Cadmium', mass: 112.41, category: 'transition-metal', period: 5, group: 12, shells: [2, 8, 18, 18, 2] },
  { number: 49, symbol: 'In', name: 'Indium', mass: 114.82, category: 'post-transition-metal', period: 5, group: 13, shells: [2, 8, 18, 18, 3] },
  { number: 50, symbol: 'Sn', name: 'Tin', mass: 118.71, category: 'post-transition-metal', period: 5, group: 14, shells: [2, 8, 18, 18, 4] },
  { number: 51, symbol: 'Sb', name: 'Antim', mass: 121.76, category: 'metalloid', period: 5, group: 15, shells: [2, 8, 18, 18, 5] },
  { number: 52, symbol: 'Te', name: 'Tellur', mass: 127.60, category: 'metalloid', period: 5, group: 16, shells: [2, 8, 18, 18, 6] },
  { number: 53, symbol: 'I', name: 'Iodine', mass: 126.90, category: 'reactive-nonmetal', period: 5, group: 17, shells: [2, 8, 18, 18, 7] },
  { number: 54, symbol: 'Xe', name: 'Xenon', mass: 131.29, category: 'noble-gas', period: 5, group: 18, shells: [2, 8, 18, 18, 8] },

  // Period 6
  { number: 55, symbol: 'Cs', name: 'Caesium', mass: 132.91, category: 'alkali-metal', period: 6, group: 1, shells: [2, 8, 18, 18, 8, 1] },
  { number: 56, symbol: 'Ba', name: 'Barium', mass: 137.33, category: 'alkaline-earth-metal', period: 6, group: 2, shells: [2, 8, 18, 18, 8, 2] },
  
  // Lanthanides (placed below, period 6, groups 3.1..3.15 represented as group: 3 for layout simplicity or virtual offsets)
  { number: 57, symbol: 'La', name: 'Lanthan', mass: 138.91, category: 'lanthanide', period: 6, group: 3, shells: [2, 8, 18, 18, 9, 2] },
  { number: 58, symbol: 'Ce', name: 'Cerium', mass: 140.12, category: 'lanthanide', period: 6, group: 3.5, shells: [2, 8, 18, 19, 9, 2] },
  { number: 59, symbol: 'Pr', name: 'Praseod', mass: 140.91, category: 'lanthanide', period: 6, group: 3.6, shells: [2, 8, 18, 21, 8, 2] },
  { number: 60, symbol: 'Nd', name: 'Neody', mass: 144.24, category: 'lanthanide', period: 6, group: 3.7, shells: [2, 8, 18, 22, 8, 2] },
  { number: 61, symbol: 'Pm', name: 'Prometh', mass: 145, category: 'lanthanide', period: 6, group: 3.8, shells: [2, 8, 18, 23, 8, 2] },
  { number: 62, symbol: 'Sm', name: 'Samar', mass: 150.36, category: 'lanthanide', period: 6, group: 3.9, shells: [2, 8, 18, 24, 8, 2] },
  { number: 63, symbol: 'Eu', name: 'Europ', mass: 151.96, category: 'lanthanide', period: 6, group: 4.1, shells: [2, 8, 18, 25, 8, 2] },
  { number: 64, symbol: 'Gd', name: 'Gadolin', mass: 157.25, category: 'lanthanide', period: 6, group: 4.2, shells: [2, 8, 18, 25, 9, 2] },
  { number: 65, symbol: 'Tb', name: 'Terbium', mass: 158.93, category: 'lanthanide', period: 6, group: 4.3, shells: [2, 8, 18, 27, 8, 2] },
  { number: 66, symbol: 'Dy', name: 'Dyspro', mass: 162.50, category: 'lanthanide', period: 6, group: 4.4, shells: [2, 8, 18, 28, 8, 2] },
  { number: 67, symbol: 'Ho', name: 'Holmium', mass: 164.93, category: 'lanthanide', period: 6, group: 4.5, shells: [2, 8, 18, 29, 8, 2] },
  { number: 68, symbol: 'Er', name: 'Erbium', mass: 167.26, category: 'lanthanide', period: 6, group: 4.6, shells: [2, 8, 18, 30, 8, 2] },
  { number: 69, symbol: 'Tm', name: 'Thulium', mass: 168.93, category: 'lanthanide', period: 6, group: 4.7, shells: [2, 8, 18, 31, 8, 2] },
  { number: 70, symbol: 'Yb', name: 'Ytterb', mass: 173.05, category: 'lanthanide', period: 6, group: 4.8, shells: [2, 8, 18, 32, 8, 2] },
  { number: 71, symbol: 'Lu', name: 'Luteti', mass: 174.97, category: 'lanthanide', period: 6, group: 4.9, shells: [2, 8, 18, 32, 9, 2] },

  // Rest of Period 6 Transition Metals
  { number: 72, symbol: 'Hf', name: 'Hafnium', mass: 178.49, category: 'transition-metal', period: 6, group: 4, shells: [2, 8, 18, 32, 10, 2] },
  { number: 73, symbol: 'Ta', name: 'Tantal', mass: 180.95, category: 'transition-metal', period: 6, group: 5, shells: [2, 8, 18, 32, 11, 2] },
  { number: 74, symbol: 'W', name: 'Tungsten', mass: 183.84, category: 'transition-metal', period: 6, group: 6, shells: [2, 8, 18, 32, 12, 2] },
  { number: 75, symbol: 'Re', name: 'Rhenium', mass: 186.21, category: 'transition-metal', period: 6, group: 7, shells: [2, 8, 18, 32, 13, 2] },
  { number: 76, symbol: 'Os', name: 'Osmium', mass: 190.23, category: 'transition-metal', period: 6, group: 8, shells: [2, 8, 18, 32, 14, 2] },
  { number: 77, symbol: 'Ir', name: 'Iridium', mass: 192.22, category: 'transition-metal', period: 6, group: 9, shells: [2, 8, 18, 32, 15, 2] },
  { number: 78, symbol: 'Pt', name: 'Platinum', mass: 195.08, category: 'transition-metal', period: 6, group: 10, shells: [2, 8, 18, 32, 17, 1] },
  { number: 79, symbol: 'Au', name: 'Gold', mass: 196.97, category: 'transition-metal', period: 6, group: 11, shells: [2, 8, 18, 32, 18, 1] },
  { number: 80, symbol: 'Hg', name: 'Mercury', mass: 200.59, category: 'transition-metal', period: 6, group: 12, shells: [2, 8, 18, 32, 18, 2] },
  { number: 81, symbol: 'Tl', name: 'Thallium', mass: 204.38, category: 'post-transition-metal', period: 6, group: 13, shells: [2, 8, 18, 32, 18, 3] },
  { number: 82, symbol: 'Pb', name: 'Lead', mass: 207.2, category: 'post-transition-metal', period: 6, group: 14, shells: [2, 8, 18, 32, 18, 4] },
  { number: 83, symbol: 'Bi', name: 'Bismuth', mass: 208.98, category: 'post-transition-metal', period: 6, group: 15, shells: [2, 8, 18, 32, 18, 5] },
  { number: 84, symbol: 'Po', name: 'Polon', mass: 209, category: 'metalloid', period: 6, group: 16, shells: [2, 8, 18, 32, 18, 6] },
  { number: 85, symbol: 'At', name: 'Astatin', mass: 210, category: 'reactive-nonmetal', period: 6, group: 17, shells: [2, 8, 18, 32, 18, 7] },
  { number: 86, symbol: 'Rn', name: 'Radon', mass: 222, category: 'noble-gas', period: 6, group: 18, shells: [2, 8, 18, 32, 18, 8] },

  // Period 7
  { number: 87, symbol: 'Fr', name: 'Franc', mass: 223, category: 'alkali-metal', period: 7, group: 1, shells: [2, 8, 18, 32, 18, 8, 1] },
  { number: 88, symbol: 'Ra', name: 'Radium', mass: 226, category: 'alkaline-earth-metal', period: 7, group: 2, shells: [2, 8, 18, 32, 18, 8, 2] },

  // Actinides
  { number: 89, symbol: 'Ac', name: 'Actinium', mass: 227, category: 'actinide', period: 7, group: 3, shells: [2, 8, 18, 32, 18, 9, 2] },
  { number: 90, symbol: 'Th', name: 'Thorium', mass: 232.04, category: 'actinide', period: 7, group: 3.5, shells: [2, 8, 18, 32, 18, 10, 2] },
  { number: 91, symbol: 'Pa', name: 'Protact', mass: 231.04, category: 'actinide', period: 7, group: 3.6, shells: [2, 8, 18, 32, 20, 9, 2] },
  { number: 92, symbol: 'U', name: 'Uranium', mass: 238.03, category: 'actinide', period: 7, group: 3.7, shells: [2, 8, 18, 32, 21, 9, 2] },
  { number: 93, symbol: 'Np', name: 'Neptun', mass: 237, category: 'actinide', period: 7, group: 3.8, shells: [2, 8, 18, 32, 22, 9, 2] },
  { number: 94, symbol: 'Pu', name: 'Pluton', mass: 244, category: 'actinide', period: 7, group: 3.9, shells: [2, 8, 18, 32, 24, 8, 2] },
  { number: 95, symbol: 'Am', name: 'Americ', mass: 243, category: 'actinide', period: 7, group: 4.1, shells: [2, 8, 18, 32, 25, 8, 2] },
  { number: 96, symbol: 'Cm', name: 'Curium', mass: 247, category: 'actinide', period: 7, group: 4.2, shells: [2, 8, 18, 32, 25, 9, 2] },
  { number: 97, symbol: 'Bk', name: 'Berkel', mass: 247, category: 'actinide', period: 7, group: 4.3, shells: [2, 8, 18, 32, 27, 8, 2] },
  { number: 98, symbol: 'Cf', name: 'Californ', mass: 251, category: 'actinide', period: 7, group: 4.4, shells: [2, 8, 18, 32, 28, 8, 2] },
  { number: 99, symbol: 'Es', name: 'Einstein', mass: 252, category: 'actinide', period: 7, group: 4.5, shells: [2, 8, 18, 32, 29, 8, 2] },
  { number: 100, symbol: 'Fm', name: 'Fermium', mass: 257, category: 'actinide', period: 7, group: 4.6, shells: [2, 8, 18, 32, 30, 8, 2] },
  { number: 101, symbol: 'Md', name: 'Mendele', mass: 258, category: 'actinide', period: 7, group: 4.7, shells: [2, 8, 18, 32, 31, 8, 2] },
  { number: 102, symbol: 'No', name: 'Nobel', mass: 259, category: 'actinide', period: 7, group: 4.8, shells: [2, 8, 18, 32, 32, 8, 2] },
  { number: 103, symbol: 'Lr', name: 'Lawrenc', mass: 262, category: 'actinide', period: 7, group: 4.9, shells: [2, 8, 18, 32, 32, 9, 2] },

  // Rest of Period 7 Transactinides
  { number: 104, symbol: 'Rf', name: 'Rutherf', mass: 267, category: 'transition-metal', period: 7, group: 4, shells: [2, 8, 18, 32, 32, 10, 2] },
  { number: 105, symbol: 'Db', name: 'Dubnium', mass: 268, category: 'transition-metal', period: 7, group: 5, shells: [2, 8, 18, 32, 32, 11, 2] },
  { number: 106, symbol: 'Sg', name: 'Seaborg', mass: 269, category: 'transition-metal', period: 7, group: 6, shells: [2, 8, 18, 32, 32, 12, 2] },
  { number: 107, symbol: 'Bh', name: 'Bohrium', mass: 270, category: 'transition-metal', period: 7, group: 7, shells: [2, 8, 18, 32, 32, 13, 2] },
  { number: 108, symbol: 'Hs', name: 'Hassium', mass: 277, category: 'transition-metal', period: 7, group: 8, shells: [2, 8, 18, 32, 32, 14, 2] },
  { number: 109, symbol: 'Mt', name: 'Meitner', mass: 278, category: 'transition-metal', period: 7, group: 9, shells: [2, 8, 18, 32, 32, 15, 2] },
  { number: 110, symbol: 'Ds', name: 'Darmst', mass: 281, category: 'transition-metal', period: 7, group: 10, shells: [2, 8, 18, 32, 32, 17, 1] },
  { number: 111, symbol: 'Rg', name: 'Roentg', mass: 282, category: 'transition-metal', period: 7, group: 11, shells: [2, 8, 18, 32, 32, 18, 1] },
  { number: 112, symbol: 'Cn', name: 'Copern', mass: 285, category: 'transition-metal', period: 7, group: 12, shells: [2, 8, 18, 32, 32, 18, 2] },
  { number: 113, symbol: 'Nh', name: 'Nihon', mass: 286, category: 'post-transition-metal', period: 7, group: 13, shells: [2, 8, 18, 32, 32, 18, 3] },
  { number: 114, symbol: 'Fl', name: 'Flerov', mass: 289, category: 'post-transition-metal', period: 7, group: 14, shells: [2, 8, 18, 32, 32, 18, 4] },
  { number: 115, symbol: 'Mc', name: 'Moscov', mass: 290, category: 'post-transition-metal', period: 7, group: 15, shells: [2, 8, 18, 32, 32, 18, 5] },
  { number: 116, symbol: 'Lv', name: 'Liverm', mass: 293, category: 'post-transition-metal', period: 7, group: 16, shells: [2, 8, 18, 32, 32, 18, 6] },
  { number: 117, symbol: 'Ts', name: 'Tenness', mass: 294, category: 'reactive-nonmetal', period: 7, group: 17, shells: [2, 8, 18, 32, 32, 18, 7] },
  { number: 118, symbol: 'Og', name: 'Oganes', mass: 294, category: 'noble-gas', period: 7, group: 18, shells: [2, 8, 18, 32, 32, 18, 8] }
];

export const CATEGORIES_METADATA: { [key: string]: { label: string; color: string; border: string; bg: string } } = {
  'reactive-nonmetal': { label: 'Reactive Nonmetal', color: 'text-indigo-600', border: 'border-indigo-200', bg: 'bg-indigo-50/50' },
  'noble-gas': { label: 'Noble Gas', color: 'text-cyan-600', border: 'border-cyan-200', bg: 'bg-cyan-50/50' },
  'alkali-metal': { label: 'Alkali Metal', color: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50/50' },
  'alkaline-earth-metal': { label: 'Alkaline Earth Metal', color: 'text-orange-600', border: 'border-orange-200', bg: 'bg-orange-50/50' },
  'metalloid': { label: 'Metalloid', color: 'text-yellow-600', border: 'border-yellow-200', bg: 'bg-yellow-50/50' },
  'post-transition-metal': { label: 'Post Transition Metal', color: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50/50' },
  'transition-metal': { label: 'Transition Metal', color: 'text-sky-600', border: 'border-sky-200', bg: 'bg-sky-50/50' },
  'lanthanide': { label: 'Lanthanide', color: 'text-pink-600', border: 'border-pink-200', bg: 'bg-pink-50/50' },
  'actinide': { label: 'Actinide', color: 'text-rose-600', border: 'border-rose-200', bg: 'bg-rose-50/50' }
};
