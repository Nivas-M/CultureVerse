const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../../DATA/cultural_graph');

// 6. PERFORMING ARTS
const performingArts = [
  {
    id: 'ART-001',
    name: 'Badagutittu Yakshagana (Northern Style)',
    vernacularName: 'ಬಡಗುತಿಟ್ಟು ಯಕ್ಷಗಾನ',
    region: 'Udupi & Uttara Kannada (Kundapura, Honnavar, Sirsi)',
    keyElements: ['High-pitched Chande rhythms', 'Vibrant pirouettes and energetic jumps (Gudikattu)', 'Distinct bell-shaped turbans and large Kiritas', 'Emphasis on physical agility and dance steps'],
    musicalEnsemble: ['Chande', 'Maddale', 'Tala (cymbals)', 'Bhagavatha vocal singing'],
    prominentGurus: ['Guru Bannanje Sanjeeva Suvarna', 'Keremane Shivarama Hegde', 'Chittani Ramachandra Hegde'],
    epistemicStatus: 'Documented living practice'
  },
  {
    id: 'ART-002',
    name: 'Tenkutittu Yakshagana (Southern Style)',
    vernacularName: 'ತೆಂಕುತಿಟ್ಟು ಯಕ್ಷಗಾನ',
    region: 'Dakshina Kannada & Kasaragod',
    keyElements: ['Kathakali-influenced facial makeup and rounded headgear (Kadlevale)', 'Continuous dizzying spins (Bramhari)', 'Rich theatrical dialogue and emotive acting', 'Dominant Chenda and Maddale syncopation'],
    musicalEnsemble: ['Chenda (vertical)', 'Maddale (horizontal)', 'Jagate (bronze gong)', 'Bhagavatha lead singer'],
    prominentGurus: ['Patla Sathish Shetty', 'Kolyur Ramachandra Rao', 'Sheni Gopalakrishna Bhat'],
    epistemicStatus: 'Documented living practice'
  },
  {
    id: 'ART-003',
    name: 'Talamaddale',
    vernacularName: 'ತಾಳಮದ್ದಳೆ',
    region: 'Pan-Coastal Karnataka',
    keyElements: ['Seated impromptu intellectual debate without costumes or makeup', 'High literary Kannada and Tulu rhetoric', 'Profound philosophical interpretation of mythological characters', 'Musical anchoring by Bhagavatha and Maddale'],
    musicalEnsemble: ['Maddale', 'Tala', 'Bhagavatha singing'],
    prominentGurus: ['Dr. M. Prabhakar Joshi', 'Dr. Shridhara Bhandary', 'M.M. Hegde'],
    epistemicStatus: 'Documented living practice'
  },
  {
    id: 'ART-004',
    name: 'Pili Vesha / Huli Vesha (Tiger Dance)',
    vernacularName: 'ಪಿಲಿ ವೇಷ (ಹುಲಿ ವೇಷ)',
    region: 'Dakshina Kannada & Udupi',
    keyElements: ['Body painted head-to-toe with yellow, black, and white realistic tiger stripes', 'Fierce acrobatic backflips, rolling, and sheep-lifting teeth feats', 'Thunderous Tashe and Thaase beat accompaniment during Dasara and Krishna Janmashtami'],
    musicalEnsemble: ['Tashe drums (steel cylindrical drums struck with cane sticks)', 'Dolu'],
    prominentGurus: ['Hereditary gymnasium (Garodi) troupes across Mangalore and Udupi'],
    epistemicStatus: 'Documented living practice'
  },
  {
    id: 'ART-005',
    name: 'Togalu Gombeyata (Leather Puppet Theater)',
    vernacularName: 'ತೊಗಲು ಗೊಂಬೆಯಾಟ',
    region: 'Kundapura & Kasaragod',
    keyElements: ['Translucent deerskin or goatskin puppets manipulated behind an illuminated white cloth screen', 'Enacts episodes from Ramayana and Mahabharata', 'Chanted prose and rhythm'],
    musicalEnsemble: ['Mukhaveena', 'Ekkalam', 'Maddale', 'Tala'],
    prominentGurus: ['Uppinakudru Kogga Kamath Lineage', 'Bhaskar Kamath'],
    epistemicStatus: 'Documented living practice / UNESCO-recognized heritage'
  },
  {
    id: 'ART-006',
    name: 'Paddana Recitation',
    vernacularName: 'ಪಾಡ್ಡನ ಗಾಯನ',
    region: 'Pan-Tulunadu',
    keyElements: ['Unaccompanied or Temere-backed oral epic ballad singing', 'Sung primarily by women during paddy transplanting or by male mediums during Daiva invocations', 'Contains linguistic memory of ancient Tulu syntax, flora, and feudal history'],
    musicalEnsemble: ['Temere drum (optional) or rhythmic hand clapping'],
    prominentGurus: ['Bannanje Babu Amin', 'Dr. Indira Ballal (Archivist)'],
    epistemicStatus: 'Documented living practice & Intangible cultural heritage'
  }
];

