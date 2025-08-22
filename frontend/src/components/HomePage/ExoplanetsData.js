// components/HomePage/ExoplanetData.js
const exoplanetsData = [
  {
    id: 1,
    name: 'Kepler-452b',
    system: 'Kepler-452 System',
    distance: '1,402',
    type: 'Super Earth',
    zone: 'Habitable',
    mass: '5.0 M⊕',
    radius: '1.6 R⊕',
    tags: ['Earth-like', 'Rocky', 'Potentially Habitable'],
    color: '#3b82f6' // 👈 give each planet a color instead
  },
  {
    id: 2,
    name: 'TRAPPIST-1e',
    system: 'TRAPPIST-1',
    distance: '39.5',
    type: 'Terrestrial',
    zone: 'Habitable',
    mass: '0.77 M⊕',
    radius: '0.92 R⊕',
    tags: ['Earth-size', 'Rocky', 'Water Potential'],
    color: '#22c55e'
  },
  {
    id: 3,
    name: 'Proxima Centauri b',
    system: 'Alpha Centauri',
    distance: '4.2',
    type: 'Terrestrial',
    zone: 'Habitable',
    mass: '1.3 M⊕',
    radius: '1.1 R⊕',
    tags: ['Closest', 'Red Dwarf', 'Tidally Locked'],
    color: '#ef4444'
  },
  {
    id: 4,
    name: 'HD 40307g',
    system: 'HD 40307',
    distance: '42',
    type: 'Super Earth',
    zone: 'Habitable',
    mass: '7.1 M⊕',
    radius: '1.8 R⊕',
    tags: ['Super Earth', 'Long Year', 'Cool Star'],
    color: '#eab308'
  },
  {
    id: 5,
    name: 'Kepler-22b',
    system: 'Kepler-22',
    distance: '600',
    type: 'Super Earth',
    zone: 'Habitable',
    mass: '6.36 M⊕',
    radius: '2.1 R⊕',
    tags: ['Ocean World', 'Gaseous', 'Warm'],
    color: '#06b6d4'
  },
  {
    id: 6,
    name: 'Gliese 667 Cc',
    system: 'Gliese 667',
    distance: '22',
    type: 'Super Earth',
    zone: 'Habitable',
    mass: '3.8 M⊕',
    radius: '1.5 R⊕',
    tags: ['Rocky', 'Triple Star', 'Potential Life'],
    color: '#9333ea'
  }
];

export default exoplanetsData;
