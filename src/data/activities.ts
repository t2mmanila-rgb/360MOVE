export interface Activity {
  id: string;
  title: string;
  category: string;
  points: number;
  duration: string;
  image: string;
  description: string;
  day?: string;
  time?: string;
  location?: string;
  instructor?: string;
  capacity?: string;
  pax?: number;
  isPaid?: boolean;
  zone?: 'EAT' | 'PLAY' | 'HEAL' | 'GLOW' | 'THE ARENA';
  mechanics?: string;
  extendedDescription?: string;
}

export interface PassportBrand {
  id: string;
  name: string;
  category: string;
  description: string;
  booth: string;
  qrSecret: string;
  geofenceRadius: string;
  logo: string;
  isCompleted?: boolean;
  isSignupRequired?: boolean;
  zone: 'EAT' | 'PLAY' | 'HEAL' | 'GLOW' | 'THE ARENA';
  mechanics: string;
  extendedDescription?: string;
  points: number;
}

export const MOCK_SCHEDULE: Activity[] = [
  // Saturday May 9, 2026
  {
    id: 'fs-morning-run',
    title: 'FITSTREET Morning Run',
    category: 'Cardio',
    points: 1,
    duration: '60 min',
    image: '/activities/rope_flow_premium.png',
    description: 'Kick off Fitstreet 2026 with an energizing morning run through the heart of BGC.',
    day: 'May 9, 2026 (Saturday)',
    time: '7:00 AM',
    location: 'The Arena',
    isPaid: false,
    zone: 'THE ARENA'
  },
  {
    id: 'adidas-post-run',
    title: 'Adidas post-run workout',
    category: 'Movement',
    points: 1,
    duration: '60 min',
    image: '/activities/page.png',
    description: 'A recovery workout designed by Adidas for post-run revitalization.',
    day: 'May 9, 2026 (Saturday)',
    time: '8:30 AM',
    location: '5th Ave',
    isPaid: false,
    zone: 'PLAY'
  },
  {
    id: 'hydro-rave',
    title: 'Hydro Rave',
    category: 'High Intensity',
    points: 1,
    duration: '90 min',
    image: '/activities/DLB_SoundBath.png',
    description: 'A high-energy workout experience combining water and rhythm.',
    day: 'May 9, 2026 (Saturday)',
    time: '10:00 AM',
    location: 'The Arena',
    isPaid: false,
    zone: 'THE ARENA'
  },
  {
    id: 'gballers-free',
    title: "G'ballers: 3x3 League (Adidas)",
    category: 'Sports',
    points: 10,
    duration: '5.5 hours',
    image: '/activities/rope_flow_premium.png',
    description: '3x3 Basketball League slot powered by Adidas.',
    day: 'May 9, 2026 (Saturday)',
    time: '10:00 AM – 3:30 PM',
    location: '5th Ave',
    isPaid: true,
    zone: 'PLAY'
  },
  {
    id: 'ice-bath-party',
    title: 'Grand Ice Bath Party',
    category: 'Recovery',
    points: 1,
    duration: '4 hours',
    image: '/activities/reiki.png',
    description: 'Join the ultimate recovery session with multiple ice baths and community vibes.',
    day: 'May 9, 2026 (Saturday)',
    time: '3:00 PM – 7:00 PM',
    location: '5th Ave',
    isPaid: false,
    zone: 'HEAL'
  },
  {
    id: 'plyo-justin',
    title: 'PLYO with Justin Melton',
    category: 'High Intensity',
    points: 1,
    duration: '30 min',
    image: '/activities/DLB_SoundBath.png',
    description: 'Plyometric training session with Justin Melton.',
    day: 'May 9, 2026 (Saturday)',
    time: '3:30 PM – 4:00 PM',
    location: 'The Arena',
    isPaid: false,
    zone: 'THE ARENA'
  },
  {
    id: 'saltar-fitness-first',
    title: 'SALTAR by Fitness First',
    category: 'Cardio',
    points: 1,
    duration: '60 min',
    image: '/activities/page.png',
    description: 'A high-energy cardio session by Fitness First.',
    day: 'May 9, 2026 (Saturday)',
    time: '4:00 PM – 5:00 PM',
    location: 'The Arena',
    isPaid: false,
    zone: 'THE ARENA'
  },
  {
    id: 'corporate-hour',
    title: 'CORPORATE HOUR with Will Devaughn',
    category: 'Wellness',
    points: 1,
    duration: '60 min',
    image: '/activities/holistic_nutrition.png',
    description: 'Exclusive wellness session for our corporate partners led by Will Devaughn.',
    day: 'May 9, 2026 (Saturday)',
    time: '5:00 PM – 6:00 PM',
    location: 'The Arena',
    isPaid: false,
    zone: 'PLAY'
  },
  {
    id: 'hiit-lifefitness',
    title: 'HIIT by LifeFitness',
    category: 'High Intensity',
    points: 1,
    duration: '60 min',
    image: '/activities/DLB_SoundBath.png',
    description: 'High Intensity Interval Training powered by LifeFitness.',
    day: 'May 9, 2026 (Saturday)',
    time: '5:00 PM – 6:00 PM',
    location: '5th Ave (Kerry Sports)',
    isPaid: false,
    zone: 'PLAY'
  },
  {
    id: 'viking-games-sat',
    title: 'Viking Games by Nordcham',
    category: 'Competitive',
    duration: '60 min',
    image: '/logos/Viking Games Banner - Fitstreet 2026.png',
    description: 'The ultimate strength and endurance challenge by Nordcham.',
    day: 'May 9, 2026 (Saturday)',
    time: '5:00 PM – 6:00 PM',
    location: '5th Ave',
    isPaid: true,
    zone: 'THE ARENA',
    points: 10
  },
  {
    id: 'body-combat-sat',
    title: 'Les Milles BODY COMBAT',
    category: 'Cardio',
    points: 10,
    duration: '60 min',
    image: '/activities/page.png',
    description: 'High-energy martial arts-inspired workout.',
    day: 'May 9, 2026 (Saturday)',
    time: '6:00 PM – 7:00 PM',
    location: 'The Arena',
    isPaid: false,
    zone: 'THE ARENA'
  },
  {
    id: 'pound-rockout',
    title: 'POUND Rockout.Workout',
    category: 'Cardio',
    points: 1,
    duration: '60 min',
    image: '/activities/page.png',
    description: 'Full-body workout that combines cardio, conditioning, and strength training with yoga and pilates-inspired movements.',
    day: 'May 9, 2026 (Saturday)',
    time: '7:00 PM – 8:00 PM',
    location: 'The Arena',
    isPaid: false,
    zone: 'THE ARENA'
  },
  // Sunday May 10, 2026
  {
    id: 'soulful-sound-bath',
    title: 'Soulful SOUND BATH Experience',
    category: 'Mindfulness',
    points: 1,
    duration: '60 min',
    image: '/activities/DLB_SoundBath2.png',
    description: 'Start your Sunday with a deep meditative sound journey.',
    day: 'May 10, 2026 (Sunday)',
    time: '7:00 AM – 8:00 AM',
    location: 'The Arena',
    isPaid: false,
    zone: 'HEAL'
  },
  {
    id: 'active-aging',
    title: 'ACTIVE AGING Functional Training',
    category: 'Movement',
    points: 1,
    duration: '60 min',
    image: '/activities/page.png',
    description: 'Functional training session tailored for active aging.',
    day: 'May 10, 2026 (Sunday)',
    time: '8:00 AM – 9:00 AM',
    location: 'The Arena',
    isPaid: false,
    zone: 'HEAL'
  },
  {
    id: 'yoga-co-fitness',
    title: 'YOGA Session by Co Fitness',
    category: 'Mindfulness',
    points: 1,
    duration: '60 min',
    image: '/activities/reiki.png',
    description: 'Enriching yoga session powered by Co Fitness.',
    day: 'May 10, 2026 (Sunday)',
    time: '8:00 AM – 9:00 AM',
    location: 'The Arena',
    isPaid: false,
    zone: 'HEAL'
  },
  {
    id: 'f45-functional',
    title: 'F45 Functional Resistance Workout',
    category: 'Physical',
    points: 1,
    duration: '60 min',
    image: '/activities/page.png',
    description: 'High-intensity functional resistance training.',
    day: 'May 10, 2026 (Sunday)',
    time: '9:00 AM – 10:00 AM',
    location: 'The Arena',
    isPaid: false,
    zone: 'THE ARENA'
  },
  {
    id: 'rope-flow-elite',
    title: 'ROPE FLOW Class by Elite Aerial',
    category: 'Movement',
    points: 1,
    duration: '60 min',
    image: '/activities/rope_flow_premium.png',
    description: 'Master the art of rope flow for better coordination and joint health.',
    day: 'May 10, 2026 (Sunday)',
    time: '11:00 AM – 12:00 PM',
    location: 'The Arena',
    isPaid: false,
    zone: 'PLAY'
  },
  {
    id: 'kpop-dance',
    title: 'KPOP Dance by G-Force',
    category: 'Movement',
    points: 1,
    duration: '60 min',
    image: '/activities/page.png',
    description: 'Learn the latest KPOP moves with G-Force.',
    day: 'May 10, 2026 (Sunday)',
    time: '3:00 PM – 4:00 PM',
    location: 'The Arena',
    isPaid: false,
    zone: 'PLAY'
  },
  {
    id: 'beauty-nicolash',
    title: 'BEAUTY by Nicolash',
    category: 'Wellness',
    points: 1,
    duration: '30 min',
    image: '/activities/page.png',
    description: 'Beauty and wellness session by Nicolash.',
    day: 'May 10, 2026 (Sunday)',
    time: '3:30 PM – 4:00 PM',
    location: 'The Arena',
    isPaid: false,
    zone: 'GLOW'
  }
];

