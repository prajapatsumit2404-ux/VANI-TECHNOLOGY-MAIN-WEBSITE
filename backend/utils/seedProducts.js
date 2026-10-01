const Product = require('../models/Product');

const defaultProducts = [
  {
    name: 'AI Talksy',
    category: 'AI',
    description: 'Autonomous Conversational AI agent for customer support, intent analysis, and multi-lingual voice & text workflows.',
    features: ['Natural Language Understanding', 'Multilingual Voice AI', '24/7 Real-Time Automation', 'API & Webhook Integrations'],
    pricing: 'SaaS Tier / Enterprise Custom',
    image: 'https://www.vanitechnologies.in/assets/dist/portfolio/Tablet-Screens-presentation-Mock-up.png',
    liveUrl: 'https://aitalksy.com/',
    featured: true,
    status: 'active',
    sortOrder: 1,
  },
  {
    name: 'Community Forum',
    category: 'Community',
    description: 'High-performance interactive discussion platform built for peer knowledge sharing, developer communities, and collaborative discussions.',
    features: ['Markdown & Code Highlights', 'Gamified Reputation & Badges', 'Real-Time Notifications', 'Fine-Grained Moderation'],
    pricing: 'Open Community / Managed Host',
    image: 'https://www.vanitechnologies.in/assets/dist/portfolio/Mockup_11.png',
    liveUrl: 'https://communityforum.tech/',
    featured: true,
    status: 'active',
    sortOrder: 2,
  },
  {
    name: 'RateHonk Travel CRM',
    category: 'CRM',
    description: 'Enterprise Travel Management CRM engineered for tour operators, booking itineraries, agent commissions, and multi-currency billing.',
    features: ['Lead & Booking Pipelines', 'Dynamic Quotation Engine', 'Supplier Inventory Sync', 'Multi-Currency Accounting'],
    pricing: 'Monthly SaaS / Custom Setup',
    image: 'https://www.vanitechnologies.in/assets/dist/portfolio/responsive_web.png',
    liveUrl: 'https://crm.ratehonk.com/portfolio',
    featured: true,
    status: 'active',
    sortOrder: 3,
  },
  {
    name: 'TeleMedicine Platform',
    category: 'Healthcare',
    description: 'Secure HIPAA-compliant telehealth suite enabling video doctor consultations, encrypted electronic medical records (EMR), and e-prescriptions.',
    features: ['HD WebRTC Teleconsultations', 'Encrypted Patient EMRs', 'Integrated Digital Prescriptions', 'Doctor Slot Scheduling'],
    pricing: 'Hospital Enterprise License',
    image: 'https://www.vanitechnologies.in/assets/dist/portfolio/3.png',
    liveUrl: '#',
    featured: true,
    status: 'active',
    sortOrder: 4,
  },
  {
    name: 'Homem Do Pao',
    category: 'E-commerce',
    description: 'Artisanal bakery and retail e-commerce platform with automated delivery scheduling, inventory matrix, and localized payment gateway integration.',
    features: ['Real-Time Order Tracking', 'Subscription Loaf Delivery', 'Inventory Threshold Alerts', 'Mobile-First Storefront'],
    pricing: 'Commercial Retail Deployment',
    image: 'https://www.vanitechnologies.in/assets/dist/portfolio/Mockup_11.png',
    liveUrl: '#',
    featured: true,
    status: 'active',
    sortOrder: 5,
  },
  {
    name: 'Meditation with Willy Cherish',
    category: 'Meditation',
    description: 'Immersive mindfulness and guided meditation platform featuring audio soundscapes, streak tracking, and daily breathwork routines.',
    features: ['Spatial Audio Soundscapes', 'Daily Habit Streaks & Stats', 'Offline Audio Playback', 'Curated Mindfulness Tracks'],
    pricing: 'Freemium / Premium Audio',
    image: 'https://www.vanitechnologies.in/assets/dist/portfolio/Tablet-Screens-presentation-Mock-up.png',
    liveUrl: '#',
    featured: true,
    status: 'active',
    sortOrder: 6,
  },
  {
    name: 'MSB School Management',
    category: 'Education',
    description: 'Complete K-12 academic administration portal managing student admissions, automated fee collections, teacher assignments, and grading report cards.',
    features: ['Parent & Student Portals', 'Automated Fee Invoicing', 'Class Timetable Scheduling', 'Exam & Gradebook Reports'],
    pricing: 'Annual Institutional Plan',
    image: 'https://www.vanitechnologies.in/assets/dist/portfolio/responsive_web.png',
    liveUrl: '#',
    featured: true,
    status: 'active',
    sortOrder: 7,
  },
  {
    name: 'Software Testing Suite',
    category: 'Services',
    description: 'Automated quality assurance, performance load benchmarking, end-to-end regression validation, and API testing framework for high-scale applications.',
    features: ['CI/CD Pipeline Integration', 'Load & Stress Benchmarking', 'Cross-Browser Automation', 'Defect Telemetry Reports'],
    pricing: 'Hourly / Retainer Model',
    image: 'https://www.vanitechnologies.in/assets/dist/portfolio/3.png',
    liveUrl: '#',
    featured: true,
    status: 'active',
    sortOrder: 8,
  },
];

async function seedProductsIfNeeded() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Seed] Seeding initial 8 portfolio products...');
      await Product.insertMany(defaultProducts);
      console.log('[Seed] 8 portfolio products seeded successfully.');
    }
  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
}

module.exports = { seedProductsIfNeeded, defaultProducts };
