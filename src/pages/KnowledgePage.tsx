import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { culturalAPI, experienceAPI, CulturalRitual, CulturalOverview, Experience } from '@/lib/api';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, ShieldCheck, Search, Users, ArrowRight, Flame, 
  Theater, Trees, Scroll, MapPin, Tag, Compass, X, Calendar,
  ArrowLeft, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { CulturalAIAssistant } from '@/components/CulturalAIAssistant';

type ActiveTab = 'rituals' | 'arts' | 'stories' | 'ecology' | 'terms' | 'graph';

const epistemicColors: Record<string, string> = {
  'Documented living practice': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Historical fact': 'bg-blue-50 text-blue-800 border-blue-200',
  'Oral legend': 'bg-amber-50 text-amber-800 border-amber-200',
  'Religious belief': 'bg-purple-50 text-purple-800 border-purple-200',
  'Scholarly interpretation': 'bg-stone-50 text-stone-800 border-stone-200',
  'Traditional account': 'bg-orange-50 text-orange-800 border-orange-200',
  'Documented living craft': 'bg-teal-50 text-teal-800 border-teal-200'
};

const CULTURAL_IMAGES: Record<string, string> = {
  // Rituals
  'RIT-001': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Nagamandala.jpg',
  'RIT-002': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvuxgVHVIwNOQA1R3O9OgRXs7XFhlPBrrS8F9qYnNR2Q&s=10',
  'RIT-003': 'https://images.boldsky.com/kn/img/2023/02/balipuja-1676652068.jpg',
  'RIT-004': 'https://www.ashtamangalaprasnam.com/static/9869eb607cf8ac747d7836d0f0b5757d/14b42/blog-curse-of-the-nagas.jpg',
  'RIT-005': 'https://images.thequint.com/thequint/2022-10/dc24d67c-260a-4bd3-a25f-c42e32d0af1f/Mookambi_Guliga_03.jpg?auto=format%2Ccompress&fmt=webp&w=1200&width=720',
  'RIT-006': 'https://imagesvs.oneindia.com/kn/img/2019/02/02-pic-1549784673.jpg',
  'RIT-007': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf1lAUoFN2ean93JKzlp4DCtwp-mLqv9ih--8aCWtw9w&s=10',
  'RIT-008': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Buta_Kola_Artist_Makeup.jpg',
  'RIT-009': 'https://media.kannadaprabha.com/kannadaprabha/import/2023/2/12/original/keddasa.jpg?auto=format%2Ccompress&enlarge=true&fit=max&h=675&w=1200',
  'RIT-010': 'https://d3jde0c4xcko0v.cloudfront.net/production/default/5btrubdgmcods4pgnandalike.jpg',
  'RIT-011': 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Yakshagana_Artist.jpg',
  'RIT-012': 'https://media.assettype.com/prajavani/2025-04-12/d9npfpfn/file805swck6trt14njk69p2.jpg?ar=40%3A21&auto=format%2Ccompress&mode=crop&ogImage=true&rect=0%2C144%2C1261%2C662&w=1200',
  'RIT-013': 'https://www.tabisora.com/travel/photo/08india07/india0702-0167.jpg',
  'RIT-014': 'https://images.deccanherald.com/deccanherald/import/sites/dh/files/gallery_images/file786qezkauky1gg36j2s7.jpg',
  'RIT-015': 'https://media.newindianexpress.com/newindianexpress%2F2024-01%2F031038c5-8f84-4f4b-8e2c-61419587e4ed%2Fudp1181.jpg?auto=format%2Ccompress&fit=crop&h=1200&rect=260%2C0%2C1066%2C1066&w=1200',
  'RIT-016': 'https://upload.wikimedia.org/wikipedia/commons/7/74/%E0%B2%95%E0%B3%8B%E0%B2%9F%E0%B2%BF_%E0%B2%9A%E0%B3%86%E0%B2%A8%E0%B3%8D%E0%B2%A8%E0%B2%AF.jpg',
  'RIT-017': 'https://images.deccanherald.com/deccanherald/import/sites/dh/files/gallery_images/file74uyclbdxtxd1ni2kci.jpg?w=1200',
  'RIT-018': 'https://images.thequint.com/thequint/2022-10/dc24d67c-260a-4bd3-a25f-c42e32d0af1f/Mookambi_Guliga_03.jpg?auto=format%2Ccompress&fmt=webp&w=1200&width=720',
  'RIT-019': 'https://media.assettype.com/deccanherald%2Fimport%2Fsites%2Fdh%2Ffiles%2Fgallery_images%2Ffile7mbx0aqto9j3jdt88u2.jpg?w=1200',
  'RIT-020': 'https://images.deccanherald.com/deccanherald/import/sites/dh/files/gallery_images/file786qezkauky1gg36j2s7.jpg',
  'RIT-021': 'https://www.utsav.gov.in/public/uploads/event_picture_image/event_523/16573575781087295552.jpg',
  'RIT-022': 'https://121clicks.com/wp-content/uploads/2018/07/mahamastakabhisheka_photo_series_shreenivas_yenni_08.jpg',
  'RIT-023': 'https://static-assets.asianetnews.com/kp/json/26082024/pictures/26GKN2_806.JPG',
  'RIT-024': 'https://media.assettype.com/deccanherald%2Fimport%2Fsites%2Fdh%2Ffiles%2Farticle_images%2F2020%2F02%2F22%2Fkambala-1582337250.jpg',
  'RIT-025': 'https://i.pinimg.com/736x/21/79/3a/21793acc663eeda70792b7ca9533a963.jpg',
  'RIT-026': 'https://images.deccanherald.com/deccanherald/import/sites/dh/files/gallery_images/file786qezkauky1gg36j2s7.jpg',
  'RIT-027': 'https://media.assettype.com/prajavani%2F2026-02-15%2Fdwli49fl%2Fcbb8987e-e79e-439a-9a93-095fce4d104c.jpg?ar=40%3A21&auto=format%2Ccompress&mode=crop&ogImage=true&rect=0%2C60%2C1600%2C840&w=1200',
  'RIT-028': 'https://www.bellevision.com/article-images/08-2021/08-08-2021/Aug0821_News_Aati_Amavasya.jpg',
  'RIT-029': 'https://media.assettype.com/deccanherald/import/sites/dh/files/gallery_images/file7r4330czzf510voopicg.jpg?w=1200',
  'RIT-030': 'https://www.tabisora.com/travel/photo/08india07/india0702-0167.jpg',
  'RIT-031': 'https://akm-img-a-in.tosshub.com/sites/dailyo/resources/202210/1200-9181022034959.jpeg',
  'RIT-032': 'https://d218byoo78ov75.cloudfront.net/images/4ceded04af823a0b5082e9e4d09ff91b.jpg',

  // Performing Arts
  'ART-001': 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Yakshagana_Artist.jpg',
  'ART-002': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Yakshagana_Performance_at_NINASAM_%28India_Theatre_Forum_Stuyd_Tour_May_2013%29_%288765323722%29.jpg',
  'ART-003': 'https://upload.wikimedia.org/wikipedia/commons/9/94/Chenda_melam.jpg',
  'ART-004': 'https://im.rediff.com/1600-900/getahead/2024/oct/05kalicharan-lead.jpg',
  'ART-005': 'https://d218byoo78ov75.cloudfront.net/images/4ceded04af823a0b5082e9e4d09ff91b.jpg',
  'ART-006': 'https://media.assettype.com/deccanherald%2Fimport%2Fsites%2Fdh%2Ffiles%2Fgallery_images%2Ffile749y4vo5mtebc1dwfa5.jpg?w=1200',

  // Crafts
  'CRF-001': 'https://upload.wikimedia.org/wikipedia/commons/1/12/DoorCarvingsKalaseswaraTemple.jpg',
  'CRF-002': 'https://upload.wikimedia.org/wikipedia/commons/1/12/DoorCarvingsKalaseswaraTemple.jpg',
  'CRF-003': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Kaavi_Art_in_the_Convent_of_Santa_Monica%2C_Old_Goa%2C_India..jpg',
  'CRF-004': 'https://i.ytimg.com/vi/D3dkX7UFDgg/maxresdefault.jpg',

  // Stories
  'ST-001': 'https://upload.wikimedia.org/wikipedia/commons/8/88/Palm_leaf_manuscript.jpg',
  'ST-002': 'https://d3jde0c4xcko0v.cloudfront.net/production/default/5btrubdgmcods4pgnandalike.jpg',
  'ST-003': 'https://upload.wikimedia.org/wikipedia/commons/7/74/%E0%B2%95%E0%B3%8B%E0%B2%9F%E0%B2%BF_%E0%B2%9A%E0%B3%86%E0%B2%A8%E0%B3%8D%E0%B2%A8%E0%B2%AF.jpg',
  'ST-004': 'https://images.deccanherald.com/deccanherald/import/sites/dh/files/gallery_images/file74uyclbdxtxd1ni2kci.jpg?w=1200',
  'ST-005': 'https://images.thequint.com/thequint/2022-10/dc24d67c-260a-4bd3-a25f-c42e32d0af1f/Mookambi_Guliga_03.jpg?auto=format%2Ccompress&fmt=webp&w=1200&width=720',
  'ST-006': 'https://media.assettype.com/prajavani/2025-04-12/d9npfpfn/file805swck6trt14njk69p2.jpg?ar=40%3A21&auto=format%2Ccompress&mode=crop&ogImage=true&rect=0%2C144%2C1261%2C662&w=1200',
  'ST-007': 'https://images.thequint.com/thequint/2022-10/dc24d67c-260a-4bd3-a25f-c42e32d0af1f/Mookambi_Guliga_03.jpg?auto=format%2Ccompress&fmt=webp&w=1200&width=720',
  'ST-008': 'https://media.assettype.com/deccanherald%2Fimport%2Fsites%2Fdh%2Ffiles%2Farticle_images%2F2020%2F02%2F22%2Fkambala-1582337250.jpg',

  // Sacred Ecology
  'ECO-001': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR87ya8q0_k9mBTjI65dlcSF20Jg4tnEpJsBTN77luxKA&s=10',
  'ECO-002': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR87ya8q0_k9mBTjI65dlcSF20Jg4tnEpJsBTN77luxKA&s=10',
  'ECO-003': 'https://vault.drishticuet.com/hindi_file_uploads/1734606628_sacred-groves.png',
  'ECO-004': 'https://vault.drishticuet.com/hindi_file_uploads/1734606628_sacred-groves.png'
};