// 7. CRAFTS
const crafts = [
  {
    id: 'CRF-001',
    name: 'Shilpa Shastra Granite & Stone Sculpting',
    vernacularName: 'ಶಿಲ್ಪಶಾಸ್ತ್ರ ಶಿಲಾ ಕೆತ್ತನೆ',
    region: 'Udupi & Karkala',
    materials: ['Black granite (Kari shile)', 'Laterite (Jambittige)', 'Soft soapstone'],
    tradition: 'Classical Agamic temple sculpture, sculpting consecrated Lingas, Yakshi icons, and dwarapalakas following Dhyana Shlokas.',
    prominentMasters: ['Purushottama Adve', 'Karkala Shilpa Kendra sculptors'],
    epistemicStatus: 'Documented living craft'
  },
  {
    id: 'CRF-002',
    name: 'Coastal Temple Wood Carving',
    vernacularName: 'ದೇವಾಲಯ ಮರ ಕೆತ್ತನೆ',
    region: 'Dakshina Kannada & Uttara Kannada',
    materials: ['Teak (Saaguvani)', 'Jackfruit wood (Halasu)', 'Rosewood (Beete)'],
    tradition: 'Carving ceiling lotus medallions (Brahma Kanta), pillar brackets (Bodigai), and intricate chariot panels depicting Dashavatara.',
    prominentMasters: ['Kalladka Ramesh Acharya', 'Gudigar master carvers of Sagara and Kumta'],
    epistemicStatus: 'Documented living craft'
  },
  {
    id: 'CRF-003',
    name: 'Kaavi Sgraffito Architectural Murals',
    vernacularName: 'ಕಾವಿ ಕಲೆ (ಗೋಡೆ ಕೆತ್ತನೆ)',
    region: 'Konkan coast, Kumta, Ankola, Mangalore',
    materials: ['Crushed laterite mud', 'Seashell lime plaster', 'Fermented jaggery water'],
    tradition: 'Etching dynamic white-on-red murals onto wet architectural lime walls using steel burins.',
    prominentMasters: ['Dinesh Holla', 'Heritage master artisans of Honnavar'],
    epistemicStatus: 'Critically endangered heritage craft'
  },
  {
    id: 'CRF-004',
    name: 'Yakshagana Headdress & Ornament Crafting',
    vernacularName: 'ಯಕ್ಷಗಾನ ಕಿರೀಟ ಮತ್ತು ವೇಷಭೂಷಣ ನಿರ್ಮಾಣ',
    region: 'Kundapura & Mangalore',
    materials: ['Light Shivani wood', 'Cardboard core', 'Gold foil / velvet', 'Mirror inlays', 'Red and green beads'],
    tradition: 'Handcrafting majestic Badagu Pagade, Thenku Kadlevale, armlets (Bhuja Keerti), and chest guards (Rompata).',
    prominentMasters: ['Uppinakudru artisans', 'Kota costume workshops'],
    epistemicStatus: 'Documented living craft'
  }
];