export const STRATEGIC_COACHES = [
  { name: 'Coach Fai', specialties: ['Animal Flow', 'Rope Flow', 'Breathwork'], profile: '/coaches/Coach Fai_s Fitness Professional Resume OCT 2024.pdf' },
  { name: 'Quino Reyes', specialties: ['Yoga', 'Mindfulness'], profile: '/coaches/Quino Reyes Yoga CV 2024.pdf' },
  { name: 'Sonaal Nandwani', specialties: ['Sound Healing', 'Holistic Wellness'], profile: '/coaches/Sonaal Nandwani Portfolio.pdf' },
];

export const CORPORATE_ACTIVITIES: Activity[] = [
  {
    id: 'corp-health-screening',
    title: 'Health Screenings & Body Analysis',
    category: 'Prevention',
    points: 1,
    duration: 'Week 1',
    image: '/activities/holistic_nutrition.png',
    description: 'Comprehensive health screening with personalized health reports to monitor and baseline employee health.',
    location: 'On-site Office',
    zone: 'GLOW'
  },
  {
    id: 'corp-nutrition-workshop',
    title: 'Nutrition Workshop: Healthy Habits',
    category: 'Nutrition',
    points: 1,
    duration: 'Week 2',
    image: '/activities/holistic_nutrition.png',
    description: 'Workshop on healthy eating habits including personalized consultations and meal plans.',
    location: 'Conference Room',
    zone: 'EAT'
  },
  {
    id: 'corp-yoga-pass',
    title: 'Employee Yoga Pass',
    category: 'Movement',
    points: 1,
    duration: 'Week 6',
    image: '/activities/reiki.png',
    description: 'Trial sessions for various yoga classes aimed at improving flexibility and reducing office stress.',
    location: 'Wellness Room / Local Studio',
    zone: 'HEAL'
  },
  {
    id: 'corp-mindfulness',
    title: 'Introduction to Mindfulness & Breathing',
    category: 'Mind',
    points: 1,
    duration: 'Week 8',
    image: '/activities/guided_breathwork.png',
    description: 'Workshop on the basics of mindfulness, including mindful breathing and awareness exercises.',
    location: 'On-site / Virtual',
    zone: 'PLAY'
  }
];

