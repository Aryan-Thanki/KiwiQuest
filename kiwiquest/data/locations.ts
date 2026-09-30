export type Location = {
  name: string;
  region: string;
  latitude: number;
  longitude: number;
};

export const locations: Location[] = [
  { name: "Cape Reinga", region: "Northland", latitude: -34.4287, longitude: 172.681 },
  { name: "Bay of Islands", region: "Northland", latitude: -35.282, longitude: 174.091 },
  { name: "Sky Tower", region: "Auckland", latitude: -36.8485, longitude: 174.7622 },
  { name: "Cathedral Cove", region: "Coromandel", latitude: -36.8279, longitude: 175.7903 },
  { name: "Hot Water Beach", region: "Coromandel", latitude: -36.888, longitude: 175.823 },
  { name: "Hobbiton Movie Set", region: "Waikato", latitude: -37.8721, longitude: 175.6829 },
  { name: "Waitomo Glowworm Caves", region: "Waikato", latitude: -38.261, longitude: 175.1039 },
  { name: "Te Puia, Rotorua", region: "Bay of Plenty", latitude: -38.1636, longitude: 176.253 },
  { name: "Huka Falls", region: "Taupō", latitude: -38.6488, longitude: 176.09 },
  { name: "Tongariro Alpine Crossing", region: "Manawatū-Whanganui", latitude: -39.14, longitude: 175.65 },
  { name: "Mount Taranaki", region: "Taranaki", latitude: -39.2968, longitude: 174.0634 },
  { name: "Napier Art Deco District", region: "Hawke's Bay", latitude: -39.4928, longitude: 176.912 },
  { name: "Te Papa", region: "Wellington", latitude: -41.2905, longitude: 174.782 },
  { name: "Abel Tasman National Park", region: "Tasman", latitude: -40.9, longitude: 173.01 },
  { name: "Kaikōura", region: "Canterbury", latitude: -42.4, longitude: 173.68 },
  { name: "Punakaiki Pancake Rocks", region: "West Coast", latitude: -42.1136, longitude: 171.3264 },
  { name: "Franz Josef Glacier", region: "West Coast", latitude: -43.445, longitude: 170.18 },
  { name: "Cathedral Square, Christchurch", region: "Canterbury", latitude: -43.5309, longitude: 172.6366 },
  { name: "Aoraki / Mount Cook", region: "Canterbury", latitude: -43.595, longitude: 170.142 },
  { name: "Church of the Good Shepherd, Lake Tekapo", region: "Canterbury", latitude: -44.0047, longitude: 170.4775 },
  { name: "Lindis Pass", region: "Otago", latitude: -44.586, longitude: 169.645 },
  { name: "Wānaka", region: "Otago", latitude: -44.696, longitude: 169.136 },
  { name: "Queenstown", region: "Otago", latitude: -45.0312, longitude: 168.6626 },
  { name: "Milford Sound / Piopiotahi", region: "Fiordland", latitude: -44.6414, longitude: 167.8974 },
  { name: "Moeraki Boulders", region: "Otago", latitude: -45.3453, longitude: 170.8264 },
  { name: "Baldwin Street, Dunedin", region: "Otago", latitude: -45.8494, longitude: 170.5337 },
  { name: "Nugget Point Lighthouse", region: "Catlins", latitude: -46.4466, longitude: 169.8155 },
  { name: "Stewart Island / Rakiura", region: "Southland", latitude: -46.899, longitude: 168.128 },
];
