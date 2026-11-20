import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDatabase from '../config/database.js';
import User from '../models/User.js';
import Custodian from '../models/Custodian.js';
import Knowledge from '../models/Knowledge.js';
import Experience from '../models/Experience.js';
import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';
import Temple from '../models/Temple.js';
import Review from '../models/Review.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateEmbedding } from '../services/aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

export async function seedDatabase() {
  try {
    await connectDatabase();
    console.log('Seeding CultureVerse custodian-led platform database...');

    // Clear existing collections safely
    await User.deleteMany({});
    await Custodian.deleteMany({});
    await Knowledge.deleteMany({});
    await Experience.deleteMany({});
    await Booking.deleteMany({});
    await Transaction.deleteMany({});
    await Temple.deleteMany({});
    await Review.deleteMany({});

    console.log('✓ Cleared old collections');

    // 1. Create Core Users
    const adminUser = await User.create({
      name: 'CultureVerse Admin',
      email: 'admin@cultureverse.org',
      password: 'adminpassword123',
      role: 'admin'
    });

    const travellerUser = await User.create({
      name: 'Aditi Sharma',
      email: 'aditi@example.com',
      password: 'password123',
      role: 'traveller'
    });

    // Read the real custodian data
    const dataPath = path.join(__dirname, '../../DATA/custodians.json');
    const custodiansData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

    let firstCustodianId = null;
    let firstExperienceId = null;

    // Process each custodian from the JSON
    for (const [index, data] of custodiansData.entries()) {
      // Create Custodian User
      const custodianUser = await User.create({
        name: data.name,
        email: data.email || `custodian${index}@cultureverse.org`,
        password: 'password123',
        role: 'custodian'
      });

      // Provide a fallback image based on index if profileImage is empty
      const defaultImages = [
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80'
      ];
      
      const profileImage = data.profileImage || defaultImages[index % defaultImages.length];

      // Create Custodian Profile
      const newCustodian = await Custodian.create({
        userId: custodianUser._id,
        name: data.name,
        email: data.email || `custodian${index}@cultureverse.org`,
        phone: data.phone || '+91-9800000000',
        category: data.category || 'folk_performer',
        culturalAffiliation: data.culturalAffiliation || 'Independent',
        traditionPractice: data.traditionPractice || 'Cultural Custodian',
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        verifiedBy: adminUser._id,
        bio: data.bio || 'Preserving living culture.',
        experienceYears: data.experienceYears || 20,
        languages: data.languages || ['kn', 'en'],
        location: {
          type: 'Point',
          coordinates: data.location?.coordinates || [74.856, 12.9141],
          address: data.location?.address || 'Mangalore',
          city: data.location?.city || 'Mangalore',
          state: data.location?.state || 'Karnataka',
          region: data.location?.region || 'Coastal Karnataka'
        },
        profileImage: profileImage,
        totalEarnings: Math.floor(Math.random() * 40000) + 10000,
        rating: data.rating || 4.9,
        totalReviews: data.totalReviews || Math.floor(Math.random() * 50) + 10
      });

      // Link custodian to user
      custodianUser.custodianId = newCustodian._id as any;
      await custodianUser.save();

      if (index === 0) firstCustodianId = newCustodian._id;

      // Seed Experiences
      if (data.experiences && Array.isArray(data.experiences)) {
        for (const [expIndex, expData] of data.experiences.entries()) {
          let expImages = expData.images || [];
          if (!expImages.length) {
            const expTitle = expData.title || '';
            if (expTitle.includes('Yakshagana') || expTitle.includes('Abhinaya') || expTitle.includes('Makeup')) {
              expImages = ['https://www.team-bhp.com/forum/attachments/travelogues/104130d1692943581t-yakshagana-coastal-karnataka-art-form-dscn1522.jpg'];
            } else if (expTitle.includes('Percussion') || expTitle.includes('Chande') || expTitle.includes('Bhagavathike') || expTitle.includes('Talamaddale')) {
              expImages = ['https://upload.wikimedia.org/wikipedia/commons/2/28/Yakshagana_Performance_at_NINASAM_%28India_Theatre_Forum_Stuyd_Tour_May_2013%29_%288765323722%29.jpg'];
            } else if (expTitle.includes('Nagamandala') || expTitle.includes('Siri') || expTitle.includes('Serpent') || expTitle.includes('Daiva') || expTitle.includes('Groves') || expTitle.includes('Paddana')) {
              expImages = ['https://images.indianexpress.com/2023/04/Nagamandala.jpg'];
            } else if (expTitle.includes('Kambala') || expTitle.includes('Buffalo')) {
              expImages = ['https://media.assettype.com/deccanherald%2Fimport%2Fsites%2Fdh%2Ffiles%2Farticle_images%2F2020%2F02%2F22%2Fkambala-1582337250.jpg'];
            } else if (expTitle.includes('Sculpting') || expTitle.includes('Carving') || expTitle.includes('Chisel') || expTitle.includes('Stone') || expTitle.includes('Wood') || expTitle.includes('Line Art')) {
              expImages = ['https://images.prismic.io/pallavinopany/Ztrn9rzzk9ZrXGQ8_forest1.jpg'];
            } else if (expTitle.includes('Puppet') || expTitle.includes('Gombeyata')) {
              expImages = ['https://d218byoo78ov75.cloudfront.net/images/4ceded04af823a0b5082e9e4d09ff91b.jpg'];
            } else if (expTitle.includes('Architecture') || expTitle.includes('Manuscript') || expTitle.includes('Record') || expTitle.includes('History') || expTitle.includes('Vedic') || expTitle.includes('Lineage')) {
              expImages = ['https://images.deccanherald.com/deccanherald/import/sites/dh/files/gallery_images/file786qezkauky1gg36j2s7.jpg'];
            } else {
              expImages = ['https://images.deccanherald.com/deccanherald/import/sites/dh/files/gallery_images/file786qezkauky1gg36j2s7.jpg'];
            }
          }

          const newExp = await Experience.create({
            title: expData.title || 'Cultural Experience',
            description: expData.description || 'An authentic experience.',
            culturalContext: expData.culturalContext || 'Deep rooted in local traditions.',
            custodianId: newCustodian._id,
            category: expData.category || 'folk_performance',
            durationMinutes: expData.durationMinutes || 120,
            location: newCustodian.location,
            capacity: expData.capacity || 10,
            price: expData.price || 1500,
            languages: newCustodian.languages,
            availabilitySchedule: expData.availabilitySchedule || ['Saturday 10:00 AM'],
            culturalGuidelines: expData.culturalGuidelines || ['Dress modestly'],
            preparationRequirements: expData.preparationRequirements || [],
            images: expImages,
            status: 'ACTIVE',
            rating: 4.8 + (Math.random() * 0.2),
            totalReviews: Math.floor(Math.random() * 40) + 5,
            totalBookings: Math.floor(Math.random() * 50) + 10
          });

          if (index === 0 && expIndex === 0) firstExperienceId = newExp._id;
        }
      }

      // Seed Knowledge (if any in JSON)
      if (data.approvedKnowledge && Array.isArray(data.approvedKnowledge)) {
        for (const kData of data.approvedKnowledge) {
          let embedding;
          if (kData.title && kData.summary) {
            embedding = await generateEmbedding(`${kData.title} ${kData.summary}`);
          }
          await Knowledge.create({
            title: kData.title || 'Cultural Knowledge',
            summary: kData.summary || 'A brief summary of tradition.',
            content: kData.content || 'Detailed documentation of the practice.',
            language: kData.language || 'en',
            originalLanguage: kData.originalLanguage || 'kn',
            culturalCategory: kData.culturalCategory || 'folk_art',
            custodianId: newCustodian._id,
            sourceType: kData.sourceType || 'living_practice',
            sourceDetails: kData.sourceDetails || 'Oral tradition.',
            verificationStatus: 'APPROVED',
            visibility: 'PUBLIC',
            tags: kData.tags || [],
            embedding: embedding,
            location: newCustodian.location,
            approvalHistory: [
              {
                action: 'APPROVE',
                performedBy: adminUser._id,
                role: 'admin',
                timestamp: new Date(),
                notes: 'System approval'
              }
            ]
          });
        }
      }
    }

    console.log(`✓ Created ${custodiansData.length} custodian profiles and related experiences/knowledge from JSON`);

    const fallbackExp = await Experience.findOne();
    const fallbackCust = await Custodian.findOne();

    // 5. Create Realistic Bookings & Transaction Ledgers with Configurable Split
    const booking1 = await Booking.create({
      bookingNumber: 'BK-DEMO-001',
      travellerId: travellerUser._id,
      experienceId: firstExperienceId || fallbackExp?._id,
      custodianId: firstCustodianId || fallbackCust?._id,
      bookingDate: new Date(Date.now() + 86400000 * 3),
      slotTime: '04:00 PM',
      numberOfPeople: 2,
      unitPrice: 1800,
      totalAmount: 3600,
      commissionRate: 0.15,
      platformCommission: 540,
      custodianShare: 3060,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentId: 'pay_mock_seed_1',
      payoutStatus: 'PENDING',
      contactName: 'Aditi Sharma',
      contactEmail: 'aditi@example.com',
      contactPhone: '+91-9876543210',
      specialRequests: 'Looking forward to learning the chande rhythms!'
    });

    await Transaction.create({
      transactionNumber: 'TXN-TV-SEED-1',
      bookingId: booking1._id,
      custodianId: firstCustodianId || fallbackCust?._id,
      travellerId: travellerUser._id,
      type: 'PAYMENT',
      grossAmount: 3600,
      platformFee: 540,
      custodianPayout: 3060,
      currency: 'INR',
      status: 'SUCCESS',
      paymentGatewayRef: 'pay_mock_seed_1',
      provider: 'MOCK_SANDBOX_GATEWAY',
      breakdown: {
        baseFare: 3600,
        platformCommissionPercent: 15,
        platformCommissionAmount: 540,
        custodianNetAmount: 3060
      }
    });

    console.log('✓ Pilot booking and transparent revenue transaction created');

    // 6. Traditional Temples Data
    const temple1 = await Temple.create({
      id: 'mangaladevi-temple',
      name: 'Mangaladevi Temple',
      location: 'Mangalore',
      deity: 'Goddess Mangaladevi (Mother Earth / Shakti)',
      shortDescription: "The presiding 9th-century deity and namesake of Mangalore.",
      description: "Ancient temple dedicated to Goddess Mangaladevi. Revered as the spiritual heart of coastal Tulunadu, established during the Alupa dynasty.",
      image: '/temples/mangaladevi.jpg',
      region: 'Mangalore',
      openingHours: [
        { day: 'Monday', hours: '6:00 AM - 12:30 PM & 5:30 PM - 7:30 PM' },
        { day: 'Saturday', hours: '6:00 AM - 12:30 PM & 5:30 PM - 8:30 PM', isOpen: true },
        { day: 'Sunday', hours: '6:00 AM - 1:00 PM & 5:00 PM - 8:00 PM', isOpen: true }
      ],
      faqs: [
        { question: 'Is parking available?', answer: 'Yes, dedicated parking for up to 50 vehicles is available near the south entrance.' },
        { question: 'What is the dress code?', answer: 'Traditional modest attire is recommended.' }
      ]
    });

    const temple2 = await Temple.create({
      id: 'kadri-manjunatha-temple',
      name: 'Kadri Manjunatha Temple',
      location: 'Mangalore',
      deity: 'Lord Manjunatha (Shiva / Lokeshwara)',
      shortDescription: 'Historic hill temple renowned for 10th-century bronze icons and perennial sacred springs.',
      description: 'Nestled in the lush Kadri hills, this sanctuary harmonizes Buddhist Lokeshwara iconography with Shiva worship.',
      image: '/temples/kadri.png',
      region: 'Mangalore'
    });

    const temple3 = await Temple.create({
      id: 'kudroli-gokarnanatheshwara-temple',
      name: 'Kudroli Gokarnanatheshwara Temple',
      location: 'Mangalore',
      deity: 'Lord Gokarnanatheshwara',
      shortDescription: 'Social reform sanctuary consecrated by Narayana Guru, world-famous for Dasara illuminations.',
      description: 'Founded in 1912 to democratize temple entry for all social communities, celebrated annually for its magnificent 9-day Mangalore Dasara.',
      image: '/temples/kudroli.jpg',
      region: 'Mangalore'
    });

    console.log('✓ Temples created');
    console.log('\n=============================================');
    console.log('★ CultureVerse Database Seeding COMPLETED! ★');
    console.log('=============================================');
    console.log('Admin Account: admin@cultureverse.org / adminpassword123');
    console.log('Traveller Account: aditi@example.com / password123');
    console.log('Custodian Account: sanjeeva@yakshagana.org / password123');
    console.log('=============================================\n');

  } catch (error) {
    console.error('Database seeding failed:', error);
  }
}

// Auto-run if script is executed directly
if (process.argv[1]?.includes('seedDatabase')) {
  seedDatabase().then(() => process.exit(0));
}