export const B2C_PROGRAMS: Activity[] = [
  {
    id: 'prog-animal-flow',
    title: 'Animal Flow',
    category: 'Physical',
    points: 1,
    duration: '60 min',
    image: '/activities/DLB_SoundBath.png',
    description: 'A ground-based movement program designed to improve strength and coordination.',
    instructor: 'Coach Fai',
    zone: 'THE ARENA'
  },
  {
    id: 'prog-sound-bath',
    title: 'Sound Bath & Meditation',
    category: 'Mindfulness',
    points: 1,
    duration: '90 min',
    image: '/activities/DLB_SoundBath2.png',
    description: 'Immersive sound experience to reduce stress and promote deep relaxation.',
    instructor: 'Sonaal Nandwani',
    zone: 'HEAL'
  },
  {
    id: 'prog-rope-flow',
    title: 'Rope Flow Premium',
    category: 'Physical',
    points: 1,
    duration: '45 min',
    image: '/activities/rope_flow_premium.png',
    description: 'Master coordination and mobility with our premium rope flow training.',
    instructor: 'Coach Fai',
    zone: 'PLAY'
  },
  {
    id: 'prog-reiki',
    title: 'Reiki Energy Healing',
    category: 'Mindfulness',
    points: 1,
    duration: '60 min',
    image: '/activities/reiki.png',
    description: 'Energy healing session to balance your body and mind.',
    instructor: 'Quino Reyes',
    zone: 'HEAL'
  },
  {
    id: 'prog-nutrition',
    title: 'Holistic Nutrition',
    category: 'Nutrition',
    points: 1,
    duration: '12 Weeks',
    image: '/activities/holistic_nutrition.png',
    description: 'Comprehensive nutritional coaching for sustainable health.',
    zone: 'EAT'
  },
  {
    id: 'prog-ems',
    title: 'EMS Training',
    category: 'Physical',
    points: 1,
    duration: '20 min',
    image: '/activities/page.png',
    description: 'High-efficiency Electrical Muscle Stimulation training.',
    zone: 'GLOW'
  }
];