// 8. STORIES & KNOWLEDGE CLAIMS
const stories = [
  {
    id: 'ST-001',
    title: 'Creation of Tulunadu (Parashurama Srishti)',
    relatedPlace: 'PLC-001 / PLC-011: Arabian Sea Coast',
    narrative: 'Sage Parashurama, seeking penance for his warfare, hurled his divine battle-axe southward from Gokarna into the Arabian Sea. Varuna, god of oceans, retreated to the point where the axe fell, exposing the lush coastal territory of Parashurama Kshetra (modern Tulunadu and Konkan). Parashurama assigned guardian serpent spirits (Nagas) to neutralize the subterranean salt deposits and render the coastal soil fertile for human civilization.',
    knowledgeType: 'Puranic Origin Myth',
    epistemicStatus: 'Traditional account & Religious belief',
    source: 'Sahyadri Khanda (Skanda Purana), Grama Paddhati chronicles',
    notes: 'Geologically interpreted by modern scholars as historical coastal uplift and mangrove reclamation during the mid-Holocene.'
  },
  {
    id: 'ST-002',
    title: 'The Epic of Koti and Chennaya Baidya',
    relatedPlace: 'PLC-008: Enmoor, PLC-015: Padumale',
    narrative: 'Born to Deyi Baidethi, an expert herbal healer of Padumale, twin brothers Koti and Chennaya grew to become extraordinary archers and warriors. Defying the feudal tyrannies of regional Ballal chieftains, the twins defended peasant autonomy and established Garodis. Mortally wounded through courtly deceit during the battle of Enmoor, they transformed into immortal tutelary guardian spirits promising perpetual protection to the oppressed.',
    knowledgeType: 'Subaltern Heroic Epic',
    epistemicStatus: 'Historical folklore & Documented living tradition',
    source: 'Koti-Chennaya Paddana (over 10,000 oral verses), B.A. Saletore archives',
    notes: 'Recognized as one of the finest vernacular social justice epics in medieval South Asia.'
  },
  {
    id: 'ST-003',
    title: 'The Feminist Epic of Princess Siri',
    relatedPlace: 'PLC-010: Kavathar Alade, PLC-011: Nandikoor',
    narrative: 'Princess Siri of the royal house of Majalu, abandoned by a deceitful husband and disowned by patriarchal relatives, fiercely asserted her birthright to ancestral land. Renouncing kingdom and luxury, she journeyed across Tulunadu, performing miracles, establishing Alades, and establishing the Aliyasantana matrilineal code to ensure all daughters inherited land and lineage dignity independently of marital ties.',
    knowledgeType: 'Matrilineal Feminist Oral Epic',
    epistemicStatus: 'Oral legend & Documented living practice',
    source: 'Siri Paddana, Lauri Honko (Finnish Folklore Communications)',
    notes: 'Forms the psychological and liturgical bedrock of the annual mass trance healings during Siri Jatre.'
  },
  {
    id: 'ST-004',
    title: 'Myth of Kateel and Demon Arunasura',
    relatedPlace: 'PLC-003: Kateel Island',
    narrative: 'Demon Arunasura secured a celestial boon making him immune to death by any four-legged or two-legged being, human or weapon. As drought and terror engulfed the coast, Sage Jabali invoked Goddess Durga. The Goddess appeared before Arunasura and, when attacked, manifested into a colossal swarm of venomous bees (Bhramari), stinging the demon to death in the middle of the river. The grateful sage consecrated her as Durgaparameshwari upon a river island (Kati-Ila: Kateel).',
    knowledgeType: 'Sanctum Sthala Purana',
    epistemicStatus: 'Religious belief & Traditional account',
    source: 'Kateel Sthala Mahatmya, Padma Purana recensions',
    notes: 'Explains the consecrated location of the sanctum in the middle of flowing river waters.'
  },
  {
    id: 'ST-005',
    title: 'Kanakadasa and Kanakana Kindi',
    relatedPlace: 'PLC-014: Udupi Sri Krishna Matha',
    narrative: 'In the 16th century, saint-philosopher Kanakadasa, belonging to the Kuruba community, was barred entry into the inner sanctum of Udupi Sri Krishna Matha due to prevailing caste orthodoxy. Kanakadasa stood weeping at the western outer wall, singing verses of utter devotion. Miraculously, the granite wall cracked open, and the stone idol of Lord Krishna turned 180 degrees westward to bestow darshan to his beloved subaltern saint.',
    knowledgeType: 'Hagiographical Miracle Account',
    epistemicStatus: 'Historical fact (Kanakadasa’s historical presence) & Religious miracle belief',
    source: 'Haridasa Sahitya, Udupi Matha historical epigraphs',
    notes: 'To this day, all pilgrims must view Lord Krishna exclusively through the silver-plated Kanakana Kindi window.'
  },
  {
    id: 'ST-006',
    title: 'Atmalinga and the Cow’s Ear of Gokarna',
    relatedPlace: 'PLC-011: Gokarna Promontory',
    narrative: 'Ravana performed terrifying austerities on Mount Kailash to win Shiva’s personal Atmalinga, which would grant him absolute invulnerability. Shiva granted it under the strict condition that it must never touch the ground before reaching Lanka. The gods, terrified of Ravana’s impending power, dispatched Ganesha disguised as a young cowherd boy. Ganesha tricked Ravana into handing him the linga while Ravana performed evening ablutions, planting it firmly into the coastal granite rock. Ravana tried in vain to uproot it, twisting it into the shape of a cow’s ear (Gokarna).',
    knowledgeType: 'Puranic Kshetra Sthala Purana',
    epistemicStatus: 'Puranic religious belief',
    source: 'Gokarna Mahatmya (Skanda Purana), Shiva Purana',
    notes: 'Constitutes the religious foundation of Gokarna as one of the holiest Muktikshetras of India.'
  },
  {
    id: 'ST-007',
    title: 'Bappa Byari and the Founding of Bappanadu',
    relatedPlace: 'PLC-013: Bappanadu (Mulki)',
    narrative: 'Centuries ago, a merchant vessel belonging to Muslim trader Bappa Byari was caught in a violent storm off the Mulki coast and struck a hidden reef. In mortal peril, Bappa saw a radiant vision of Goddess Durgaparameshwari, who commanded him to have faith and guided his damaged boat safely into the Shambhavi estuary. In deep gratitude, Bappa donated his immense trading fortune to construct the grand temple of Bappanadu, with Goddess Durga declaring that his family would forever receive her first divine honours.',
    knowledgeType: 'Syncretic Historical Legend',
    epistemicStatus: 'Historical fact (endowment) & Traditional account',
    source: 'Bappanadu Temple Stone Inscriptions, District Manuals',
    notes: 'A celebrated historical anchor of communal peace in Coastal Karnataka.'
  }
];