const getEntityImage = (id?: string, name?: string): string => {
  if (id && CULTURAL_IMAGES[id]) return CULTURAL_IMAGES[id];
  const n = (name || '').toLowerCase();
  if (n.includes('naga') || n.includes('sarpa') || n.includes('dakkebali')) return CULTURAL_IMAGES['RIT-001'];
  if (n.includes('kola') || n.includes('nema') || n.includes('daiva') || n.includes('spirit') || n.includes('koragajja')) return CULTURAL_IMAGES['RIT-005'];
  if (n.includes('yakshagana') || n.includes('aata') || n.includes('dance')) return CULTURAL_IMAGES['ART-001'];
  if (n.includes('kambala') || n.includes('buffalo')) return CULTURAL_IMAGES['RIT-024'];
  if (n.includes('kaavi') || n.includes('mural') || n.includes('baravu')) return CULTURAL_IMAGES['CRF-003'];
  if (n.includes('shilpa') || n.includes('wood') || n.includes('carv') || n.includes('sculpt')) return CULTURAL_IMAGES['CRF-001'];
  if (n.includes('puppet') || n.includes('gombeyata')) return CULTURAL_IMAGES['ART-005'];
  if (n.includes('manuscript') || n.includes('script') || n.includes('paryaya')) return CULTURAL_IMAGES['RIT-015'];
  if (n.includes('forest') || n.includes('grove') || n.includes('river') || n.includes('bana')) return CULTURAL_IMAGES['ECO-001'];
  return 'https://upload.wikimedia.org/wikipedia/commons/2/27/Nagamandala.jpg';
};

interface RitualAuthority {
  author: string;
  role: string;
  source?: string;
}