export const B2B_PASSPORT_BRANDS: PassportBrand[] = [
  {
    id: 'pb-nike',
    name: 'Nike',
    category: 'Movement',
    description: 'Experience the new Air Max lineage.',
    booth: 'B12',
    qrSecret: 'NK-2026-XP',
    geofenceRadius: '20m',
    logo: '/logos/360MOVE Square Logo.png',
    isCompleted: false,
    zone: 'THE ARENA',
    mechanics: 'Visit the Nike booth and share your personal movement goal for 2026 on social media using #NikeMovePass.',
    points: 1
  },
  {
    id: 'pb-skippy',
    name: "Skippy",
    category: 'Nutrition',
    description: '"Where There\'s a Jar, There\'s Joy." High-protein fuel for the active urbanite.',
    booth: 'B05',
    qrSecret: 'SK-2026-PB',
    geofenceRadius: '20m',
    logo: '1yZ9X_placeholder_skippy_id', 
    isCompleted: false,
    zone: 'EAT',
    mechanics: 'Visit the "Skippy Joy Station" and hold a 15-second "Peanut Butter Power-Up" pose (e.g., a "Flex for Joy") in front of the giant iconic teal jar.',
    points: 1
  },
  {
    id: 'pb-chobani',
    name: 'Chobani',
    category: 'Nutrition',
    description: '"Food Made Good." High protein, zero artificial preservatives Greek yogurt.',
    booth: 'B08',
    qrSecret: 'CH-2026-GREEK',
    geofenceRadius: '20m',
    logo: '1yZ9X_placeholder_chobani_id', 
    isCompleted: false,
    zone: 'HEAL',
    mechanics: 'Participate in a "30-Second Recovery Ritual" involving guided deep-breathing stretches while holding a Chobani cup prop.',
    points: 1
  },
  {
    id: 'pb-goodies',
    name: 'Goodies',
    category: 'Nutrition',
    description: '"Goodness in Every Bite." Clean, wholesome snacks for everyday resilience.',
    booth: 'B03',
    qrSecret: 'GD-2026-PLAY',
    geofenceRadius: '20m',
    logo: '1yZ9X_placeholder_goodies_id', 
    isCompleted: false,
    zone: 'PLAY',
    mechanics: 'Approach the "Goodies Discovery Table" and correctly identify one key natural ingredient in a featured Goodies snack bar.',
    points: 1
  },
  {
    id: 'pb-gballers',
    name: "G'Ballers",
    category: 'Sports',
    description: '3x3 League & Basketball Clinic.',
    booth: 'Court 1',
    qrSecret: 'GB-2026-33',
    geofenceRadius: '50m',
    logo: '/logos/360-logo.png',
    isCompleted: false,
    isSignupRequired: true,
    zone: 'PLAY',
    mechanics: 'Complete a shooting drill or join a 3x3 scrimmage to unlock your digital badge.',
    points: 10
  },
  {
    id: 'pb-viking',
    name: 'Viking Fitness',
    category: 'Competitive',
    description: 'The ultimate strength challenge.',
    booth: 'The Arena',
    qrSecret: 'VK-2026-VG',
    geofenceRadius: '30m',
    logo: '/logos/Viking Games Banner - Fitstreet 2026.png',
    isCompleted: false,
    isSignupRequired: true,
    zone: 'THE ARENA',
    mechanics: 'Complete the Viking Strength circuit: 20 kettlebell swings and a 30-second plank.',
    points: 10
  },
  {
    id: 'pb-adidas',
    name: 'Adidas',
    category: 'Movement',
    description: 'Impossible is Nothing.',
    booth: 'B14',
    qrSecret: 'AD-2026-XP',
    geofenceRadius: '20m',
    logo: '/logos/fitstreet-logo-high-res.png',
    isCompleted: false,
    zone: 'PLAY',
    mechanics: 'Try on a pair of the latest Adidas runners and perform a 30-second trial run on the treadmill.',
    points: 1
  }
];
