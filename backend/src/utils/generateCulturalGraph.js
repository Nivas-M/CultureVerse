const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../../DATA/cultural_graph');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. REGIONS
const regions = [
  { id: 'REG-001', name: 'Dakshina Kannada', vernacularName: 'ದಕ್ಷಿಣ ಕನ್ನಡ (ತುಳುನಾಡು)', geoScope: 'Coastal & Foothill belt south of Mulki river down to Chandragiri', riverBasins: ['Netravati', 'Phalguni/Gurupura', 'Kumaradhara'], primaryLanguage: 'Tulu' },
  { id: 'REG-002', name: 'Udupi', vernacularName: 'ಉಡುಪಿ (ಉತ್ತರ ತುಳುನಾಡು)', geoScope: 'Central coastal belt between Mulki river and Byndoor/Kundapura', riverBasins: ['Swarna', 'Sita', 'Pavanje', 'Nandini'], primaryLanguage: 'Tulu / Kundagannada' },
  { id: 'REG-003', name: 'Uttara Kannada', vernacularName: 'ಉತ್ತರ ಕನ್ನಡ (ಕಾರವಾರ/ಗೋಕರ್ಣ)', geoScope: 'Northern coastal estuaries and Sahyadri ghats up to Karwar', riverBasins: ['Aghanashini', 'Gangavali', 'Sharavathi', 'Kali'], primaryLanguage: 'Havyaka Kannada / Konkani' }
];

// 2. SACRED PLACES
const places = [
  { id: 'PLC-001', name: 'Mangalore Coastal Belt', district: 'Dakshina Kannada', significance: 'Ancient Alupa capital, confluence of Netravati and Phalguni rivers, home to Kadri, Mangaladevi, and Kudroli.', ecologicalContext: 'Estuarine coastal delta and red laterite ridges' },
  { id: 'PLC-002', name: 'Kadri Hills', district: 'Dakshina Kannada', significance: '10th-century confluence of Natha pantha Buddhist-Shaiva hermitage and perennial natural hill springs.', ecologicalContext: 'Laterite hills with 9 sacred natural tanks (Gomukha teertha)' },
  { id: 'PLC-003', name: 'Kateel Island', district: 'Dakshina Kannada', significance: 'Riverine island shrine situated in the exact center of the sacred Nandini river.', ecologicalContext: 'Perennial river island surrounded by sacred river waters and groves' },
  { id: 'PLC-004', name: 'Polali Plain', district: 'Dakshina Kannada', significance: '8th-century clay idol shrine on the banks of Phalguni river, site of historic Chendu football rites.', ecologicalContext: 'Lush alluvial floodplains of the Phalguni river' },
  { id: 'PLC-005', name: 'Padubidri Grove', district: 'Udupi', significance: 'Dense sacred serpent grove sanctuary and epicenter of biennial Dakkebali Tantric rites.', ecologicalContext: 'Pristine coastal evergreen Nagabana ecosystem' },
  { id: 'PLC-006', name: 'Barkur Historical Basin', district: 'Udupi', significance: 'Ancient capital of the Alupa maritime kingdom, home to 365 historic temples and coastal trade canals.', ecologicalContext: 'Seetha river estuary and ancient port canals' },
  { id: 'PLC-007', name: 'Kukke Valley', district: 'Dakshina Kannada', significance: 'Deep rainforest valley at the base of the sacred Kumara Parvatha peak, foremost serpent expiation center.', ecologicalContext: 'Dense tropical rainforest and perennial Kumaradhara river basin' },
  { id: 'PLC-008', name: 'Enmoor Garodi', district: 'Dakshina Kannada', significance: 'Sacred battlefield and memorial shrine of folk martial heroes Koti and Chennaya.', ecologicalContext: 'Interior agricultural fields and sacred Garodi precinct' },
  { id: 'PLC-009', name: 'Kuttar Foothill', district: 'Dakshina Kannada', significance: 'Epicenter of the Koragajja subaltern spirit veneration grove.', ecologicalContext: 'Laterite hillock shaded by sacred trees' },
  { id: 'PLC-010', name: 'Kavathar Alade', district: 'Udupi', significance: 'Hallowed grove for the mass possession trance and oral epic recitation of Princess Siri.', ecologicalContext: 'Ancient open-air grove shrine (Alade)' },
  { id: 'PLC-011', name: 'Gokarna Coastal Promontory', district: 'Uttara Kannada', significance: 'Sacred headland where the Sahyadri mountains plunge into the Arabian Sea, home of the Atmalinga.', ecologicalContext: 'Rocky promontories, Om Beach, and perennial Koti Theertha reservoir' }
];