// 9. COMMUNITIES
const communities = [
  { id: 'COM-001', name: 'Bunts (Nadavas)', region: 'Dakshina Kannada & Udupi', role: 'Historic agrarian landed gentry, chieftains (Guthus), and hereditary patrons of Daivasthanas and Yakshagana melas.', language: 'Tulu (Southern & Northern dialects)', associatedPractices: ['Aliyasantana matrilineal descent', 'Guthu house administration', 'Kola patronage'] },
  { id: 'COM-002', name: 'Billavas (Poojaris)', region: 'Dakshina Kannada & Udupi', role: 'Traditional archers, Ayurvedic herbalists, toddy tappers, and hereditary custodians of Garodis and the Koti-Chennaya lineage.', language: 'Tulu', associatedPractices: ['Garodi temple custody', 'Martial arts', 'Herbal medicine'] },
  { id: 'COM-003', name: 'Mogaveeras', region: 'Coastal belt of DK and Udupi', role: 'Indigenous marine fisherfolk, maritime navigators, and sole custodians of Bobbariya sea shrines.', language: 'Tulu / Coastal Kannada', associatedPractices: ['Deep-sea sailing', 'Maritime Daivaradhane', 'Dolu drumming'] },
  { id: 'COM-004', name: 'Shivalli Madhwa Brahmins', region: 'Udupi & Dakshina Kannada', role: 'Scholastic philosophers, Vedic Tantris, and monastic administrators of Ashta Mathas and classical Agamic sanctums.', language: 'Tulu (Brahmin dialect) / Kannada / Sanskrit', associatedPractices: ['Dvaita Vedanta', 'Paryaya administration', 'Vedic fire rituals'] },
  { id: 'COM-005', name: 'Gowd Saraswat Brahmins (GSB)', region: 'Mangalore, Karkala, Kundapura, Ankola', role: 'Historic maritime merchants, temple trustees (Venkataramana temples), and Kaavi art patrons who migrated from Goa in the 16th century.', language: 'Konkani', associatedPractices: ['Kodial Teru car festivals', 'Culinary confectionery', 'Temple commerce'] },
  { id: 'COM-006', name: 'Havyaka Brahmins', region: 'Uttara Kannada & foothills', role: 'Traditional arecanut plantation custodians, Vedic priests of Gokarna Mahabaleshwara, and Badagutittu Yakshagana scholars.', language: 'Havyaka Kannada', associatedPractices: ['Gokarna Atmalinga liturgies', 'Areca agro-forestry', 'Yakshagana patronage'] },
  { id: 'COM-007', name: 'Jain Communities (Jain Bunts & Shravakas)', region: 'Moodabidri, Karkala, Venur, Dharmasthala', role: 'Historic royal rulers (Alupas, Ajilas, Chowtas), architects of monolithic Gommateshwara statues and Thousand-Pillar Basadis, and hereditary Dharmadhikaris.', language: 'Kannada / Tulu', associatedPractices: ['Digambara Jainism', 'Mahamastakabhisheka', 'All-faith humanitarian charity (Dana)'] },
  { id: 'COM-008', name: 'Nalike, Pambada, and Parava Communities', region: 'Pan-Tulunadu', role: 'Hereditary shamans, ritual artists, and medium-dancers who alone possess the sacred right to impersonate and channel Daivas in Bootha Kola.', language: 'Tulu', associatedPractices: ['Daiva possession trance (Aavesha)', 'Botanical Ani construction', 'Mineral face painting (Banna)'] },
  { id: 'COM-009', name: 'Beary Community', region: 'Coastal Dakshina Kannada & Udupi', role: 'Historic coastal Muslim trading, seafaring, and timber community rooted in centuries-old syncretic partnerships with regional Hindu temples.', language: 'Beary Bashe', associatedPractices: ['Maritime trading', 'Bappanadu Dolu patronage', 'Timber logistics'] }
];