// Verified Coastal Masters, Lineage Custodians, and Scholars
const RITUAL_AUTHORITIES: Record<string, RitualAuthority> = {
  'RIT-001': { author: 'Sagri Gopalakrishna Samaga & Vaidya Guild', role: 'Hereditary Nagamandala Master & Scholar', source: 'K.S. Haridasa Bhat Archival Records' },
  'RIT-002': { author: 'Vaidya Community Lineage Elders', role: 'Dakkebali Mandali Custodians', source: 'Coastal Folk Academy Field Studies' },
  'RIT-003': { author: 'Kukke Tantri Mandali', role: 'Vedic Serpent Liturgy Authority', source: 'Agama Vidhana & Sthala Grantha' },
  'RIT-004': { author: 'Hereditary Tantris of Tulunadu', role: 'Sacred Grove Rites Custodians', source: 'Prayoga Manjari Chronicles' },
  'RIT-005': { author: 'Dayananda Kathalsar & Nalike/Parava Elders', role: 'Living Daiva Lore Authority & Mediums', source: 'Karnataka Tulu Sahitya Academy' },
  'RIT-006': { author: 'Bunt Guthu Chieftains & Pambada Lineage', role: 'Nemotsava Ritual Conservators', source: 'Guthu Mane Hereditary Registers' },
  'RIT-007': { author: 'Mogaveera & Billava Elders', role: 'Ancestral Sea & Field Protectors', source: 'Gramasthara Sampradaya' },
  'RIT-008': { author: 'Tuluva Hereditary Households', role: 'Household Spirit Stewards', source: 'Kudla Janapada Corpus' },
  'RIT-009': { author: 'Bannanje Babu Amin & Agrarian Guthus', role: 'Folk Epic Researcher & Janapada Custodian', source: 'Tulu Janapada Sahitya' },
  'RIT-010': { author: 'Bannanje Babu Amin & Kumara Lineage', role: 'Siri Epic Scholar & Hereditary Bards', source: 'Finnish-Indian Siri Project Archives' },
  'RIT-011': { author: 'Patla Sathish Shetty & Kateel Mela Troupes', role: 'Harake Aata Master Bhagavatha', source: 'Yakshadhruva Archival Society' },
  'RIT-012': { author: 'Kateel Asranna Family & Kodethoor Villagers', role: 'Temple Hereditary Trustees', source: 'Sri Durga Parameshwari Sthala Purana' },
  'RIT-013': { author: 'Konda Seva Mandala', role: 'Fire-walking Vrata Keepers', source: 'Temple Devasthana Inscriptions' },
  'RIT-014': { author: 'Polali Hereditary Trustees & Samagara Guild', role: 'Sacred Ball Game Guardians', source: 'Rajarajeshwari Epigraphical Records' },
  'RIT-015': { author: 'Ashta Matha Pithadhipatis & Scholar Upadhyayas', role: 'Madhwa Dwaita Lineage Pontiffs', source: 'Udupi Matha Records (1532 CE)' },
  'RIT-016': { author: 'Bannanje Babu Amin & Garodi Baidarkala Elders', role: 'Koti-Chennaya Epic Custodians', source: 'Garodi Trust Archives & Paddana Field Recordings' },
  'RIT-017': { author: 'Mogaveera Fisherfolk Grama Sabhas', role: 'Maritime Lineage Elders', source: 'Coastal Marine Shrine Records' },
  'RIT-018': { author: 'Koraga Community Elders & Kutthar Shrines', role: 'Sacred Spirit Mediums', source: 'Indigenous Oral Traditions' },
  'RIT-019': { author: 'Nalike Lineage Performers', role: 'Monsoon Cleansing Healers', source: 'Janapada Heritage Documentation' },
  'RIT-020': { author: 'Bappanadu Bunt Trustees & Beary Elders', role: 'Interfaith Temple Harmonizers', source: 'Bappanadu Charitre Manuscripts' },
  'RIT-021': { author: 'Dr. D. Veerendra Heggade & Dharmasthala Trust', role: 'Hereditary Dharmadhikari', source: 'Manjunatha Kshetra Vamshavali' },
  'RIT-022': { author: 'Moodabidri Jain Bhattarakas', role: 'Digambara Jain Heritage Lineage', source: 'Dhavala Palm-Leaf Manuscripts' },
  'RIT-023': { author: 'Vidwan Korgi Venkatesha Upadhyaya & Havyaka Priests', role: 'Atmalinga Hereditary Scholars', source: 'Gokarna Mahatmya' },
  'RIT-024': { author: 'Kadri Navaneeth Shetty & Field Historians', role: 'Tulunadu Agrarian Folklorist', source: 'Dakshina Kannada Traditional Sports Register' },
  'RIT-025': { author: 'Dinesh Holla & Daivajna Guild', role: 'Kaavi Kale Master Conservator', source: 'Konkan-Kanara Mural Project' },
  'RIT-026': { author: 'Harinarayana Asranna', role: 'Hereditary Vedic Priest & Scholar', source: 'Kateel Agama Sangraha' },
  'RIT-027': { author: 'Coastal Riverine Teertha Samitis', role: 'Sacred Hydrology Keepers', source: 'Sahyadri Watershed Chronicles' },
  'RIT-028': { author: 'Dayananda Kathalsar & Herbalists', role: 'Tulu Ethnobotany Custodian', source: 'Indigenous Botanical Folklore' },
  'RIT-029': { author: 'Indigenous Vaidya Lineages', role: 'Ayurvedic Folk Healers', source: 'Nati Vaidya Palm Manuscripts' },
  'RIT-030': { author: 'Subrahmanya Temple Archaks', role: 'Penance Rite Instructors', source: 'Skanda Purana Sanhita' },
  'RIT-031': { author: 'Pambada Mediums & Guthu Patrons', role: 'Tiger Deity Ritual Custodians', source: 'Paddana Ballad Archives' },
  'RIT-032': { author: 'Sri K.V. Ramesh', role: 'Uppinakudru Puppetry Master Custodian', source: 'Gombeyata Academy Heritage Registry' }
};

const getRitualAuthority = (ritual: CulturalRitual): RitualAuthority => {
  if (RITUAL_AUTHORITIES[ritual.id]) {
    return RITUAL_AUTHORITIES[ritual.id];
  }
  const comm = (ritual.communities && ritual.communities.length > 0)
    ? ritual.communities.join(', ')
    : 'Hereditary Lineage Practitioners';
  return {
    author: comm,
    role: 'Traditional Lineage Custodian',
    source: ritual.source
  };
};

type DossierItem = 
  | { type: 'ritual'; data: CulturalRitual }
  | { type: 'art'; data: any }
  | { type: 'craft'; data: any }
  | { type: 'story'; data: any }
  | { type: 'ecology'; data: any };