// 3. TEMPLES (Connected to the anchor)
const temples = [
  { id: 'TEMP-001', name: 'Mangaladevi Temple', placeId: 'PLC-001', deity: 'Goddess Mangaladevi (Shakti / Dharani)', era: '9th Century CE (Alupa Dynasty)', architecturalStyle: 'Indigenous Kerala-Tulunadu timber and laterite sloping tiled roof', anchorSignificance: 'Eponymous deity of Mangalore, established by Matsyendranath and King Kundavarma.' },
  { id: 'TEMP-002', name: 'Kadri Manjunatha Temple', placeId: 'PLC-002', deity: 'Lord Manjunatha (Shiva) / Bodhisattva Lokeshwara', era: '10th Century CE', architecturalStyle: 'Laterite tiered sanctum housing 10th-century world-famous bronze icons', anchorSignificance: 'Living harmony of Natha yogic hermitage, Vajrayana Buddhism, and Shaivism.' },
  { id: 'TEMP-003', name: 'Kateel Sri Durgaparameshwari Temple', placeId: 'PLC-003', deity: 'Goddess Durgaparameshwari (Bhramari)', era: 'Ancient / 11th Century epigraphic renewal', architecturalStyle: 'River-island sanctum constructed within the flowing bed of Nandini river', anchorSignificance: 'World center for Harake Yakshagana and Agni Keli fire rituals.' },
  { id: 'TEMP-004', name: 'Polali Sri Rajarajeshwari Temple', placeId: 'PLC-004', deity: 'Goddess Rajarajeshwari (Clay monolithic icon)', era: '8th Century CE (King Suratha legend)', architecturalStyle: 'Famed for 10-foot clay medicinal idol (Lepa Murti) and copper-sheeted gopuram', anchorSignificance: 'Site of Polali Chendu sports ritual and ancient terracotta sculpture.' },
  { id: 'TEMP-005', name: 'Udupi Sri Krishna Matha', placeId: 'PLC-006', deity: 'Lord Krishna (Navaneetha Krishna with churning rod)', era: '13th Century CE (Consecrated by Sri Madhvacharya)', architecturalStyle: 'Ashta Matha monastic quadrangle around Madhwa Sarovara and Kanakana Kindi', anchorSignificance: 'Global fountainhead of Dvaita Vedanta philosophy and Paryaya monastic rotational governance.' },
  { id: 'TEMP-006', name: 'Kukke Sri Subramanya Temple', placeId: 'PLC-007', deity: 'Lord Subramanya (Guha / Kartikeya) protecting Serpent King Vasuki', era: 'Ancient / Puranic mentions in Skanda Purana', architecturalStyle: 'Laterite courtyards at the foot of Western Ghats peak Kumara Parvatha', anchorSignificance: 'Supreme pan-Indian sanctuary for Sarpa Samskara and Ashlesha Bali rites.' },
  { id: 'TEMP-007', name: 'Gokarna Mahabaleshwara Temple', placeId: 'PLC-011', deity: 'Lord Mahabaleshwara (Pranalinga / Atmalinga)', era: '4th-6th Century CE (Kadamba patronage / Puranic antiquity)', architecturalStyle: 'Granite and laterite Dravidian-Konkan hybrid with sunken Saligrama peetha', anchorSignificance: 'Dakshina Kashi housing the Atmalinga retrieved from Ravana by Ganesha.' },
  { id: 'TEMP-008', name: 'Bappanadu Durgaparameshwari Temple', placeId: 'PLC-001', deity: 'Goddess Durgaparameshwari (Lingarupi)', era: '12th Century CE', architecturalStyle: 'Expansive courtyard with massive Dhwajasthambha and Dolu drum pavilion', anchorSignificance: 'Symbol of Hindu-Muslim coastal syncretism built through the partnership of Goddess Durga and merchant Bappa Byari.' },
  { id: 'TEMP-009', name: 'Sri Kshetra Dharmasthala', placeId: 'PLC-007', deity: 'Lord Manjunatha (Shiva) and Four Dharma Daivas', era: '16th Century CE (Heggade chieftainship)', architecturalStyle: 'Sprawling temple city flanked by the Netravati river', anchorSignificance: 'Unique tri-religious synthesis: Jain Heggade custodianship, Vaishnava Madhwa priesthood, Shaivite deity, and folk Daivas.' }
];

// Save core datasets
fs.writeFileSync(path.join(targetDir, 'regions.json'), JSON.stringify(regions, null, 2));
fs.writeFileSync(path.join(targetDir, 'places.json'), JSON.stringify(places, null, 2));
fs.writeFileSync(path.join(targetDir, 'temples.json'), JSON.stringify(temples, null, 2));

console.log('Successfully wrote regions, places, temples');