// 10. LANGUAGES
const languages = [
  { id: 'LANG-001', name: 'Tulu', family: 'Dravidian (Independent branch)', script: 'Historically Tigalari script; modern usage Kannada script', status: 'Indigenous language of Tulunadu, renowned for oral epics (Paddana)', speakers: 'Approx. 2.5 million' },
  { id: 'LANG-002', name: 'Kundagannada', family: 'Dravidian (Archaic Kannada dialect)', script: 'Kannada', status: 'Distinct coastal dialect of Kundapura with archaic Halegannada grammatical features', speakers: 'Approx. 800,000' },
  { id: 'LANG-003', name: 'Havyaka Kannada', family: 'Dravidian (Archaic Kannada dialect)', script: 'Kannada', status: 'Spoken by the Havyaka community of Uttara Kannada with distinctive classical phonetics', speakers: 'Approx. 500,000' },
  { id: 'LANG-004', name: 'Mangalorean Konkani', family: 'Indo-Aryan', script: 'Kannada script', status: 'Rich coastal literary language of the Saraswat, Catholic, and Kudumbi communities', speakers: 'Approx. 1 million' },
  { id: 'LANG-005', name: 'Beary Bashe', family: 'Dravidian (Hybrid Tulu-Malayalam-Arabic vocabulary)', script: 'Kannada / Arabic', status: 'Spoken by coastal Muslim Beary community, reflecting centuries of oceanic trade', speakers: 'Approx. 600,000' }
];