const KnowledgePage = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as ActiveTab | null;
  const [activeTab, setActiveTab] = useState<ActiveTab>(tabParam && ['rituals','arts','stories','ecology','terms','graph'].includes(tabParam) ? tabParam : 'rituals');
  const [rituals, setRituals] = useState<CulturalRitual[]>([]);
  const [arts, setArts] = useState<any[]>([]);
  const [crafts, setCrafts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [ecology, setEcology] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [overview, setOverview] = useState<CulturalOverview | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDossier, setSelectedDossier] = useState<DossierItem | null>(null);

  // Sync tab from URL when navigating directly
  useEffect(() => {
    const t = searchParams.get('tab') as ActiveTab | null;
    if (t && ['rituals','arts','stories','ecology','terms','graph'].includes(t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAllCulturalData();
  }, []);

  // Prevent background scroll when full-screen dossier is open
  useEffect(() => {
    if (selectedDossier) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDossier]);

  const fetchAllCulturalData = async () => {
    setLoading(true);
    try {
      const [
        overviewRes,
        ritualsRes,
        artsRes,
        storiesRes,
        placesRes,
        termsRes,
        graphRes,
        experiencesRes
      ] = await Promise.all([
        culturalAPI.getOverview().catch(() => null),
        culturalAPI.getRituals().catch(() => ({ data: [] })),
        culturalAPI.getArtsAndCrafts().catch(() => ({ data: { performingArts: [], crafts: [] } })),
        culturalAPI.getStories().catch(() => ({ data: [] })),
        culturalAPI.getPlacesAndEcology().catch(() => ({ data: { places: [], sacredEcology: [], temples: [] } })),
        culturalAPI.getTerms().catch(() => ({ data: [] })),
        culturalAPI.getGraph().catch(() => ({ data: { nodes: [], edges: [] } })),
        experienceAPI.getAll().catch(() => ({ data: [] }))
      ]);

      if (overviewRes?.success) setOverview(overviewRes.data);
      if (ritualsRes?.data) setRituals(ritualsRes.data);
      if (artsRes?.data) {
        setArts(artsRes.data.performingArts || []);
        setCrafts(artsRes.data.crafts || []);
      }
      if (storiesRes?.data) setStories(storiesRes.data);
      if (placesRes?.data) {
        setEcology(placesRes.data.sacredEcology || []);
      }
      if (termsRes?.data) setTerms(termsRes.data);
      if (graphRes?.data) setGraphData(graphRes.data);
      if (experiencesRes?.data) setExperiences(experiencesRes.data);
    } catch (err) {
      console.error('Failed to load cultural knowledge:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to dynamically match any cultural entity to its living workshop experience
  const matchExperience = (name: string = '', category: string = '', id: string = ''): Experience | null => {
    if (!experiences || experiences.length === 0) return null;
    const n = name.toLowerCase();
    const c = category.toLowerCase();
    const i = id.toLowerCase();

    // Direct mappings to active workshops
    if (i === 'rit-001' || i === 'rit-002' || n.includes('nagamandala') || n.includes('dakkebali') || n.includes('serpent') || n.includes('sarpa')) {
      return experiences.find(e => e.title.toLowerCase().includes('nagamandala')) || null;
    }
    if (i === 'rit-005' || i === 'rit-006' || i === 'rit-018' || i === 'rit-031' || n.includes('kola') || n.includes('nema') || n.includes('daiva') || n.includes('koragajja') || n.includes('pilichamundi')) {
      return experiences.find(e => e.title.toLowerCase().includes('sacred groves & daiva')) || null;
    }
    if (i === 'art-001' || n.includes('badagutittu')) {
      return experiences.find(e => e.title.toLowerCase().includes('badagutittu')) || null;
    }
    if (i === 'art-002' || i === 'rit-011' || n.includes('tenkutittu') || n.includes('bhagavathike') || n.includes('harake yakshagana') || n.includes('yakshagana')) {
      return experiences.find(e => e.title.toLowerCase().includes('bhagavathike')) || experiences.find(e => e.title.toLowerCase().includes('badagutittu')) || null;
    }
    if (i === 'art-003' || n.includes('talamaddale')) {
      return experiences.find(e => e.title.toLowerCase().includes('talamaddale')) || null;
    }
    if (i === 'art-005' || i === 'rit-032' || n.includes('gombeyata') || n.includes('puppet')) {
      return experiences.find(e => e.title.toLowerCase().includes('puppet')) || null;
    }
    if (i === 'art-006' || i === 'rit-009' || i === 'rit-010' || i === 'rit-016' || n.includes('paddana') || n.includes('siri') || n.includes('koti') || n.includes('keddasa')) {
      return experiences.find(e => e.title.toLowerCase().includes('paddana')) || null;
    }
    if (i === 'crf-001' || n.includes('shilpa') || n.includes('granite') || n.includes('stone') || n.includes('sculpt')) {
      return experiences.find(e => e.title.toLowerCase().includes('shilpa')) || null;
    }
    if (i === 'crf-002' || n.includes('wood') || n.includes('carving') || n.includes('relief')) {
      return experiences.find(e => e.title.toLowerCase().includes('relief architecture') || e.title.toLowerCase().includes('carving')) || null;
    }
    if (i === 'crf-003' || i === 'rit-025' || n.includes('kaavi') || n.includes('bale baravu') || n.includes('line art')) {
      return experiences.find(e => e.title.toLowerCase().includes('iconography & line art')) || null;
    }
    if (i === 'crf-004' || n.includes('abhinaya') || n.includes('costume') || n.includes('headdress')) {
      return experiences.find(e => e.title.toLowerCase().includes('abhinaya')) || null;
    }
    if (i === 'rit-024' || n.includes('kambala') || n.includes('racing') || n.includes('buffalo')) {
      return experiences.find(e => e.title.toLowerCase().includes('kambala')) || null;
    }
    if (i === 'rit-015' || i === 'rit-023' || n.includes('script') || n.includes('manuscript') || n.includes('paryaya') || n.includes('atmalinga')) {
      return experiences.find(e => e.title.toLowerCase().includes('manuscripts')) || null;
    }
    if (i === 'rit-012' || i === 'rit-020' || i === 'rit-026' || n.includes('kateel') || n.includes('vedic') || n.includes('agni keli') || n.includes('dolu')) {
      return experiences.find(e => e.title.toLowerCase().includes('vedic temple')) || null;
    }
    if (n.includes('origin') || n.includes('lineage') || n.includes('ancestral') || n.includes('parashurama')) {
      return experiences.find(e => e.title.toLowerCase().includes('ancestral records')) || null;
    }

    return experiences.find(e => {
      const et = e.title.toLowerCase();
      return (n.length > 4 && et.includes(n.slice(0, 5))) || e.category === c;
    }) || null;
  };

  // Filtered rituals
  const filteredRituals = rituals.filter((r) => {
    const desc = r.fullDescription || r.shortDescription || r.summary || '';
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || r.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const categories = ['all', 'Serpent', 'Spirit', 'Agrarian', 'Martial', 'Tantric', 'Agamic', 'Monastic'];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#2B211B]">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        {/* Editorial Masthead */}
        <section className="border-b border-[#D8CEBE] bg-[#EFE7DA]/80 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C9562D] block font-semibold">
                Biocultural Watershed Archive · Coastal Karnataka
              </span>
              <div className="flex items-center gap-2 text-xs font-mono bg-white/70 border border-[#D8CEBE] px-3 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9562D]" />
                <span>Epistemic Lineage Gated</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8 space-y-3">
                <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#24170F] tracking-tight leading-[1.05]">
                  Living Cultural Ecosystem
                </h1>
                <p className="text-[#756B62] max-w-2xl text-sm sm:text-base leading-relaxed font-light">
                  Culture is larger than its temples. Discover the interconnected web of living ritual systems, hereditary custodians, performing arts, oral epics (*Paddanas*), sacred groves (*Nagabanas*), and languages across Dakshina Kannada, Udupi, and Uttara Kannada. Select any dossier to read in full and book living masterclasses.
                </p>
              </div>

              {overview && (
                <div className="lg:col-span-4 bg-white/80 p-5 border border-[#D8CEBE] rounded-sm space-y-3 shadow-xs">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#756B62]">
                    Validated Cultural Corpus
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 bg-[#F5F0E7] rounded">
                      <div className="text-xl font-serif font-bold text-[#C9562D]">{overview.summary.ritualsCount}</div>
                      <div className="text-[10px] uppercase text-[#756B62]">Rituals</div>
                    </div>
                    <div className="p-2 bg-[#F5F0E7] rounded">
                      <div className="text-xl font-serif font-bold text-[#24170F]">{overview.summary.performingArtsCount + overview.summary.craftsCount}</div>
                      <div className="text-[10px] uppercase text-[#756B62]">Arts & Crafts</div>
                    </div>
                    <div className="p-2 bg-[#F5F0E7] rounded">
                      <div className="text-xl font-serif font-bold text-[#24170F]">{overview.summary.storiesCount}</div>
                      <div className="text-[10px] uppercase text-[#756B62]">Oral Epics</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#756B62] flex items-center justify-between pt-1 border-t border-[#D8CEBE]/50">
                    <span>{overview.summary.placesCount} Sacred Sites & Rivers</span>
                    <span>{experiences.length} Active Masterclasses</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="pt-6 flex flex-wrap gap-2 border-t border-[#D8CEBE]">
              {[
                { id: 'rituals', label: 'Living Ritual Systems', icon: Flame },
                { id: 'arts', label: 'Performing Arts & Crafts', icon: Theater },
                { id: 'stories', label: 'Oral Epics & Sthala Puranas', icon: Scroll },
                { id: 'ecology', label: 'Sacred Ecology & Groves', icon: Trees },
                { id: 'terms', label: 'Vernacular Vocabulary', icon: BookOpen },
                { id: 'graph', label: 'Ecosystem Knowledge Graph', icon: Compass },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as ActiveTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-sans uppercase tracking-wider font-semibold rounded-sm border transition-all ${
                    activeTab === id
                      ? 'bg-[#C9562D] text-white border-[#C9562D] shadow-xs'
                      : 'bg-white/80 text-[#756B62] border-[#D8CEBE] hover:text-[#24170F] hover:bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* TAB 1: LIVING RITUALS DIRECTORY */}
          {activeTab === 'rituals' && (
            <div className="space-y-8">
              {/* Search and Category Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-sm border border-[#D8CEBE]">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756B62]" />
                  <Input
                    type="text"
                    placeholder="Search by ritual name, category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 text-xs bg-[#F5F0E7]/50 border-[#D8CEBE]"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs text-[#756B62] mr-1">Filter Tradition:</span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[11px] px-3 py-1 rounded border transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#24170F] text-white border-[#24170F] font-medium'
                          : 'bg-[#F5F0E7] text-[#756B62] border-[#D8CEBE] hover:bg-white'
                      }`}
                    >
                      {cat === 'all' ? 'All Traditions' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rituals Grid (Clean Cards with Heritage Imagery) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRituals.map((ritual) => {
                  const epStatus = ritual.epistemicStatus || ritual.epistemic_status || 'Documented living practice';
                  const summary = ritual.shortDescription || ritual.fullDescription || ritual.summary || '';
                  const authority = getRitualAuthority(ritual);
                  const matchedExp = matchExperience(ritual.name, ritual.category, ritual.id);
                  const cardImg = getEntityImage(ritual.id, ritual.name);

                  return (
                    <div
                      key={ritual.id}
                      onClick={() => setSelectedDossier({ type: 'ritual', data: ritual })}
                      className="bg-white border border-[#D8CEBE] rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-[#C9562D] transition-all cursor-pointer group"
                    >
                      <div>
                        {/* Heritage Image */}
                        <div className="relative h-44 w-full overflow-hidden bg-[#24170F]/10">
                          <img
                            src={cardImg}
                            alt={ritual.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-white/95 uppercase tracking-wider font-semibold bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded">
                              {ritual.id} · {ritual.category}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-mono bg-white/90 ${
                              epistemicColors[epStatus] || 'text-stone-800'
                            }`}>
                              {epStatus}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-2.5">
                          <h3 className="font-serif text-2xl font-normal text-[#24170F] group-hover:text-[#C9562D] transition-colors leading-snug">
                            {ritual.name}
                          </h3>

                          <p className="text-xs text-[#756B62] leading-relaxed line-clamp-2">
                            {summary}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/40 flex items-center justify-between text-xs">
                        <div className="text-[11px] text-[#756B62] truncate pr-2">
                          {matchedExp ? (
                            <span className="text-[#C9562D] font-medium font-mono text-[10px] uppercase">
                              Workshop Open
                            </span>
                          ) : (
                            <span className="truncate">{authority.author.split('&')[0].trim()}</span>
                          )}
                        </div>

                        <span className="text-xs text-[#24170F] group-hover:text-[#C9562D] font-medium flex items-center gap-1 shrink-0 transition-colors">
                          <span>Read Dossier</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PERFORMING ARTS & CRAFTS */}
          {activeTab === 'arts' && (
            <div className="space-y-12">
              <div>
                <div className="mb-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C9562D]">Autonomous Living Traditions</span>
                  <h2 className="font-serif text-3xl text-[#24170F]">Performing Arts of the Coast</h2>
                  <p className="text-xs text-[#756B62]">Select any performing tradition to read the complete aesthetic dossier and access masterclasses.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {arts.map((art) => {
                    const epStatus = art.epistemicStatus || art.epistemic_status || 'Documented living practice';
                    const gurus = art.prominentGurus || [];
                    const matchedExp = matchExperience(art.name, 'folk_performance', art.id);
                    const cardImg = getEntityImage(art.id, art.name);

                    return (
                      <div 
                        key={art.id} 
                        onClick={() => setSelectedDossier({ type: 'art', data: art })}
                        className="bg-white border border-[#D8CEBE] rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-[#C9562D] transition-all cursor-pointer group"
                      >
                        <div>
                          {/* Image */}
                          <div className="relative h-44 w-full overflow-hidden bg-[#24170F]/10">
                            <img
                              src={cardImg}
                              alt={art.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                              <span className="font-mono text-[10px] text-white/95 uppercase tracking-wider font-semibold bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded">
                                {art.id}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded border font-mono bg-white/90 ${
                                epistemicColors[epStatus] || 'text-stone-800'
                              }`}>
                                {epStatus}
                              </span>
                            </div>
                          </div>

                          <div className="p-5 space-y-2.5">
                            <h3 className="font-serif text-2xl text-[#24170F] group-hover:text-[#C9562D] transition-colors leading-snug">
                              {art.name}
                            </h3>
                            <p className="text-xs text-[#756B62]">{art.region}</p>

                            {gurus.length > 0 && (
                              <p className="text-xs text-[#756B62] line-clamp-1">
                                Gurus: <strong className="text-[#24170F] font-medium">{gurus.join(', ')}</strong>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/40 flex items-center justify-between text-xs">
                          <div className="text-[11px] text-[#756B62]">
                            {matchedExp ? (
                              <span className="text-[#C9562D] font-medium font-mono text-[10px] uppercase">
                                Masterclass Open
                              </span>
                            ) : (
                              <span>Living Art</span>
                            )}
                          </div>

                          <span className="text-xs text-[#24170F] group-hover:text-[#C9562D] font-medium flex items-center gap-1 shrink-0 transition-colors">
                            <span>Read Dossier</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C9562D]">Living Artisan Guilds</span>
                  <h2 className="font-serif text-3xl text-[#24170F]">Sacred Crafts & Architecture</h2>
                  <p className="text-xs text-[#756B62]">Sculptural and architectural lineages handed down through centuries of temple craftsmanship.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {crafts.map((craft) => {
                    const matchedExp = matchExperience(craft.name, 'craft_workshop', craft.id);
                    const cardImg = getEntityImage(craft.id, craft.name);

                    return (
                      <div 
                        key={craft.id} 
                        onClick={() => setSelectedDossier({ type: 'craft', data: craft })}
                        className="bg-white border border-[#D8CEBE] rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-[#C9562D] transition-all cursor-pointer group"
                      >
                        <div>
                          {/* Image */}
                          <div className="relative h-44 w-full overflow-hidden bg-[#24170F]/10">
                            <img
                              src={cardImg}
                              alt={craft.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                              <span className="font-mono text-[10px] text-white/95 uppercase tracking-wider font-semibold bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded">
                                {craft.id} · {craft.region}
                              </span>
                              <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200 font-mono">
                                {craft.epistemicStatus}
                              </span>
                            </div>
                          </div>

                          <div className="p-5 space-y-2.5">
                            <h3 className="font-serif text-2xl text-[#24170F] group-hover:text-[#C9562D] transition-colors leading-snug">
                              {craft.name}
                            </h3>

                            <p className="text-xs text-[#756B62] leading-relaxed line-clamp-2">
                              {craft.tradition}
                            </p>

                            {craft.prominentMasters && (
                              <p className="text-xs text-[#756B62]">
                                Artisans: <strong className="text-[#24170F] font-medium">{craft.prominentMasters.join(', ')}</strong>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/40 flex items-center justify-between text-xs">
                          <div className="text-[11px] text-[#756B62]">
                            {matchedExp ? (
                              <span className="text-[#C9562D] font-medium font-mono text-[10px] uppercase">
                                Workshop Open
                              </span>
                            ) : (
                              <span>Artisan Guild</span>
                            )}
                          </div>

                          <span className="text-xs text-[#24170F] group-hover:text-[#C9562D] font-medium flex items-center gap-1 shrink-0 transition-colors">
                            <span>Read Dossier</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORAL EPICS & STORIES */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C9562D]">Literature of the Soil</span>
                <h2 className="font-serif text-3xl text-[#24170F]">Living Oral Epics & Sthala Puranas</h2>
                <p className="text-xs text-[#756B62]">Passed down matrilineally through song (*Paddana*) and coastal folklore.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stories.map((story) => {
                  const matchedExp = matchExperience(story.title, 'storytelling', story.id);
                  const cardImg = getEntityImage(story.id, story.title);

                  return (
                    <div 
                      key={story.id} 
                      onClick={() => setSelectedDossier({ type: 'story', data: story })}
                      className="bg-white border border-[#D8CEBE] rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-[#C9562D] transition-all cursor-pointer group"
                    >
                      <div>
                        {/* Image */}
                        <div className="relative h-44 w-full overflow-hidden bg-[#24170F]/10">
                          <img
                            src={cardImg}
                            alt={story.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-white/95 uppercase tracking-wider font-semibold bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded">
                              {story.id} · {story.knowledgeType}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-mono bg-white/90 ${
                              epistemicColors[story.epistemicStatus] || 'text-stone-700'
                            }`}>
                              {story.epistemicStatus}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-2.5">
                          <h3 className="font-serif text-2xl text-[#24170F] group-hover:text-[#C9562D] transition-colors leading-snug">
                            {story.title}
                          </h3>
                          <div className="text-xs text-[#756B62]">Location: {story.relatedPlace}</div>

                          <p className="text-xs text-[#756B62] leading-relaxed line-clamp-2">
                            {story.narrative}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/40 flex items-center justify-between text-xs">
                        <div className="text-[11px] text-[#756B62] truncate pr-2">
                          {matchedExp ? (
                            <span className="text-[#C9562D] font-medium font-mono text-[10px] uppercase">
                              Session Open
                            </span>
                          ) : (
                            <span className="italic truncate">{story.source || 'Oral Transmission'}</span>
                          )}
                        </div>

                        <span className="text-xs text-[#24170F] group-hover:text-[#C9562D] font-medium flex items-center gap-1 shrink-0 transition-colors">
                          <span>Read Epic</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SACRED ECOLOGY */}
          {activeTab === 'ecology' && (
            <div className="space-y-8">
              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C9562D]">Biocultural Matrix</span>
                <h2 className="font-serif text-3xl text-[#24170F]">Sacred Ecology & Hydrology</h2>
                <p className="text-xs text-[#756B62]">Sacred groves (*Nagabanas*), venerated rivers, and ancestral watershed sanctuaries.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ecology.map((eco) => {
                  const matchedExp = matchExperience(eco.name, 'heritage_walk', eco.id);
                  const cardImg = getEntityImage(eco.id, eco.name);

                  return (
                    <div 
                      key={eco.id} 
                      onClick={() => setSelectedDossier({ type: 'ecology', data: eco })}
                      className="bg-white border border-[#D8CEBE] rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-[#C9562D] transition-all cursor-pointer group"
                    >
                      <div>
                        {/* Image */}
                        <div className="relative h-44 w-full overflow-hidden bg-[#24170F]/10">
                          <img
                            src={cardImg}
                            alt={eco.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-white/95 uppercase tracking-wider font-semibold bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded">
                              {eco.id} · {eco.type}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-2.5">
                          <h3 className="font-serif text-2xl text-[#24170F] group-hover:text-[#C9562D] transition-colors leading-snug">
                            {eco.name}
                          </h3>
                          <div className="text-xs text-[#756B62]">{eco.region}</div>
                          <p className="text-xs text-[#756B62] leading-relaxed line-clamp-2">
                            {eco.significance}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/40 flex items-center justify-between text-xs">
                        <div className="text-[11px] text-[#756B62]">
                          {matchedExp ? (
                            <span className="text-[#C9562D] font-medium font-mono text-[10px] uppercase">
                              Grove Walk Open
                            </span>
                          ) : (
                            <span>Biocultural Sanctuary</span>
                          )}
                        </div>

                        <span className="text-xs text-[#24170F] group-hover:text-[#C9562D] font-medium flex items-center gap-1 shrink-0 transition-colors">
                          <span>Explore Ecology</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: VERNACULAR TERMS */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C9562D]">Linguistic Precision</span>
                <h2 className="font-serif text-3xl text-[#24170F]">Sacred Vernacular Glossary</h2>
                <p className="text-xs text-[#756B62]">Key cultural concepts in Tulu, Kundagannada, and Havyaka that cannot be understood through generic English.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {terms.map((term) => (
                  <div key={term.id} className="bg-white border border-[#D8CEBE] p-5 rounded-sm space-y-2 hover:shadow-xs transition-all">
                    <div className="flex items-center justify-between text-xs font-mono text-[#C9562D]">
                      <span>{term.id}</span>
                      <span className="bg-[#F5F0E7] px-2 py-0.5 rounded text-[#756B62]">{term.language}</span>
                    </div>
                    <h3 className="font-serif text-xl font-normal text-[#24170F]">{term.term}</h3>
                    <p className="text-xs text-[#2B211B] leading-relaxed">{term.meaning}</p>
                    {term.context && (
                      <p className="text-[11px] text-[#756B62] italic pt-1 border-t border-[#D8CEBE]/50">
                        Context: {term.context}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: KNOWLEDGE GRAPH VISUALIZER */}
          {activeTab === 'graph' && (
            <div className="space-y-6">
              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C9562D]">Network Architecture</span>
                <h2 className="font-serif text-3xl text-[#24170F]">Relational Ecosystem Graph</h2>
                <p className="text-xs text-[#756B62]">
                  {graphData.nodes.length} Cultural Entities interconnected across {graphData.edges.length} verified relational edges.
                </p>
              </div>

              <div className="bg-[#24170F] text-white p-8 rounded-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-amber-200">
                    Live Graph Topology Explorer
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-0.5 bg-red-900/60 rounded border border-red-500">Temples</span>
                    <span className="px-2 py-0.5 bg-amber-900/60 rounded border border-amber-500">Rituals</span>
                    <span className="px-2 py-0.5 bg-emerald-900/60 rounded border border-emerald-500">Groves/Ecology</span>
                    <span className="px-2 py-0.5 bg-blue-900/60 rounded border border-blue-500">Communities</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {graphData.edges.map((edge, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                        <span>EDGE #{idx + 1}</span>
                        <span className="text-amber-300 uppercase">{edge.relationship}</span>
                      </div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <span className="text-emerald-400">{edge.source}</span>
                        <ArrowRight className="w-3 h-3 text-white/50" />
                        <span className="text-amber-400">{edge.target}</span>
                      </div>
                      <div className="text-[10px] text-white/70 italic">"{edge.evidence_note}"</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* FULL-SCREEN IMMERSIVE EDITORIAL DOSSIER                                   */}
        {/* ========================================================================= */}
        {selectedDossier && (() => {
          const item = selectedDossier.data;
          const type = selectedDossier.type;
          const authority = type === 'ritual' ? getRitualAuthority(item) : null;
          const title = item.name || item.title || '';
          const epStatus = item.epistemicStatus || item.epistemic_status;
          const matchedExp = matchExperience(title, item.category || type, item.id);
          const heroImg = getEntityImage(item.id, title);

          return (
            <div className="fixed inset-0 z-50 bg-[#F5F0E7] text-[#2B211B] overflow-y-auto flex flex-col">
              {/* Sticky Top Header */}
              <header className="sticky top-0 z-30 bg-[#EFE7DA]/95 backdrop-blur-md border-b border-[#D8CEBE] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => setSelectedDossier(null)}
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#756B62] hover:text-[#24170F] transition-colors py-1"
                >
                  <ArrowLeft className="w-4 h-4 text-[#C9562D]" />
                  <span>Return to Cultural Archive</span>
                </button>

                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#756B62]">
                  <span className="text-[#C9562D] font-semibold tracking-wider uppercase">{type}</span>
                  <span>·</span>
                  <span>{item.id}</span>
                </div>

                <button
                  onClick={() => setSelectedDossier(null)}
                  className="p-1.5 rounded-full hover:bg-white/80 text-[#756B62] hover:text-[#24170F] transition-colors"
                  aria-label="Close dossier"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              {/* Dossier Content Canvas */}
              <article className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10">
                {/* Editorial Headline Section */}
                <section className="space-y-4 border-b border-[#D8CEBE] pb-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-[#C9562D] font-bold uppercase tracking-wider">
                      {item.id} {item.category ? `· ${item.category}` : ''}
                    </span>
                    {epStatus && (
                      <span className={`text-[10px] px-2.5 py-0.5 rounded border font-mono ${
                        epistemicColors[epStatus] || 'bg-stone-50 text-stone-700'
                      }`}>
                        {epStatus}
                      </span>
                    )}
                  </div>

                  <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#24170F] tracking-tight leading-[1.08]">
                    {title}
                  </h1>

                  {/* Byline and Provenance */}
                  <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#756B62]">
                    {authority && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono uppercase text-[10px] text-[#756B62]">Preserved by:</span>
                        <strong className="text-[#24170F] font-medium">{authority.author}</strong>
                        <span className="text-[#756B62]">({authority.role})</span>
                      </div>
                    )}
                    {item.prominentGurus && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono uppercase text-[10px] text-[#756B62]">Lineage Gurus:</span>
                        <strong className="text-[#24170F] font-medium">{item.prominentGurus.join(', ')}</strong>
                      </div>
                    )}
                    {item.prominentMasters && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono uppercase text-[10px] text-[#756B62]">Master Artisans:</span>
                        <strong className="text-[#24170F] font-medium">{item.prominentMasters.join(', ')}</strong>
                      </div>
                    )}
                    {item.source && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono uppercase text-[10px] text-[#756B62]">Source:</span>
                        <span className="italic">{item.source}</span>
                      </div>
                    )}
                  </div>
                </section>

                {/* Hero Photograph in Dossier */}
                <div className="relative h-72 sm:h-96 w-full rounded-sm overflow-hidden border border-[#D8CEBE] shadow-sm">
                  <img
                    src={heroImg}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Two-Column Grid: Narrative on Left, Workshop & Almanac on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
                  {/* Left Column: Deep Cultural Knowledge */}
                  <div className="lg:col-span-7 space-y-8">
                    {/* Primary Description / Lead */}
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-[#756B62]">
                        {type === 'ritual' ? 'Ceremonial Liturgy & Practice' : type === 'story' ? 'The Living Narrative' : 'Tradition & Historical Significance'}
                      </h4>
                      <p className="font-serif text-lg sm:text-xl leading-relaxed text-[#24170F] font-light">
                        {item.fullDescription || item.narrative || item.tradition || item.significance || item.shortDescription}
                      </p>
                    </div>

                    {/* Performing Arts Ensemble / Elements */}
                    {item.keyElements && (
                      <div className="space-y-3 pt-4 border-t border-[#D8CEBE]/50">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[#756B62]">
                          Key Aesthetic Elements
                        </h4>
                        <ul className="space-y-2 text-sm text-[#24170F]">
                          {item.keyElements.map((el: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#C9562D] mt-1">✦</span>
                              <span>{el}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.musicalEnsemble && (
                      <div className="space-y-2 pt-4 border-t border-[#D8CEBE]/50">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[#756B62]">
                          Traditional Ensemble Instruments
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.musicalEnsemble.map((inst: string, idx: number) => (
                            <span key={idx} className="bg-white px-3 py-1 rounded text-xs border border-[#D8CEBE] text-[#24170F]">
                              {inst}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sacred Materials */}
                    {item.objectsMaterials && item.objectsMaterials.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-[#D8CEBE]/50">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[#756B62]">
                          Sacred Liturgical Objects & Materials
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.objectsMaterials.map((obj: string, i: number) => (
                            <span key={i} className="text-xs bg-white px-3 py-1.5 rounded border border-[#D8CEBE] text-[#24170F]">
                              {obj}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.materials && item.materials.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-[#D8CEBE]/50">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[#756B62]">
                          Sculptural & Artisan Materials
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.materials.map((mat: string, i: number) => (
                            <span key={i} className="text-xs bg-white px-3 py-1.5 rounded border border-[#D8CEBE] text-[#24170F]">
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ritual Specialists */}
                    {item.ritualSpecialists && item.ritualSpecialists.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-[#D8CEBE]/50">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-[#756B62]">
                          Ritual Specialists & Lineage Roles
                        </h4>
                        <ul className="text-xs text-[#2B211B] space-y-1.5 list-disc pl-5">
                          {item.ritualSpecialists.map((spec: string, i: number) => (
                            <li key={i} className="leading-relaxed">{spec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cultural & Ecological Context */}
                    {item.culturalContext && (
                      <div className="p-5 bg-[#EFE7DA]/90 border-l-2 border-[#C9562D] rounded-sm space-y-2">
                        <h4 className="font-mono text-xs uppercase tracking-wider text-[#C9562D] font-semibold">
                          Cultural & Biocultural Context
                        </h4>
                        <p className="text-xs sm:text-sm text-[#2B211B] leading-relaxed font-light">
                          {item.culturalContext}
                        </p>
                      </div>
                    )}

                    {item.notes && (
                      <div className="p-5 bg-white rounded-sm border border-[#D8CEBE] space-y-2">
                        <h4 className="font-mono text-xs uppercase tracking-wider text-[#756B62] font-semibold">
                          Scholarly Commentary
                        </h4>
                        <p className="text-xs text-[#756B62] leading-relaxed">
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Sticky Living Apprenticeship & Almanac */}
                  <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
                    {/* Living Workshop / Masterclass Booking Card */}
                    {matchedExp && (
                      <div className="bg-[#24170F] text-[#F5F0E7] p-6 sm:p-7 rounded-sm border border-[#C9562D]/40 shadow-xl space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-amber-300 font-bold uppercase tracking-wider">
                            Living Apprenticeship
                          </span>
                          <span className="bg-white/10 px-2.5 py-0.5 rounded text-amber-200">
                            {matchedExp.durationMinutes} mins · ₹{matchedExp.price}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-serif text-2xl text-white font-normal leading-snug">
                            {matchedExp.title}
                          </h3>
                          <p className="text-xs text-stone-300 leading-relaxed mt-2 line-clamp-3">
                            {matchedExp.description || matchedExp.culturalContext}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/15 text-xs text-stone-300 space-y-1">
                          <div>
                            <span className="text-stone-400 font-mono text-[10px] uppercase block">Led By Master Custodian</span>
                            <strong className="text-white text-sm">{matchedExp.custodianId?.name || 'Verified Master'}</strong>
                          </div>
                          <div className="text-[11px] text-stone-400">
                            Location: {matchedExp.location?.city}, Coastal Karnataka
                          </div>
                        </div>

                        <Link
                          to={`/experiences/${matchedExp._id}`}
                          className="inline-flex items-center justify-center gap-2 w-full bg-[#C9562D] hover:bg-[#A34320] text-white text-xs font-medium py-3 px-4 rounded-sm transition-colors shadow-md mt-2 tracking-wider uppercase font-sans"
                        >
                          <span>Experience This Workshop</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}

                    {/* Almanac & Lineage Ledger Box */}
                    <div className="bg-white p-6 rounded-sm border border-[#D8CEBE] shadow-xs space-y-4 text-xs">
                      <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#C9562D] font-bold border-b border-[#D8CEBE]/70 pb-2">
                        Almanac & Lineage Ledger
                      </h4>

                      {(item.calendarTiming || item.seasonal_timing) && (
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[#756B62] block">Seasonal Rhythm / Calendar</span>
                          <strong className="text-[#24170F] text-xs block mt-0.5">{item.calendarTiming || item.seasonal_timing}</strong>
                        </div>
                      )}

                      {item.frequency && (
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[#756B62] block">Frequency</span>
                          <strong className="text-[#24170F] text-xs block mt-0.5">{item.frequency}</strong>
                        </div>
                      )}

                      {(item.communities || item.custodians)?.length && (
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[#756B62] block">Custodial Communities</span>
                          <strong className="text-[#24170F] text-xs block mt-0.5">{(item.communities || item.custodians)?.join(', ')}</strong>
                        </div>
                      )}

                      {item.associatedPlaces?.length && (
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[#756B62] block">Associated Sacred Places</span>
                          <strong className="text-[#24170F] text-xs block mt-0.5">{item.associatedPlaces.join(', ')}</strong>
                        </div>
                      )}

                      {item.relatedPlace && (
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[#756B62] block">Associated Sacred Place</span>
                          <strong className="text-[#24170F] text-xs block mt-0.5">{item.relatedPlace}</strong>
                        </div>
                      )}

                      {item.region && (
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[#756B62] block">Geographical Region</span>
                          <strong className="text-[#24170F] text-xs block mt-0.5">{item.region}</strong>
                        </div>
                      )}
                    </div>
                  </aside>
                </div>
              </article>
            </div>
          );
        })()}

        {/* AI Assistant Hook */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <CulturalAIAssistant />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default KnowledgePage;
