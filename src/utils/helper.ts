import type{ Startup } from "../types/types.ts";

export const startups: Startup[] = [
  // --- Central Bengaluru (CBD, MG Road, Indiranagar, Domlur) ---
  { id: "blr-001", name: "CredEdge FinTech", latitude: 12.9719, longitude: 77.5937, industry: "Fintech" },
  { id: "blr-002", name: "Zenith AI Labs", latitude: 12.9754, longitude: 77.6066, industry: "Artificial Intelligence" },
  { id: "blr-003", name: "Indira HealthTech", latitude: 12.9784, longitude: 77.6408, industry: "Healthtech" },
  { id: "blr-004", name: "UrbanCart Logistics", latitude: 12.9625, longitude: 77.6381, industry: "Logistics" },
  { id: "blr-005", name: "Domlur Cloud Systems", latitude: 12.9609, longitude: 77.6487, industry: "SaaS" },
  { id: "blr-006", name: "Brigade CyberSec", latitude: 12.9733, longitude: 77.6083, industry: "Cybersecurity" },
  { id: "blr-007", name: "Cubbon DataWorks", latitude: 12.9767, longitude: 77.5928, industry: "Data Analytics" },
  { id: "blr-008", name: "Lavelle Commerce", latitude: 12.9698, longitude: 77.5991, industry: "E-Commerce" },
  { id: "blr-009", name: "Richmond EduVentures", latitude: 12.9664, longitude: 77.6033, industry: "Edtech" },
  { id: "blr-010", name: "Victoria Agritech", latitude: 12.9701, longitude: 77.6135, industry: "Agritech" },

  // --- Koramangala & HSR Layout (Start-up Hubs) ---
  { id: "blr-011", name: "KoraPay Networks", latitude: 12.9352, longitude: 77.6245, industry: "Fintech" },
  { id: "blr-012", name: "Nexus Mobility", latitude: 12.9344, longitude: 77.6101, industry: "Electric Vehicles" },
  { id: "blr-013", name: "BiteSpeed Kitchens", latitude: 12.9279, longitude: 77.6271, industry: "Foodtech" },
  { id: "blr-014", name: "ScaleGrid Cloud", latitude: 12.9392, longitude: 77.6289, industry: "DevOps" },
  { id: "blr-015", name: "HSR CleanEnergy", latitude: 12.9121, longitude: 77.6446, industry: "Cleantech" },
  { id: "blr-016", name: "SprintHR Global", latitude: 12.9165, longitude: 77.6512, industry: "HRtech" },
  { id: "blr-017", name: "AgileStack Solutions", latitude: 12.9082, longitude: 77.6473, industry: "SaaS" },
  { id: "blr-018", name: "HyperTrack Deliveries", latitude: 12.9149, longitude: 77.6378, industry: "Logistics" },
  { id: "blr-019", name: "Koramangala BioLabs", latitude: 12.9317, longitude: 77.6162, industry: "Biotechnology" },
  { id: "blr-020", name: "VenturePulse Analytics", latitude: 12.9222, longitude: 77.6321, industry: "Fintech" },

  // --- South Bengaluru (Jayanagar, JP Nagar, BTM, Banashankari, Padmanabhanagar) ---
  { id: "blr-021", name: "JayaRetail Tech", latitude: 12.9299, longitude: 77.5826, industry: "Retailtech" },
  { id: "blr-022", name: "SouthPark Dynamics", latitude: 12.9063, longitude: 77.5857, industry: "Robotics" },
  { id: "blr-023", name: "BTM CodeCraft", latitude: 12.9166, longitude: 77.6101, industry: "Edtech" },
  { id: "blr-024", name: "BTM StreamMedia", latitude: 12.9128, longitude: 77.6092, industry: "Media & Entertainment" },
  { id: "blr-025", name: "Banashankari AgroSmart", latitude: 12.9255, longitude: 77.5468, industry: "Agritech" },
  { id: "blr-026", name: "Sarakki Solar Systems", latitude: 12.9004, longitude: 77.5762, industry: "Cleantech" },
  { id: "blr-027", name: "Padmanabha Health", latitude: 12.9181, longitude: 77.5577, industry: "Healthtech" },
  { id: "blr-028", name: "Kumaraswamy Quantum", latitude: 12.9038, longitude: 77.5564, industry: "Deeptech" },
  { id: "blr-029", name: "Uttarahalli GeoTech", latitude: 12.8982, longitude: 77.5381, industry: "Geospatial" },
  { id: "blr-030", name: "Konanakunte InsureDirect", latitude: 12.8876, longitude: 77.5739, industry: "Insurtech" },

  // --- East Bengaluru (Whitefield, Marathahalli, Bellandur, Outer Ring Road, Mahadevapura) ---
  { id: "blr-031", name: "Whitefield AI Robotics", latitude: 12.9698, longitude: 77.7499, industry: "Robotics" },
  { id: "blr-032", name: "EPIP CyberShield", latitude: 12.9782, longitude: 77.7281, industry: "Cybersecurity" },
  { id: "blr-033", name: "Kadugodi SpaceWorks", latitude: 12.9984, longitude: 77.7609, industry: "Spacetech" },
  { id: "blr-034", name: "ITPB CloudCore", latitude: 12.9863, longitude: 77.7308, industry: "Enterprise SaaS" },
  { id: "blr-035", name: "Marathahalli FastLogistics", latitude: 12.9562, longitude: 77.7019, industry: "Supply Chain" },
  { id: "blr-036", name: "Bellandur EcoSensors", latitude: 12.9304, longitude: 77.6784, industry: "IoT" },
  { id: "blr-037", name: "EcoSpace FinEdge", latitude: 12.9261, longitude: 77.6835, industry: "Fintech" },
  { id: "blr-038", name: "Mahadevapura DataStream", latitude: 12.9912, longitude: 77.6953, industry: "Data Analytics" },
  { id: "blr-039", name: "Varthur Agrisense", latitude: 12.9406, longitude: 77.7412, industry: "Agritech" },
  { id: "blr-040", name: "Brookefield Health AI", latitude: 12.9654, longitude: 77.7188, industry: "Healthtech" },

  // --- Electronic City & Far South (Bommasandra, Sarjapur, Hosa Road) ---
  { id: "blr-041", name: "E-City Microchips", latitude: 12.8399, longitude: 77.6770, industry: "Semiconductors" },
  { id: "blr-042", name: "SiliconTown IoT", latitude: 12.8452, longitude: 77.6602, industry: "IoT" },
  { id: "blr-043", name: "Bommasandra HeavyAuto", latitude: 12.8164, longitude: 77.6912, industry: "Automotive" },
  { id: "blr-044", name: "Sarjapur BioGenomics", latitude: 12.8601, longitude: 77.7865, industry: "Biotechnology" },
  { id: "blr-045", name: "Carmelaram CloudLab", latitude: 12.9112, longitude: 77.7061, industry: "SaaS" },
  { id: "blr-046", name: "Attibele GreenPack", latitude: 12.7782, longitude: 77.7715, industry: "Cleantech" },
  { id: "blr-047", name: "Hosa Road DeliverRight", latitude: 12.8711, longitude: 77.6534, industry: "Logistics" },
  { id: "blr-048", name: "Jigani Precision Robotics", latitude: 12.7845, longitude: 77.6419, industry: "Manufacturing" },
  { id: "blr-049", name: "Singasandra WealthTech", latitude: 12.8798, longitude: 77.6482, industry: "Fintech" },
  { id: "blr-050", name: "Kudlu Gate EduSystems", latitude: 12.8902, longitude: 77.6418, industry: "Edtech" },

  // --- North Bengaluru (Hebbal, Manyata Tech Park, Yelahanka, Jakkur, Sahakara Nagar) ---
  { id: "blr-051", name: "Hebbal FlightDynamics", latitude: 13.0358, longitude: 77.5970, industry: "Drones & Aerospace" },
  { id: "blr-052", name: "Manyata CognitiveTech", latitude: 13.0494, longitude: 77.6202, industry: "Artificial Intelligence" },
  { id: "blr-053", name: "Nagavara NetworkLabs", latitude: 13.0428, longitude: 77.6258, industry: "Telecommunications" },
  { id: "blr-054", name: "Sahakara FinSecure", latitude: 13.0623, longitude: 77.5921, industry: "Fintech" },
  { id: "blr-055", name: "Jakkur AeroEngines", latitude: 13.0782, longitude: 77.6067, industry: "Aerospace" },
  { id: "blr-056", name: "Yelahanka FarmGrid", latitude: 13.1007, longitude: 77.5963, industry: "Agritech" },
  { id: "blr-057", name: "Kogilu EcoMaterials", latitude: 13.1189, longitude: 77.6241, industry: "Cleantech" },
  { id: "blr-058", name: "Bagalur BioScience", latitude: 13.1342, longitude: 77.6698, industry: "Biotechnology" },
  { id: "blr-059", name: "Devanahalli AeroLogistics", latitude: 13.2484, longitude: 77.7126, industry: "Logistics" },
  { id: "blr-060", name: "KIA Airport TransitAI", latitude: 13.1986, longitude: 77.7066, industry: "Mobility" },

  // --- North-East & Outer East (Kalyan Nagar, HRBR, Banaswadi, KR Puram, Hoodi) ---
  { id: "blr-061", name: "Kalyan UrbanMedia", latitude: 13.0280, longitude: 77.6434, industry: "Digital Media" },
  { id: "blr-062", name: "HRBR CodeWorks", latitude: 13.0189, longitude: 77.6468, industry: "Edtech" },
  { id: "blr-063", name: "Banaswadi CarePlatform", latitude: 13.0102, longitude: 77.6519, industry: "Healthtech" },
  { id: "blr-064", name: "Ramamurthy FleetHQ", latitude: 13.0162, longitude: 77.6782, industry: "Logistics" },
  { id: "blr-065", name: "Kasturi Nagar CloudOps", latitude: 13.0034, longitude: 77.6621, industry: "DevOps" },
  { id: "blr-066", name: "KR Puram FreightBridge", latitude: 13.0075, longitude: 77.6959, industry: "Supply Chain" },
  { id: "blr-067", name: "Hoodi SolarGrids", latitude: 12.9918, longitude: 77.7164, industry: "Cleantech" },
  { id: "blr-068", name: "Hennur SmartHome", latitude: 13.0355, longitude: 77.6389, industry: "Smart Hardware" },
  { id: "blr-069", name: "Kothanur CyberThreats", latitude: 13.0588, longitude: 77.6511, industry: "Cybersecurity" },
  { id: "blr-070", name: "Horamavu RetailSync", latitude: 13.0272, longitude: 77.6617, industry: "E-Commerce" },

  // --- West Bengaluru (Rajajinagar, Malleshwaram, Vijayanagar, Basaveshwaranagar) ---
  { id: "blr-071", name: "Malleshwaram NanoTech", latitude: 13.0031, longitude: 77.5643, industry: "Deeptech" },
  { id: "blr-072", name: "Rajajinagar LegalAI", latitude: 12.9982, longitude: 77.5530, industry: "Legaltech" },
  { id: "blr-073", name: "World Trade Center SaaS", latitude: 13.0118, longitude: 77.5552, industry: "Enterprise SaaS" },
  { id: "blr-074", name: "Vijayanagar Edubridge", latitude: 12.9712, longitude: 77.5304, industry: "Edtech" },
  { id: "blr-075", name: "Basaveshwaranagar BioCare", latitude: 12.9881, longitude: 77.5385, industry: "Healthtech" },
  { id: "blr-076", name: "Mahalakshmi FinDesk", latitude: 13.0134, longitude: 77.5489, industry: "Fintech" },
  { id: "blr-077", name: "Nagarbhavi GameStudio", latitude: 12.9566, longitude: 77.5097, industry: "Gaming" },
  { id: "blr-078", name: "Yeshwanthpur IndustrialIoT", latitude: 13.0285, longitude: 77.5409, industry: "Industrial IoT" },
  { id: "blr-079", name: "Peenya HeavyMachinery AI", latitude: 13.0329, longitude: 77.5141, industry: "Manufacturing" },
  { id: "blr-080", name: "Peenya Precision Robotics", latitude: 13.0251, longitude: 77.5022, industry: "Robotics" },

  // --- South-West & Outer West (Kengeri, Mysore Road, RR Nagar, Magadi Road) ---
  { id: "blr-081", name: "RR Nagar GreenEnergy", latitude: 12.9272, longitude: 77.5154, industry: "Cleantech" },
  { id: "blr-082", name: "Kengeri SatTransit", latitude: 12.9081, longitude: 77.4851, industry: "Mobility" },
  { id: "blr-083", name: "Mysore Road CargoLink", latitude: 12.9431, longitude: 77.5255, industry: "Logistics" },
  { id: "blr-084", name: "Kumbalgodu BioPolymers", latitude: 12.8719, longitude: 77.4428, industry: "Biotechnology" },
  { id: "blr-085", name: "Chandra Layout FinTech", latitude: 12.9602, longitude: 77.5261, industry: "Fintech" },
  { id: "blr-086", name: "Magadi UrbanAgri", latitude: 12.9739, longitude: 77.4938, industry: "Agritech" },
  { id: "blr-087", name: "Nayandahalli EV Charge", latitude: 12.9469, longitude: 77.5204, industry: "Electric Vehicles" },
  { id: "blr-088", name: "Bidadi AutoBattery Tech", latitude: 12.7981, longitude: 77.3822, industry: "Energy Storage" },
  { id: "blr-089", name: "Ullal CyberNodes", latitude: 12.9401, longitude: 77.4912, industry: "Cybersecurity" },
  { id: "blr-090", name: "Rajarajeshwari MedSys", latitude: 12.9198, longitude: 77.5212, industry: "Healthtech" },

  // --- North-West & Far North (Nelamangala, Vidyaranyapura, Mathikere, Bagalakunte) ---
  { id: "blr-091", name: "Mathikere HealthAI", latitude: 13.0334, longitude: 77.5582, industry: "Healthtech" },
  { id: "blr-092", name: "Vidyaranyapura DefenceTech", latitude: 13.0772, longitude: 77.5574, industry: "Defence & Aerospace" },
  { id: "blr-093", name: "Jalahalli DroneSensors", latitude: 13.0526, longitude: 77.5267, industry: "Drones & Aerospace" },
  { id: "blr-094", name: "Bagalakunte WebSystems", latitude: 13.0489, longitude: 77.4971, industry: "SaaS" },
  { id: "blr-095", name: "Nelamangala MegaHub Express", latitude: 13.0978, longitude: 77.3924, industry: "Logistics" },
  { id: "blr-096", name: "Doddaballapur AgriBiotech", latitude: 13.2931, longitude: 77.5412, industry: "Agritech" },
  { id: "blr-097", name: "Abbigere CompositeTech", latitude: 13.0712, longitude: 77.5198, industry: "Advanced Materials" },
  { id: "blr-098", name: "Hesaraghatta EcoFarms", latitude: 13.1384, longitude: 77.4789, industry: "Agritech" },
  { id: "blr-099", name: "Chikkabanavara EdLearn", latitude: 13.0764, longitude: 77.5029, industry: "Edtech" },
  { id: "blr-100", name: "Dasarahalli PayLink", latitude: 13.0432, longitude: 77.5133, industry: "Fintech" }
];