// 11. SACRED ECOLOGY
const sacredEcology = [
  { id: 'ECO-001', name: 'Nandini River Basin', type: 'Sacred River', region: 'Dakshina Kannada (Kateel)', significance: 'Holy river born from the Western Ghats (Kanakachala), surrounding Kateel temple island; venue of divine Avabhritha baths.' },
  { id: 'ECO-002', name: 'Netravati & Phalguni (Gurupura) Estuary', type: 'Sacred River Confluence', region: 'Dakshina Kannada (Mangalore)', significance: 'Major twin river systems of Tulunadu, merging at Bengre before meeting the Arabian Sea; water source for Dharmasthala and Polali.' },
  { id: 'ECO-003', name: 'Kumaradhara River', type: 'Sacred River', region: 'Dakshina Kannada (Kukke Subramanya)', significance: 'Perennial alpine river flowing through dense rainforests at the base of Kumara Parvatha peak; purifying waters for Sarpa Samskara.' },
  { id: 'ECO-004', name: 'Aghanashini Estuary', type: 'Sacred Estuary & Mangrove Biosphere', region: 'Uttara Kannada', significance: 'One of India’s last pristine undammed estuaries, flowing past Gokarna with dense sacred mangrove groves.' },
  { id: 'ECO-005', name: 'Nagabanas (Evergreen Serpent Groves)', type: 'Sacred Botanical Relic Groves', region: 'Pan-Coastal Karnataka (Over 10,000 groves)', significance: 'Ancient undisturbed forest patches housing endemic flora (Myristica swamps, wild cinnamon, Hopea parviflora) protected by religious taboos against tree-felling.' },
  { id: 'ECO-006', name: 'Kaanu & Devarakadus (Sacred Spirit Groves)', type: 'Sacred Forests', region: 'Western Ghats Foothills', significance: 'Communal virgin forest sanctuaries dedicated to territorial Daivas and forest spirits.' }
];

// 12. CULTURAL VOCABULARY
const culturalTerms = [
  { id: 'TERM-001', term: 'Paddana', language: 'Tulu', meaning: 'Rhythmic oral epic ballad transmitted across generations without written texts, celebrating Daivas and cultural heroines.', context: 'Sung during agricultural labor and Bootha Kola ceremonies.' },
  { id: 'TERM-002', term: 'Kola', language: 'Tulu', meaning: 'Nocturnal shamanistic spirit possession and trance-divination ritual.', context: 'Conducted at village shrines and Guthu ancestral homes.' },
  { id: 'TERM-003', term: 'Daivasthana', language: 'Tulu', meaning: 'Sanctified shrine or stone altar dedicated to indigenous protective deities (Daivas).', context: 'Differs from a Brahminical temple; possesses open wooden or laterite architecture.' },
  { id: 'TERM-004', term: 'Nagabana', language: 'Tulu / Kannada', meaning: 'Dense, sacred virgin serpent grove preserving stone Naga idols under ancient canopies.', context: 'Strict taboos forbid tree-cutting, footwear, or polluting.' },
  { id: 'TERM-005', term: 'Paryaya', language: 'Sanskrit / Kannada', meaning: 'Rotational biennial succession of monastic authority among the eight Ashta Mathas of Udupi.', context: 'Governs Sri Krishna Matha since 1522 CE.' },
  { id: 'TERM-006', term: 'Agelu', language: 'Tulu', meaning: 'Intimate domestic votive offering of cooked non-vegetarian meals or rustic food to fierce spirits.', context: 'Dedicated to deities like Koragajja and Guliga.' },
  { id: 'TERM-007', term: 'Tambila', language: 'Tulu', meaning: 'Ancestral and domestic offering of beaten rice, coconut, jaggery, and flowers.', context: 'Conducted on Sankranti and monthly family observances.' },
  { id: 'TERM-008', term: 'Garodi', language: 'Tulu', meaning: 'Sacred traditional gymnasium, martial academy, and memorial shrine of Koti-Chennaya.', context: 'Historically centers of physical culture, archery, and village defense.' },
  { id: 'TERM-009', term: 'Gurikara', language: 'Tulu', meaning: 'Traditional village chieftain or hereditary elder presiding over caste councils and temple rituals.', context: 'Key adjudicator in regional dispute resolution.' },
  { id: 'TERM-010', term: 'Ani', language: 'Tulu', meaning: 'Colossal ornamental halo headdress woven from bamboo, palm fronds, and flowers worn by Kola dancers.', context: 'Signifies divine cosmic radiance during possession.' },
  { id: 'TERM-011', term: 'Pathri / Darshana Pathri', language: 'Tulu / Kannada', meaning: 'Hereditary oracle medium who enters a divine possession trance to pronounce oracles.', context: 'Conducts communication between deities and worshippers.' },
  { id: 'TERM-012', term: 'Harake Aata', language: 'Kannada / Tulu', meaning: 'A full night-long Yakshagana performance sponsored as the fulfillment of a religious vow.', context: 'Foundational economic model of coastal folk performance.' },
  { id: 'TERM-013', term: 'Bhagavatha', language: 'Sanskrit / Tulu / Kannada', meaning: 'Lead singer, director, and narrator of a Yakshagana troupe who commands the stage with cymbals.', context: 'Holds encyclopedic memory of mythological Prasangas.' },
  { id: 'TERM-014', term: 'Pingara', language: 'Tulu', meaning: 'Fragrant tender areca palm flower blossom.', context: 'Essential ritual floral offering for Naga and Daiva ceremonies.' },
  { id: 'TERM-015', term: 'Aliyasantana', language: 'Tulu', meaning: 'Matrilineal inheritance system where family property and lineage rights descend through sisters.', context: 'Governs ancestral Guthu manors and family titles.' }
];

// 13. RELATIONSHIPS (Graph Edges)
const relationships = [
  { subjectId: 'TEMP-003', predicate: 'LOCATED_AT', objectId: 'PLC-003', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-003', predicate: 'CELEBRATES_FESTIVAL', objectId: 'FST-002', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-003', predicate: 'ANCHORS_RITUAL', objectId: 'RIT-011', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-003', predicate: 'ANCHORS_RITUAL', objectId: 'RIT-012', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-003', predicate: 'CONNECTED_TO_RIVER', objectId: 'ECO-001', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-003', predicate: 'EXPRESSES_STORY', objectId: 'ST-004', epistemicStatus: 'RELIGIOUS_BELIEF' },
  
  { subjectId: 'TEMP-005', predicate: 'LOCATED_AT', objectId: 'PLC-014', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-005', predicate: 'CELEBRATES_FESTIVAL', objectId: 'FST-005', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-005', predicate: 'CELEBRATES_FESTIVAL', objectId: 'FST-011', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-005', predicate: 'ANCHORS_RITUAL', objectId: 'RIT-015', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-005', predicate: 'ORIGINATED_FROM_TRADITION', objectId: 'TRAD-003', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-005', predicate: 'EXPRESSES_STORY', objectId: 'ST-005', epistemicStatus: 'HISTORICAL_FACT' },

  { subjectId: 'TEMP-008', predicate: 'LOCATED_AT', objectId: 'PLC-013', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-008', predicate: 'CELEBRATES_FESTIVAL', objectId: 'FST-001', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-008', predicate: 'ANCHORS_RITUAL', objectId: 'RIT-020', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-008', predicate: 'EXPRESSES_STORY', objectId: 'ST-007', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-008', predicate: 'AFFINITY_WITH_COMMUNITY', objectId: 'COM-009', epistemicStatus: 'HISTORICAL_FACT' },

  { subjectId: 'TEMP-006', predicate: 'LOCATED_AT', objectId: 'PLC-007', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-006', predicate: 'ANCHORS_RITUAL', objectId: 'RIT-003', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-006', predicate: 'ANCHORS_RITUAL', objectId: 'RIT-004', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-006', predicate: 'CONNECTED_TO_RIVER', objectId: 'ECO-003', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-006', predicate: 'ORIGINATED_FROM_TRADITION', objectId: 'TRAD-002', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },

  { subjectId: 'TEMP-007', predicate: 'LOCATED_AT', objectId: 'PLC-011', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-007', predicate: 'CELEBRATES_FESTIVAL', objectId: 'FST-007', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-007', predicate: 'ANCHORS_RITUAL', objectId: 'RIT-023', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-007', predicate: 'EXPRESSES_STORY', objectId: 'ST-006', epistemicStatus: 'RELIGIOUS_BELIEF' },
  { subjectId: 'TEMP-007', predicate: 'AFFINITY_WITH_COMMUNITY', objectId: 'COM-006', epistemicStatus: 'HISTORICAL_FACT' },

  { subjectId: 'TEMP-009', predicate: 'LOCATED_AT', objectId: 'PLC-018', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-009', predicate: 'CELEBRATES_FESTIVAL', objectId: 'FST-006', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-009', predicate: 'ANCHORS_RITUAL', objectId: 'RIT-021', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'TEMP-009', predicate: 'ORIGINATED_FROM_TRADITION', objectId: 'TRAD-004', epistemicStatus: 'HISTORICAL_FACT' },
  { subjectId: 'TEMP-009', predicate: 'CONNECTED_TO_RIVER', objectId: 'ECO-002', epistemicStatus: 'HISTORICAL_FACT' },

  { subjectId: 'PLC-010', predicate: 'HOSTS_FESTIVAL', objectId: 'FST-004', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'PLC-010', predicate: 'ANCHORS_RITUAL', objectId: 'RIT-010', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' },
  { subjectId: 'PLC-010', predicate: 'EXPRESSES_STORY', objectId: 'ST-003', epistemicStatus: 'ORAL_LEGEND' },
  { subjectId: 'PLC-010', predicate: 'AFFINITY_WITH_TRADITION', objectId: 'TRAD-006', epistemicStatus: 'DOCUMENTED_LIVING_PRACTICE' }
];

// 14. SOURCES
const sources = [
  { id: 'SRC-001', citation: 'Saletore, B.A. (1936). Ancient Karnataka: History of Tuluva. Oriental Book Agency, Poona.', authorityType: 'Academic Historian' },
  { id: 'SRC-002', citation: 'Claus, Peter J. (1978). "Heroes and Heroines in the Conceptual Framework of Tulu Culture." Journal of Indian Folkloristics.', authorityType: 'Anthropological Field Researcher' },
  { id: 'SRC-003', citation: 'Honko, Lauri et al. (1998). The Siri Epic as Performed by Gopala Naika. Folklore Fellows Communications, Academia Scientiarum Fennica, Helsinki.', authorityType: 'International Folklore Academy' },
  { id: 'SRC-004', citation: 'Gowda, K. Chinnappa (2005). The Tradition of Daivaradhane in Tulunadu. Kannada University Hampi.', authorityType: 'University Folklore Scholar' },
  { id: 'SRC-005', citation: 'Bhat, K.S. Haridasa (1991). Folk Arts of Tulunadu. Regional Resources Centre for Folk Performing Arts, Udupi.', authorityType: 'Regional Resource Centre' },
  { id: 'SRC-006', citation: 'Joshi, M. Prabhakar (2008). Jagara: Studies in Yakshagana and Talamaddale. Mangalore University Press.', authorityType: 'Performing Arts Scholar' },
  { id: 'SRC-007', citation: 'Epigraphia Carnatica & Epigraphia Indica (Archaeological Survey of India volumes on South Canara inscriptions).', authorityType: 'Epigraphical Primary Records' },
  { id: 'SRC-008', citation: 'Karnataka State Gazetteer: South Kanara District & North Kanara District (Government of Karnataka).', authorityType: 'Government Gazetteer' },
  { id: 'SRC-009', citation: 'Sri Kshetra Dharmasthala, Udupi Sri Krishna Matha, and Kateel Temple Official Endowment Chronicles and Archival Epigraphs.', authorityType: 'Primary Temple Trust Archives' }
];

// Write remaining files
fs.writeFileSync(path.join(targetDir, 'performing_arts.json'), JSON.stringify(performingArts, null, 2));
fs.writeFileSync(path.join(targetDir, 'crafts.json'), JSON.stringify(crafts, null, 2));
fs.writeFileSync(path.join(targetDir, 'stories.json'), JSON.stringify(stories, null, 2));
fs.writeFileSync(path.join(targetDir, 'communities.json'), JSON.stringify(communities, null, 2));
fs.writeFileSync(path.join(targetDir, 'languages.json'), JSON.stringify(languages, null, 2));
fs.writeFileSync(path.join(targetDir, 'sacred_ecology.json'), JSON.stringify(sacredEcology, null, 2));
fs.writeFileSync(path.join(targetDir, 'cultural_terms.json'), JSON.stringify(culturalTerms, null, 2));
fs.writeFileSync(path.join(targetDir, 'relationships.json'), JSON.stringify(relationships, null, 2));
fs.writeFileSync(path.join(targetDir, 'sources.json'), JSON.stringify(sources, null, 2));

console.log('Saved all remaining datasets successfully.');
