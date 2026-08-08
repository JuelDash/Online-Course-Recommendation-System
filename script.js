'use strict';
const USERS_KEY = 'vs_users';
const SESSION_KEY = 'vs_session';

/* ═══════════════════════════════════════════════════════════════════
   DOMAIN → INTERESTS MAP
   All original ALL_INTERESTS topics are kept, just categorised.
═══════════════════════════════════════════════════════════════════ */
const DOMAIN_MAP = {
  Science: {
    icon: '🔬',
    interests: [
      'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Statistics',
      'Linear Algebra', 'Probability', 'Environmental Science',
      'Cognitive Science', 'Data Science', 'Data Structures & Algorithms',
    ],
  },
  Arts: {
    icon: '🎨',
    interests: [
      'History', 'Philosophy', 'Political Science', 'Law',
      'Linguistics', 'Literature', 'Creative Writing', 'Journalism',
      'Psychology', 'Communication Skills', 'Soft Skills',
      'Foreign Languages', 'Education & Teaching',
      'Graphic Design', 'UI/UX Design', 'Photography',
      'Film & Media', 'Music', 'Fine Arts', 'Architecture', 'Interior Design',
    ],
  },
  Commerce: {
    icon: '💼',
    interests: [
      'Economics', 'Finance', 'Accounting', 'Business Management',
      'Marketing', 'Entrepreneurship', 'Supply Chain',
      'Human Resources',
    ],
  },
  Medicine: {
    icon: '🏥',
    interests: [
      'Medicine & Healthcare', 'Nutrition & Public Health',
      'Biology', 'Chemistry',
    ],
  },
  Engineering: {
    icon: '⚙️',
    interests: [
      'Electrical Engineering', 'Mechanical Engineering',
      'Civil Engineering', 'Chemical Engineering',
      'Electronics', 'VLSI Design', 'Robotics', 'Control Systems',
      'Computer Networks', 'Operating Systems', 'Database Management',
      'Cloud Computing', 'Cybersecurity', 'Blockchain', 'IoT',
      'Web Development', 'Android Development', 'iOS Development',
      'Python Programming', 'Machine Learning', 'Artificial Intelligence',
      'Deep Learning',
    ],
  },
};

const DURATION_OPTIONS = [
  { label: 'Under 8 Weeks',  value: 'short',    icon: '⚡', sub: '4 – 8 weeks' },
  { label: '10 Weeks',       value: '10weeks',   icon: '📅', sub: '~10 weeks'  },
  { label: '12 Weeks',       value: '12weeks',   icon: '🗓️', sub: '~12 weeks'  },
  { label: '15+ Weeks',      value: 'long',      icon: '🎓', sub: '15 weeks+'  },
  { label: 'Any Duration',   value: 'any',       icon: '🔄', sub: 'No preference' },
];

const LEVEL_OPTIONS = [
  { label: 'Beginner',     value: 'Beginner',     icon: '🟢', sub: 'Just starting out' },
  { label: 'Intermediate', value: 'Intermediate', icon: '🟡', sub: 'Some prior knowledge' },
  { label: 'Advanced',     value: 'Advanced',     icon: '🔴', sub: 'Deep expertise' },
  { label: 'Any Level',    value: 'any',          icon: '🌐', sub: 'No preference' },
];

/* Wizard state */
let fwCurrentStep = 1;
let fwSelectedDomain = null;
let selectedInterests = [];
let fwSelectedDuration = null;
let fwSelectedLevel = null;

/* ═══════════════════════════════════════════════════════════════════
   COURSE DATABASE  (unchanged from original)
═══════════════════════════════════════════════════════════════════ */
const COURSE_DB = {
  'Data Science': [
    { title: 'Data Science Specialization', platform: 'Coursera', provider: 'Johns Hopkins University', level: 'Beginner', duration: '11 months', url: 'https://www.coursera.org/specializations/jhu-data-science', desc: 'Learn data science tools, R programming, statistical inference and machine learning.' },
    { title: 'Introduction to Data Science', platform: 'NPTEL', provider: 'IIT Madras', level: 'Beginner', duration: '8 weeks', url: 'https://nptel.ac.in/courses/106106116', desc: 'Foundations of data science including data wrangling, visualisation and modelling.' },
    { title: 'Data Science MicroMasters', platform: 'edX', provider: 'UC San Diego', level: 'Intermediate', duration: '10 months', url: 'https://www.edx.org/micromasters/uc-san-diegox-data-science', desc: 'Graduate-level data science covering probability, statistics and ML.' },
    { title: 'Data Science for Beginners', platform: 'SWAYAM', provider: 'AICTE', level: 'Beginner', duration: '4 weeks', url: 'https://swayam.gov.in', desc: 'Entry-level course on data cleaning, exploration and basic visualisation.' },
    { title: '18.650 Statistics for Applications', platform: 'MIT OCW', provider: 'MIT', level: 'Advanced', duration: 'Self-paced', url: 'https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/', desc: 'Rigorous treatment of statistics for data science applications.' },
  ],
  'Machine Learning': [
    { title: 'Machine Learning Specialization', platform: 'Coursera', provider: 'Stanford / DeepLearning.AI', level: 'Beginner', duration: '3 months', url: 'https://www.coursera.org/specializations/machine-learning-introduction', desc: 'Andrew Ng\'s flagship ML course covering supervised, unsupervised and RL.' },
    { title: 'Machine Learning', platform: 'NPTEL', provider: 'IIT Kharagpur', level: 'Intermediate', duration: '12 weeks', url: 'https://nptel.ac.in/courses/106105152', desc: 'Comprehensive ML course from one of India\'s premier institutions.' },
    { title: 'Machine Learning with Python', platform: 'edX', provider: 'IBM', level: 'Beginner', duration: '5 weeks', url: 'https://www.edx.org/course/machine-learning-with-python-a-practical-introduction', desc: 'Hands-on ML with Python using real datasets and scikit-learn.' },
    { title: '6.867 Machine Learning', platform: 'MIT OCW', provider: 'MIT', level: 'Advanced', duration: 'Self-paced', url: 'https://ocw.mit.edu/courses/6-867-machine-learning-fall-2006/', desc: 'Graduate-level treatment of ML algorithms and theory.' },
    { title: 'Machine Learning Foundations', platform: 'SWAYAM', provider: 'IIT Madras', level: 'Intermediate', duration: '8 weeks', url: 'https://swayam.gov.in', desc: 'Mathematical and algorithmic foundations of machine learning.' },
  ],
  'Artificial Intelligence': [
    { title: 'AI for Everyone', platform: 'Coursera', provider: 'DeepLearning.AI', level: 'Beginner', duration: '6 hours', url: 'https://www.coursera.org/learn/ai-for-everyone', desc: 'Non-technical introduction to AI strategy and applications.' },
    { title: 'Artificial Intelligence', platform: 'NPTEL', provider: 'IIT Madras', level: 'Intermediate', duration: '12 weeks', url: 'https://nptel.ac.in/courses/106106126', desc: 'Search, knowledge representation, planning and learning in AI.' },
    { title: 'CS50\'s Introduction to AI', platform: 'edX', provider: 'Harvard', level: 'Beginner', duration: '7 weeks', url: 'https://www.edx.org/course/cs50s-introduction-to-artificial-intelligence-with-python', desc: 'Techniques and algorithms at the foundation of modern AI.' },
    { title: '6.034 Artificial Intelligence', platform: 'MIT OCW', provider: 'MIT', level: 'Advanced', duration: 'Self-paced', url: 'https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/', desc: 'MIT\'s flagship AI course covering knowledge, reasoning and learning.' },
  ],
  'Python Programming': [
    { title: 'Python for Everybody', platform: 'Coursera', provider: 'University of Michigan', level: 'Beginner', duration: '8 months', url: 'https://www.coursera.org/specializations/python', desc: 'Learn to program and analyze data with Python from scratch.' },
    { title: 'Programming, Data Structures and Algorithms Using Python', platform: 'NPTEL', provider: 'IIT Madras', level: 'Beginner', duration: '8 weeks', url: 'https://nptel.ac.in/courses/106106145', desc: 'Introduction to programming with Python, including data structures.' },
    { title: 'Python Basics for Data Science', platform: 'edX', provider: 'IBM', level: 'Beginner', duration: '5 weeks', url: 'https://www.edx.org/course/python-basics-for-data-science', desc: 'Core Python skills needed for data science workflows.' },
    { title: 'Python Programming', platform: 'SWAYAM', provider: 'AICTE', level: 'Beginner', duration: '4 weeks', url: 'https://swayam.gov.in', desc: 'Practical Python programming for beginners.' },
  ],
  'Web Development': [
    { title: 'Full-Stack Web Development', platform: 'Coursera', provider: 'The Hong Kong University', level: 'Intermediate', duration: '6 months', url: 'https://www.coursera.org/specializations/full-stack-react', desc: 'Build complete web applications with React and Node.js.' },
    { title: 'Web Technologies', platform: 'NPTEL', provider: 'IIT Bombay', level: 'Beginner', duration: '8 weeks', url: 'https://nptel.ac.in/courses/106101171', desc: 'HTML, CSS, JavaScript and server-side web development fundamentals.' },
    { title: 'CS50\'s Web Programming', platform: 'edX', provider: 'Harvard', level: 'Intermediate', duration: '12 weeks', url: 'https://www.edx.org/course/cs50s-web-programming-with-python-and-javascript', desc: 'Design and implementation of web apps with Python, JS and SQL.' },
    { title: 'Introduction to HTML5', platform: 'Coursera', provider: 'University of Michigan', level: 'Beginner', duration: '4 weeks', url: 'https://www.coursera.org/learn/html', desc: 'Core HTML5 skills for structuring web content.' },
  ],
  'Deep Learning': [
    { title: 'Deep Learning Specialization', platform: 'Coursera', provider: 'DeepLearning.AI', level: 'Intermediate', duration: '5 months', url: 'https://www.coursera.org/specializations/deep-learning', desc: 'Neural networks, CNNs, RNNs and transformer models with TensorFlow.' },
    { title: 'Deep Learning', platform: 'NPTEL', provider: 'IIT Ropar', level: 'Advanced', duration: '12 weeks', url: 'https://nptel.ac.in/courses/106106184', desc: 'Theoretical and practical deep learning covering modern architectures.' },
    { title: 'Deep Learning with Python and PyTorch', platform: 'edX', provider: 'IBM', level: 'Intermediate', duration: '8 weeks', url: 'https://www.edx.org/course/deep-learning-with-python-and-pytorch', desc: 'Hands-on deep learning using PyTorch for real-world tasks.' },
  ],
  'Cloud Computing': [
    { title: 'Cloud Computing Specialization', platform: 'Coursera', provider: 'University of Illinois', level: 'Intermediate', duration: '6 months', url: 'https://www.coursera.org/specializations/cloud-computing', desc: 'Distributed systems, clouds, and applications at scale.' },
    { title: 'Cloud Computing', platform: 'NPTEL', provider: 'IIT Kharagpur', level: 'Intermediate', duration: '12 weeks', url: 'https://nptel.ac.in/courses/106105167', desc: 'IaaS, PaaS, SaaS, virtualisation and cloud security.' },
    { title: 'AWS Cloud Technical Essentials', platform: 'edX', provider: 'AWS', level: 'Beginner', duration: '4 weeks', url: 'https://www.edx.org/course/aws-cloud-technical-essentials', desc: 'Core AWS services and architecture for cloud practitioners.' },
  ],
  'Cybersecurity': [
    { title: 'IBM Cybersecurity Analyst', platform: 'Coursera', provider: 'IBM', level: 'Beginner', duration: '8 months', url: 'https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst', desc: 'Threat intelligence, network security and incident response.' },
    { title: 'Cybersecurity', platform: 'NPTEL', provider: 'IIT Kanpur', level: 'Intermediate', duration: '8 weeks', url: 'https://nptel.ac.in/courses/106104233', desc: 'Fundamentals of information and network security.' },
    { title: 'Cybersecurity Fundamentals', platform: 'edX', provider: 'IBM', level: 'Beginner', duration: '6 weeks', url: 'https://www.edx.org/course/cybersecurity-fundamentals', desc: 'Introductory course covering key cybersecurity principles and tools.' },
  ],
  'Mathematics': [
    { title: 'Mathematics for Machine Learning', platform: 'Coursera', provider: 'Imperial College London', level: 'Intermediate', duration: '4 months', url: 'https://www.coursera.org/specializations/mathematics-machine-learning', desc: 'Linear algebra, multivariate calculus and PCA for ML.' },
    { title: 'Mathematics I', platform: 'NPTEL', provider: 'IIT Bombay', level: 'Beginner', duration: '12 weeks', url: 'https://nptel.ac.in/courses/111101002', desc: 'Single-variable calculus, sequences, series and vector functions.' },
    { title: '18.01 Single Variable Calculus', platform: 'MIT OCW', provider: 'MIT', level: 'Beginner', duration: 'Self-paced', url: 'https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/', desc: 'Differentiation, integration and their applications.' },
    { title: 'Algebra and Differential Equations', platform: 'SWAYAM', provider: 'IIT Bombay', level: 'Beginner', duration: '8 weeks', url: 'https://swayam.gov.in', desc: 'Algebra, matrices and differential equations for engineers.' },
  ],
  'Statistics': [
    { title: 'Statistics with Python', platform: 'Coursera', provider: 'University of Michigan', level: 'Beginner', duration: '3 months', url: 'https://www.coursera.org/specializations/statistics-with-python', desc: 'Visualisation, inference and modelling using Python.' },
    { title: 'Statistical Inference', platform: 'NPTEL', provider: 'IIT Kharagpur', level: 'Intermediate', duration: '8 weeks', url: 'https://nptel.ac.in/courses/111105090', desc: 'Parameter estimation, hypothesis testing and regression analysis.' },
    { title: 'Statistics and Data Science MicroMasters', platform: 'edX', provider: 'MIT', level: 'Intermediate', duration: '1 year', url: 'https://www.edx.org/micromasters/mitx-statistics-and-data-science', desc: 'Probability, inference, regression and ML from MIT.' },
  ],
  'Economics': [
    { title: 'The Economics of Money and Banking', platform: 'Coursera', provider: 'Columbia University', level: 'Intermediate', duration: '12 weeks', url: 'https://www.coursera.org/learn/money-banking', desc: 'Financial system, banking and monetary policy.' },
    { title: 'Indian Economy', platform: 'SWAYAM', provider: 'IGNOU', level: 'Beginner', duration: '12 weeks', url: 'https://swayam.gov.in', desc: 'Structure, policies and challenges of the Indian economy.' },
    { title: '14.01 Principles of Microeconomics', platform: 'MIT OCW', provider: 'MIT', level: 'Beginner', duration: 'Self-paced', url: 'https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2018/', desc: 'Supply and demand, market equilibrium and consumer theory.' },
  ],
  'Finance': [
    { title: 'Financial Markets', platform: 'Coursera', provider: 'Yale University', level: 'Beginner', duration: '7 weeks', url: 'https://www.coursera.org/learn/financial-markets-global', desc: 'Robert Shiller\'s overview of risk, finance, and stock markets.' },
    { title: 'Financial Management', platform: 'NPTEL', provider: 'IIT Roorkee', level: 'Intermediate', duration: '8 weeks', url: 'https://nptel.ac.in/courses/110107125', desc: 'Financial statements, cost of capital and capital budgeting.' },
    { title: 'Corporate Finance', platform: 'edX', provider: 'Columbia University', level: 'Intermediate', duration: '8 weeks', url: 'https://www.edx.org/course/corporate-finance', desc: 'Valuation, capital structure and dividend policy.' },
  ],
  'Law': [
    { title: 'An Introduction to American Law', platform: 'Coursera', provider: 'University of Pennsylvania', level: 'Beginner', duration: '6 weeks', url: 'https://www.coursera.org/learn/american-law', desc: 'Overview of torts, contracts, property, criminal and constitutional law.' },
    { title: 'Intellectual Property Rights', platform: 'SWAYAM', provider: 'IGNOU', level: 'Beginner', duration: '4 weeks', url: 'https://swayam.gov.in', desc: 'Patents, trademarks, copyrights and trade secrets in India.' },
    { title: 'International Law', platform: 'NPTEL', provider: 'IIT Kharagpur', level: 'Intermediate', duration: '8 weeks', url: 'https://nptel.ac.in/courses/109105107', desc: 'Sources of international law, treaties and dispute resolution.' },
  ],
  'Physics': [
    { title: '8.01 Classical Mechanics', platform: 'MIT OCW', provider: 'MIT', level: 'Beginner', duration: 'Self-paced', url: 'https://ocw.mit.edu/courses/8-01l-physics-i-classical-mechanics-fall-2005/', desc: 'Newton\'s laws, momentum, energy and rotational dynamics.' },
    { title: 'Physics I', platform: 'NPTEL', provider: 'IIT Bombay', level: 'Beginner', duration: '12 weeks', url: 'https://nptel.ac.in/courses/115101111', desc: 'Mechanics, oscillations, waves and thermodynamics.' },
    { title: 'Quantum Mechanics', platform: 'edX', provider: 'MIT', level: 'Advanced', duration: '15 weeks', url: 'https://www.edx.org/course/quantum-mechanics', desc: 'Schrödinger equation, operators and quantum systems.' },
  ],
  'Electrical Engineering': [
    { title: 'Circuits and Electronics', platform: 'edX', provider: 'MIT', level: 'Intermediate', duration: '15 weeks', url: 'https://www.edx.org/course/circuits-electronics-1-basic-circuit-analysis', desc: 'KVL, KCL, node analysis and first-order circuits.' },
    { title: 'Basic Electronics', platform: 'NPTEL', provider: 'IIT Kharagpur', level: 'Beginner', duration: '12 weeks', url: 'https://nptel.ac.in/courses/108105065', desc: 'Semiconductor devices, amplifiers and digital circuits.' },
    { title: 'Power Systems Engineering', platform: 'SWAYAM', provider: 'IIT Bombay', level: 'Intermediate', duration: '12 weeks', url: 'https://swayam.gov.in', desc: 'Power generation, transmission, distribution and protection.' },
  ],
  'Mechanical Engineering': [
    { title: 'Mechanics of Materials', platform: 'edX', provider: 'MIT', level: 'Intermediate', duration: '10 weeks', url: 'https://www.edx.org/course/mechanics-of-materials-i-fundamentals-of-stress-and-strain-and-axial-loading', desc: 'Stress, strain and deformation in structural members.' },
    { title: 'Engineering Thermodynamics', platform: 'NPTEL', provider: 'IIT Bombay', level: 'Intermediate', duration: '12 weeks', url: 'https://nptel.ac.in/courses/112101097', desc: 'Laws of thermodynamics, cycles and heat transfer.' },
    { title: 'Manufacturing Processes', platform: 'SWAYAM', provider: 'IIT Bombay', level: 'Beginner', duration: '8 weeks', url: 'https://swayam.gov.in', desc: 'Casting, machining, welding and additive manufacturing.' },
  ],
  'Medicine & Healthcare': [
    { title: 'Healthcare Innovation and Entrepreneurship', platform: 'Coursera', provider: 'Duke University', level: 'Beginner', duration: '5 weeks', url: 'https://www.coursera.org/learn/healthcare-innovation', desc: 'Identify and commercialise healthcare innovations.' },
    { title: 'Anatomy', platform: 'SWAYAM', provider: 'IGNOU', level: 'Beginner', duration: '16 weeks', url: 'https://swayam.gov.in', desc: 'Systematic study of the human body structure and function.' },
    { title: 'Global Health and Humanitarianism', platform: 'edX', provider: 'University of Manchester', level: 'Beginner', duration: '6 weeks', url: 'https://www.edx.org/course/global-health-and-humanitarianism', desc: 'Global health systems, humanitarian aid and policy.' },
  ],
  'Psychology': [
    { title: 'Introduction to Psychology', platform: 'Coursera', provider: 'Yale University', level: 'Beginner', duration: '6 weeks', url: 'https://www.coursera.org/learn/introduction-psychology', desc: 'Perception, communication, learning, memory and development.' },
    { title: 'Psychological First Aid', platform: 'Coursera', provider: 'Johns Hopkins', level: 'Beginner', duration: '6 hours', url: 'https://www.coursera.org/learn/psychological-first-aid', desc: 'Skills for helping people experiencing crisis situations.' },
    { title: '9.00 Introduction to Psychology', platform: 'MIT OCW', provider: 'MIT', level: 'Beginner', duration: 'Self-paced', url: 'https://ocw.mit.edu/courses/9-00sc-introduction-to-psychology-fall-2011/', desc: 'Scientific study of human thought, behaviour and experience.' },
  ],
  'Business Management': [
    { title: 'Business Foundations', platform: 'Coursera', provider: 'Wharton School', level: 'Beginner', duration: '5 months', url: 'https://www.coursera.org/specializations/wharton-business-foundations', desc: 'Marketing, accounting, operations and corporate finance.' },
    { title: 'Management Principles', platform: 'SWAYAM', provider: 'IIM Bangalore', level: 'Beginner', duration: '8 weeks', url: 'https://swayam.gov.in', desc: 'Planning, organising, leading and controlling in organisations.' },
    { title: 'Principles of Management', platform: 'NPTEL', provider: 'IIT Madras', level: 'Beginner', duration: '8 weeks', url: 'https://nptel.ac.in/courses/110106057', desc: 'Core management concepts for students and professionals.' },
  ],
  'Marketing': [
    { title: 'Marketing Analytics', platform: 'Coursera', provider: 'University of Virginia', level: 'Intermediate', duration: '5 weeks', url: 'https://www.coursera.org/learn/uva-darden-market-analytics', desc: 'Statistical techniques to measure and optimise marketing.' },
    { title: 'Digital Marketing', platform: 'SWAYAM', provider: 'IIM Ahmedabad', level: 'Beginner', duration: '8 weeks', url: 'https://swayam.gov.in', desc: 'SEO, social media, content marketing and analytics.' },
    { title: 'Marketing Management', platform: 'NPTEL', provider: 'IIT Kharagpur', level: 'Intermediate', duration: '8 weeks', url: 'https://nptel.ac.in/courses/110105038', desc: 'Consumer behaviour, segmentation, pricing and promotion.' },
  ],
  'Graphic Design': [
    { title: 'Graphic Design Specialization', platform: 'Coursera', provider: 'CalArts', level: 'Beginner', duration: '5 months', url: 'https://www.coursera.org/specializations/graphic-design', desc: 'Fundamentals of visual design, typography and branding.' },
    { title: 'UI/UX Design', platform: 'edX', provider: 'Michigan', level: 'Beginner', duration: '4 months', url: 'https://www.edx.org/course/user-experience-ux-design-and-research', desc: 'User research, prototyping and usability testing.' },
  ],
  'Android Development': [
    { title: 'Android Development with Kotlin', platform: 'Coursera', provider: 'Meta', level: 'Beginner', duration: '5 months', url: 'https://www.coursera.org/professional-certificates/meta-android-developer', desc: 'Build Android apps with Kotlin, Jetpack Compose and REST APIs.' },
    { title: 'Android App Development', platform: 'NPTEL', provider: 'IIT Bombay', level: 'Intermediate', duration: '8 weeks', url: 'https://nptel.ac.in/courses/106101074', desc: 'Java-based Android development with activities, intents and databases.' },
  ],
  'Computer Networks': [
    { title: 'Computer Networking', platform: 'Coursera', provider: 'Google', level: 'Beginner', duration: '6 weeks', url: 'https://www.coursera.org/learn/computer-networking', desc: 'TCP/IP, DNS, HTTP and network troubleshooting.' },
    { title: 'Computer Networks', platform: 'NPTEL', provider: 'IIT Kharagpur', level: 'Intermediate', duration: '12 weeks', url: 'https://nptel.ac.in/courses/106105081', desc: 'OSI model, routing, congestion control and network security.' },
  ],
  'Entrepreneurship': [
    { title: 'Entrepreneurship Specialization', platform: 'Coursera', provider: 'Wharton School', level: 'Beginner', duration: '5 months', url: 'https://www.coursera.org/specializations/wharton-entrepreneurship', desc: 'Opportunity recognition, launch and growth strategies.' },
    { title: 'Startup School', platform: 'SWAYAM', provider: 'IIM Bangalore', level: 'Beginner', duration: '6 weeks', url: 'https://swayam.gov.in', desc: 'Business model canvas, pitching and early-stage funding.' },
  ],
  'History': [
    { title: 'Modern World History', platform: 'Coursera', provider: 'University of Virginia', level: 'Beginner', duration: '6 weeks', url: 'https://www.coursera.org/learn/modern-world', desc: 'Revolutions, industrialisation and the making of the modern world.' },
    { title: 'History of India', platform: 'SWAYAM', provider: 'IGNOU', level: 'Beginner', duration: '12 weeks', url: 'https://swayam.gov.in', desc: 'Ancient, medieval and modern Indian history.' },
    { title: '21H.001 How to Stage a Revolution', platform: 'MIT OCW', provider: 'MIT', level: 'Intermediate', duration: 'Self-paced', url: 'https://ocw.mit.edu/courses/21h-001-how-to-stage-a-revolution-fall-2013/', desc: 'Comparative revolutions from France to the Arab Spring.' },
  ],
  'Communication Skills': [
    { title: 'Effective Communication', platform: 'Coursera', provider: 'University of Colorado', level: 'Beginner', duration: '4 weeks', url: 'https://www.coursera.org/learn/business-english-work', desc: 'Professional writing, presentation and interpersonal communication skills.' },
    { title: 'Communication Skills', platform: 'SWAYAM', provider: 'AICTE', level: 'Beginner', duration: '4 weeks', url: 'https://swayam.gov.in', desc: 'English communication and professional soft skills for students.' },
  ],
  'Soft Skills': [
    { title: 'Effective Communication', platform: 'Coursera', provider: 'University of Colorado', level: 'Beginner', duration: '4 weeks', url: 'https://www.coursera.org/learn/business-english-work', desc: 'Professional writing, presentation and interpersonal communication skills.' },
    { title: 'Soft Skills Development', platform: 'SWAYAM', provider: 'AICTE', level: 'Beginner', duration: '4 weeks', url: 'https://swayam.gov.in', desc: 'Time management, teamwork and leadership skills for career readiness.' },
  ],
  'Nutrition & Public Health': [
    { title: 'Nutrition and Health', platform: 'edX', provider: 'Wageningen University', level: 'Beginner', duration: '6 weeks', url: 'https://www.edx.org/course/nutrition-and-health-part-1-macronutrients-and-overnutrition', desc: 'Macronutrients, diet and public health outcomes.' },
    { title: 'Public Health Fundamentals', platform: 'Coursera', provider: 'Johns Hopkins', level: 'Beginner', duration: '5 weeks', url: 'https://www.coursera.org/learn/public-health', desc: 'Core concepts in epidemiology, health policy and community health.' },
  ],
};

function getCourses(interest) {
  if (COURSE_DB[interest]) return COURSE_DB[interest];
  return [
    { title: `Introduction to ${interest}`, platform: 'Coursera', provider: 'Top University', level: 'Beginner', duration: '4-6 weeks', url: 'https://www.coursera.org/search?query=' + encodeURIComponent(interest), desc: `A beginner-friendly introduction to ${interest} covering core concepts and practical applications.` },
    { title: `${interest} Fundamentals`, platform: 'NPTEL', provider: 'IIT', level: 'Beginner', duration: '8 weeks', url: 'https://nptel.ac.in', desc: `Fundamental concepts in ${interest} presented by IIT faculty.` },
    { title: `${interest} — Intermediate Course`, platform: 'edX', provider: 'Leading University', level: 'Intermediate', duration: '6-8 weeks', url: 'https://www.edx.org/search?q=' + encodeURIComponent(interest), desc: `Deepen your understanding of ${interest} with hands-on projects.` },
    { title: `${interest} Essentials`, platform: 'SWAYAM', provider: 'AICTE', level: 'Beginner', duration: '4 weeks', url: 'https://swayam.gov.in', desc: `Core essentials of ${interest} for Indian students, AICTE approved.` },
  ];
}

const PLAT_CLASS = { NPTEL: 'bn', SWAYAM: 'bs', Coursera: 'bc', edX: 'be', 'MIT OCW': 'bm', Default: 'bd' };
const LEVEL_EMOJI = { Beginner: '🟢', Intermediate: '🟡', Advanced: '🔴' };

/* ═══════════════════════════════════════════════════════════════════
   USER / SESSION HELPERS  (unchanged)
═══════════════════════════════════════════════════════════════════ */
function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getSession() { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
function saveSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const target = document.getElementById('page-' + id);
  if (target) { target.style.display = 'flex'; target.classList.add('active'); }
  window.scrollTo(0, 0);
}

function updateNav() {
  const session = getSession();
  const loggedOut = document.querySelectorAll('.nav-logged-out');
  const loggedIn = document.querySelectorAll('.nav-logged-in');
  if (session) {
    loggedOut.forEach(el => el.style.display = 'none');
    loggedIn.forEach(el => el.style.display = 'flex');
    const avatar = document.getElementById('navAvatar');
    const uname = document.getElementById('navUname');
    const navUser = document.getElementById('navUser');
    if (navUser) navUser.style.display = 'flex';
    if (avatar) avatar.textContent = session.name.charAt(0).toUpperCase();
    if (uname) uname.textContent = session.name.split(' ')[0];
  } else {
    loggedOut.forEach(el => el.style.display = '');
    loggedIn.forEach(el => el.style.display = 'none');
    const navUser = document.getElementById('navUser');
    if (navUser) navUser.style.display = 'none';
  }
}

function goLogin(role) {
  if (role === 'student') {
    clearForm(['sl-email', 'sl-pw']);
    clearMsg('sl-err', 'sl-success');
    showPage('student-login');
  } else {
    clearForm(['ol-email', 'ol-pw']);
    clearMsg('ol-err', 'ol-success');
    showPage('org-login');
  }
}
function goRegister(role) {
  if (role === 'student') {
    clearForm(['sr-name', 'sr-email', 'sr-pw']);
    clearMsg('sr-err', 'sr-success');
    showPage('student-register');
  } else {
    clearForm(['or-name', 'or-email', 'or-pw']);
    clearMsg('or-err', 'or-success');
    showPage('org-register');
  }
}

function submitStudentRegister() {
  const name = document.getElementById('sr-name').value.trim();
  const email = document.getElementById('sr-email').value.trim().toLowerCase();
  const pw = document.getElementById('sr-pw').value;
  clearMsg('sr-err', 'sr-success');
  if (!name || !email || !pw) { showMsg('sr-err', 'Please fill in all fields.'); return; }
  if (!isValidEmail(email)) { showMsg('sr-err', 'Please enter a valid email address.'); return; }
  if (pw.length < 6) { showMsg('sr-err', 'Password must be at least 6 characters.'); return; }
  const users = getUsers();
  if (users[email]) {
    showMsg('sr-err', 'An account with this email already exists. Please login instead.');
    setTimeout(() => { clearMsg('sr-err', 'sr-success'); clearForm(['sr-name', 'sr-email', 'sr-pw']); showPage('student-login'); }, 2500);
    return;
  }
  users[email] = { name, email, pw: btoa(pw), type: 'student', interests: [], createdAt: Date.now() };
  saveUsers(users);
  clearForm(['sr-name', 'sr-email', 'sr-pw']);
  showMsg('sr-success', 'Account created successfully! Redirecting to login…');
  setTimeout(() => { clearMsg('sr-err', 'sr-success'); showPage('student-login'); }, 2000);
}

function submitStudentLogin() {
  const email = document.getElementById('sl-email').value.trim().toLowerCase();
  const pw = document.getElementById('sl-pw').value;
  clearMsg('sl-err', 'sl-success');
  if (!email || !pw) { showMsg('sl-err', 'Please fill in all fields.'); return; }
  if (!isValidEmail(email)) { showMsg('sl-err', 'Please enter a valid email address.'); return; }
  const users = getUsers();
  if (!users[email]) {
    showMsg('sl-err', 'No account found with this email. Please register first.');
    setTimeout(() => { clearMsg('sl-err', 'sl-success'); clearForm(['sl-email', 'sl-pw']); showPage('student-register'); }, 2500);
    return;
  }
  if (users[email].pw !== btoa(pw)) { showMsg('sl-err', 'Incorrect password. Please try again.'); return; }
  const session = { name: users[email].name, email, type: users[email].type };
  saveSession(session);
  clearForm(['sl-email', 'sl-pw']);
  onLoginSuccess(session);
}

function submitOrgRegister() {
  const name = document.getElementById('or-name').value.trim();
  const email = document.getElementById('or-email').value.trim().toLowerCase();
  const pw = document.getElementById('or-pw').value;
  clearMsg('or-err', 'or-success');
  if (!name || !email || !pw) { showMsg('or-err', 'Please fill in all fields.'); return; }
  if (!isValidEmail(email)) { showMsg('or-err', 'Please enter a valid email address.'); return; }
  if (pw.length < 6) { showMsg('or-err', 'Password must be at least 6 characters.'); return; }
  const users = getUsers();
  if (users[email]) {
    showMsg('or-err', 'An account with this email already exists. Please login instead.');
    setTimeout(() => { clearMsg('or-err', 'or-success'); clearForm(['or-name', 'or-email', 'or-pw']); showPage('org-login'); }, 2500);
    return;
  }
  users[email] = { name, email, pw: btoa(pw), type: 'organization', interests: [], createdAt: Date.now() };
  saveUsers(users);
  clearForm(['or-name', 'or-email', 'or-pw']);
  showMsg('or-success', 'Organization registered successfully! Redirecting to login…');
  setTimeout(() => { clearMsg('or-err', 'or-success'); showPage('org-login'); }, 2000);
}

function submitOrgLogin() {
  const email = document.getElementById('ol-email').value.trim().toLowerCase();
  const pw = document.getElementById('ol-pw').value;
  clearMsg('ol-err', 'ol-success');
  if (!email || !pw) { showMsg('ol-err', 'Please fill in all fields.'); return; }
  if (!isValidEmail(email)) { showMsg('ol-err', 'Please enter a valid email address.'); return; }
  const users = getUsers();
  if (!users[email]) {
    showMsg('ol-err', 'No account found with this email. Please register your organization first.');
    setTimeout(() => { clearMsg('ol-err', 'ol-success'); clearForm(['ol-email', 'ol-pw']); showPage('org-register'); }, 2500);
    return;
  }
  if (users[email].pw !== btoa(pw)) { showMsg('ol-err', 'Incorrect password. Please try again.'); return; }
  const session = { name: users[email].name, email, type: users[email].type };
  saveSession(session);
  clearForm(['ol-email', 'ol-pw']);
  onLoginSuccess(session);
}

function showMsg(errId, msg) {
  const el = document.getElementById(errId);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function clearMsg(errId, sucId) {
  [errId, sucId].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  });
}
function clearForm(ids) {
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function onLoginSuccess(session) {
  updateNav();
  const users = getUsers();
  const userInterests = (users[session.email] && users[session.email].interests) || [];
  loadInterestsPage(session.name, userInterests);
  showPage('interests');
}

function signOut() {
  clearSession();
  updateNav();
  clearForm(['sl-email', 'sl-pw', 'sr-name', 'sr-email', 'sr-pw', 'ol-email', 'ol-pw', 'or-name', 'or-email', 'or-pw']);
  selectedInterests = [];
  fwSelectedDomain = null;
  fwSelectedDuration = null;
  fwSelectedLevel = null;
  const grid = document.getElementById('courseGrid');
  if (grid) grid.innerHTML = '';
  const itagRow = document.getElementById('itagRow');
  if (itagRow) itagRow.innerHTML = '';
  const kpiRow = document.getElementById('kpiRow');
  if (kpiRow) kpiRow.innerHTML = '';
  document.querySelectorAll('.chat-input').forEach(inp => inp.value = '');
  showPage('welcome');
}

/* ═══════════════════════════════════════════════════════════════════
   FILTER WIZARD
═══════════════════════════════════════════════════════════════════ */
function fwGoto(step) {
  // Validate before advancing
  if (step === 3 && selectedInterests.length === 0) return;
  if (step === 4 && !fwSelectedDuration) return;

  fwCurrentStep = step;

  // Show / hide steps
  document.querySelectorAll('.fw-step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === step);
  });

  // Progress bar
  const pct = (step / 4) * 100;
  const bar = document.getElementById('fwProgressBar');
  if (bar) bar.style.width = pct + '%';

  // Step label
  const lbl = document.getElementById('fwStepsLabel');
  if (lbl) lbl.textContent = `Step ${step} of 4`;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildDomainGrid() {
  const grid = document.getElementById('domainGrid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.entries(DOMAIN_MAP).forEach(([domain, data]) => {
    const card = document.createElement('button');
    card.className = 'fw-domain-card' + (fwSelectedDomain === domain ? ' on' : '');
    card.innerHTML = `
      <div class="fw-domain-icon">${data.icon}</div>
      <div class="fw-domain-name">${domain}</div>
      <div class="fw-domain-count">${data.interests.length} topics</div>
    `;
    card.onclick = () => selectDomain(domain);
    grid.appendChild(card);
  });
}

function selectDomain(domain) {
  fwSelectedDomain = domain;
  selectedInterests = [];
  buildDomainGrid();
  buildChips();
  updateFwSelCount();
  updateStep2Next();
  // Auto-advance to step 2
  setTimeout(() => fwGoto(2), 180);
}

function buildChips() {
  const container = document.getElementById('chipsContainer');
  if (!container) return;
  container.innerHTML = '';
  if (!fwSelectedDomain) return;
  const topics = DOMAIN_MAP[fwSelectedDomain].interests;
  topics.forEach(interest => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (selectedInterests.includes(interest) ? ' on' : '');
    chip.textContent = interest;
    chip.onclick = () => toggleChip(chip, interest);
    container.appendChild(chip);
  });
}

function toggleChip(chip, interest) {
  if (selectedInterests.includes(interest)) {
    selectedInterests = selectedInterests.filter(i => i !== interest);
    chip.classList.remove('on');
  } else {
    selectedInterests.push(interest);
    chip.classList.add('on');
  }
  updateFwSelCount();
  updateStep2Next();
  saveInterestsToUser();
}

function updateFwSelCount() {
  const el = document.getElementById('fwSelCount');
  if (el) el.textContent = selectedInterests.length + ' interest' + (selectedInterests.length !== 1 ? 's' : '') + ' selected';
}

function updateStep2Next() {
  const btn = document.getElementById('fwStep2Next');
  if (btn) btn.disabled = selectedInterests.length === 0;
}

function buildDurationGrid() {
  const grid = document.getElementById('durationGrid');
  if (!grid) return;
  grid.innerHTML = '';
  DURATION_OPTIONS.forEach(opt => {
    const card = document.createElement('button');
    card.className = 'fw-option-card' + (fwSelectedDuration === opt.value ? ' on' : '');
    card.innerHTML = `
      <div class="fw-option-icon">${opt.icon}</div>
      <div>
        <div class="fw-option-label">${opt.label}</div>
        <div class="fw-option-sub">${opt.sub}</div>
      </div>
    `;
    card.onclick = () => selectDuration(opt.value);
    grid.appendChild(card);
  });
}

function selectDuration(value) {
  fwSelectedDuration = value;
  buildDurationGrid();
  const btn = document.getElementById('fwStep3Next');
  if (btn) btn.disabled = false;
}

function buildLevelGrid() {
  const grid = document.getElementById('levelGrid');
  if (!grid) return;
  grid.innerHTML = '';
  LEVEL_OPTIONS.forEach(opt => {
    const card = document.createElement('button');
    card.className = 'fw-option-card' + (fwSelectedLevel === opt.value ? ' on' : '');
    card.innerHTML = `
      <div class="fw-option-icon">${opt.icon}</div>
      <div>
        <div class="fw-option-label">${opt.label}</div>
        <div class="fw-option-sub">${opt.sub}</div>
      </div>
    `;
    card.onclick = () => selectLevel(opt.value);
    grid.appendChild(card);
  });
}

function selectLevel(value) {
  fwSelectedLevel = value;
  buildLevelGrid();
  updateGoBtn();
}

function updateGoBtn() {
  const btn = document.getElementById('btnGo');
  if (!btn) return;
  if (!fwSelectedLevel) {
    btn.disabled = true;
    btn.textContent = 'Select a level to continue';
  } else {
    btn.disabled = false;
    btn.textContent = '🔍 Find My Courses (' + selectedInterests.length + ' interest' + (selectedInterests.length !== 1 ? 's' : '') + ')';
  }
}

function saveInterestsToUser() {
  const session = getSession();
  if (session) {
    const users = getUsers();
    if (users[session.email]) {
      users[session.email].interests = selectedInterests;
      saveUsers(users);
    }
  }
}

function loadInterestsPage(name, savedInterests) {
  const firstName = name.split(' ')[0];
  const titleEl = document.getElementById('intTitle');
  if (titleEl) titleEl.textContent = 'Hello, ' + firstName + '! 👋';

  document.querySelectorAll('.chat-body').forEach(body => {
    body.innerHTML = `
      <div class="chat-msg bot-msg">
        <div class="msg-text">Hello ${firstName}! Choosing courses can be overwhelming. Would you like me to suggest some trending topics based on your profile?</div>
        <div class="msg-time">Assistant &middot; Just now</div>
      </div>
    `;
  });

  // Reset wizard state
  fwCurrentStep = 1;
  fwSelectedDomain = null;
  fwSelectedDuration = null;
  fwSelectedLevel = null;
  selectedInterests = savedInterests ? [...savedInterests] : [];

  // Try to restore domain from saved interests
  if (selectedInterests.length > 0) {
    for (const [domain, data] of Object.entries(DOMAIN_MAP)) {
      if (data.interests.some(i => selectedInterests.includes(i))) {
        fwSelectedDomain = domain;
        break;
      }
    }
  }

  // Re-init wizard UI
  fwGoto(1);
  buildDomainGrid();
  buildChips();
  buildDurationGrid();
  buildLevelGrid();
  updateFwSelCount();
  updateStep2Next();
  updateGoBtn();
}

/* ═══════════════════════════════════════════════════════════════════
   GO → RECOMMEND / DASHBOARD
═══════════════════════════════════════════════════════════════════ */
function goRecommend() {
  if (selectedInterests.length === 0 || !fwSelectedLevel) return;
  const session = getSession();
  if (session) {
    const users = getUsers();
    if (users[session.email]) {
      users[session.email].interests = selectedInterests;
      saveUsers(users);
    }
  }
  buildDashboard();
  showPage('dashboard');
}

/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════════ */
let allCourses = [];
let activeFilter = 'All';

/* Duration range helper */
function durationMatchesFilter(durationStr, filterVal) {
  if (!filterVal || filterVal === 'any') return true;
  const str = durationStr.toLowerCase();
  // Extract first numeric value
  const nums = str.match(/\d+/g);
  if (!nums) return true; // self-paced → always show
  const n = parseInt(nums[0]);
  if (filterVal === 'short') return n <= 8;
  if (filterVal === '10weeks') return n >= 9 && n <= 11;
  if (filterVal === '12weeks') return n >= 11 && n <= 13;
  if (filterVal === 'long') return n >= 14;
  return true;
}

function levelMatchesFilter(courseLevel, filterVal) {
  if (!filterVal || filterVal === 'any') return true;
  return courseLevel === filterVal;
}

function buildDashboard() {
  const metaEl = document.getElementById('dashMeta');
  if (metaEl) {
    const domainLabel = fwSelectedDomain ? ` · ${fwSelectedDomain}` : '';
    const levelLabel = fwSelectedLevel && fwSelectedLevel !== 'any' ? ` · ${fwSelectedLevel}` : '';
    metaEl.textContent = 'Showing courses for ' + selectedInterests.length + ' interest' + (selectedInterests.length !== 1 ? 's' : '') + domainLabel + levelLabel;
  }

  const itagRow = document.getElementById('itagRow');
  if (itagRow) {
    itagRow.innerHTML = selectedInterests.map(i => `<span class="itag">${i}</span>`).join('');
  }

  // Build raw course pool
  let rawCourses = [];
  selectedInterests.forEach(interest => {
    const courses = getCourses(interest);
    courses.forEach(c => {
      if (!rawCourses.find(x => x.title === c.title && x.platform === c.platform)) {
        rawCourses.push({ ...c, interest });
      }
    });
  });

  // Apply level + duration filters from wizard
  allCourses = rawCourses.filter(c =>
    levelMatchesFilter(c.level, fwSelectedLevel) &&
    durationMatchesFilter(c.duration, fwSelectedDuration)
  );
  // If filters wiped everything out, fall back to raw
  if (allCourses.length === 0) allCourses = rawCourses;

  const kpiRow = document.getElementById('kpiRow');
  if (kpiRow) {
    const platforms = [...new Set(allCourses.map(c => c.platform))];
    kpiRow.innerHTML = `
      <div class="kpi"><div class="kpi-n">${allCourses.length}</div><div class="kpi-l">Courses Found</div></div>
      <div class="kpi"><div class="kpi-n">${platforms.length}</div><div class="kpi-l">Platforms</div></div>
      <div class="kpi"><div class="kpi-n">${selectedInterests.length}</div><div class="kpi-l">Interests</div></div>
      <div class="kpi"><div class="kpi-n">${allCourses.filter(c => c.level === 'Beginner').length}</div><div class="kpi-l">Beginner Friendly</div></div>
    `;
  }

  activeFilter = 'All';
  buildFilterUI();
  renderCourses();
}

function buildFilterUI() {
  const fpills = document.getElementById('fpills');
  if (!fpills) return;
  const platforms = ['All', ...new Set(allCourses.map(c => c.platform))];
  fpills.innerHTML = platforms.map(p =>
    `<button class="fp${activeFilter === p ? ' on' : ''}" onclick="setFilter('${p}')">${p}</button>`
  ).join('');
}

function setFilter(platform) {
  activeFilter = platform;
  buildFilterUI();
  renderCourses();
}

function renderCourses() {
  const grid = document.getElementById('courseGrid');
  if (!grid) return;
  let filtered = allCourses;
  if (activeFilter !== 'All') {
    filtered = filtered.filter(c => c.platform === activeFilter);
  }
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-t">No courses found</div>
        <div>Try a different platform filter or adjust your preferences.</div>
      </div>`;
    return;
  }
  const platClass = c => PLAT_CLASS[c.platform] || 'bd';
  const levelEmoji = c => LEVEL_EMOJI[c.level] || '⚪';
  grid.innerHTML = `<div class="cgrid">${filtered.map(c => `
    <div class="ccard">
      <div class="ccard-top">
        <div class="prow">
          <span class="pbadge ${platClass(c)}">${c.platform}</span>
          <span class="clvl">${levelEmoji(c)} ${c.level}</span>
        </div>
        <div class="ctitle">${c.title}</div>
        <div class="cdesc">${c.desc}</div>
        <div class="ctags">
          <span class="ctag">📚 ${c.interest}</span>
          <span class="ctag">🏛️ ${c.provider}</span>
          <span class="ctag">⏱️ ${c.duration}</span>
        </div>
      </div>
      <div class="ccard-bot">
        <span class="cmatch">✓ Matches your interest</span>
        <a class="btn-exp" href="${c.url}" target="_blank" rel="noopener">Explore →</a>
      </div>
    </div>`).join('')}</div>`;
}

function goDashboard() {
  if (selectedInterests.length > 0) {
    buildDashboard();
    showPage('dashboard');
  } else {
    showPage('interests');
  }
}

/* ═══════════════════════════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════════════════════════ */
function initFAQ() {
  const FAQ_ANSWERS = {
    "How are the courses ranked?": "Our system aggregates and ranks courses using AI based on relevance, learner reviews, and curriculum depth tailored to your chosen interests.",
    "Are the courses free or paid?": "We show a mix of both. Many platform courses like NPTEL and SWAYAM are free to learn, while others might offer free auditing with paid certificates.",
    "Can I change my interests later?": "Yes! You can change your selected interests at any time from your Dashboard to receive updated course recommendations.",
    "Will I get certificates for these courses?": "Certificates are provided by the respective platforms (Coursera, edX, etc.) upon successful completion of their specific requirements."
  };

  document.querySelectorAll('.faq-item').forEach(item => {
    const qText = item.querySelector('.faq-q').textContent.trim();
    if (FAQ_ANSWERS[qText]) {
      const aDiv = document.createElement('div');
      aDiv.className = 'faq-a';
      aDiv.textContent = FAQ_ANSWERS[qText];
      item.appendChild(aDiv);
    }
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   GROQ AI CHATBOT  (unchanged)
═══════════════════════════════════════════════════════════════════ */
const GROQ_API_KEY = "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";
const chatHistories = new WeakMap();

function buildSystemPrompt() {
  const session = getSession();
  const userName = session ? session.name.split(' ')[0] : 'Student';
  const interests = selectedInterests.length > 0 ? selectedInterests.join(', ') : 'none selected yet';

  let courseContext = '';
  if (selectedInterests.length > 0) {
    const sampleCourses = [];
    selectedInterests.slice(0, 5).forEach(interest => {
      const courses = getCourses(interest);
      courses.slice(0, 2).forEach(c => {
        sampleCourses.push(`- ${c.title} (${c.platform}, ${c.provider}, ${c.level}, ${c.duration})`);
      });
    });
    courseContext = `\n\nThe user currently has these courses recommended:\n${sampleCourses.join('\n')}`;
  }

  return `You are the VidyaSetu Assistant — a friendly, knowledgeable AI chatbot embedded in the VidyaSetu platform.

ABOUT VIDYASETU:
VidyaSetu is an educational course aggregation platform that collects courses from NPTEL, SWAYAM, Coursera, edX, MIT OpenCourseWare, and other platforms. It ranks them using AI based on relevance to the student's interests, learner reviews, and curriculum depth. Students can register, select their interests, and get personalized course recommendations.

CURRENT USER CONTEXT:
- Name: ${userName}
- Selected interests: ${interests}${courseContext}

YOUR CAPABILITIES — You can answer questions about:
- Courses, certifications, degrees, and learning paths
- Educational platforms (NPTEL, Coursera, edX, SWAYAM, MIT OCW, Udemy, Khan Academy, etc.)
- Subjects, topics, and academic fields (CS, engineering, science, arts, management, law, medicine, etc.)
- Career guidance and job roles related to educational fields
- How VidyaSetu works (ranking, interests, dashboard, features)
- Study tips, exam preparation, and learning strategies
- Comparing courses or platforms
- Prerequisites and learning roadmaps

STRICT RULES:
1. If the user asks about ANYTHING outside education, learning, courses, careers, or VidyaSetu — you MUST politely decline. Say something like: "I appreciate your curiosity, but that falls outside my area of expertise. I'm specialized in education, courses, and career guidance. Feel free to ask me anything on those topics!"
2. Off-topic examples to REFUSE: politics, entertainment, sports scores, weather, cooking recipes, personal relationship advice, writing non-educational code, jokes unrelated to learning.
3. Keep responses concise (2-4 short paragraphs max). Use <b> for emphasis and <br> for line breaks. Do NOT use markdown formatting like ** or ##.
4. Be warm, encouraging, and supportive — like a helpful academic mentor.
5. When recommending courses, mention specific ones from the user's recommendations if relevant.`;
}

async function getAIBotReply(input, widget) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE") {
    return "API Key not configured. Get your free key at <b>console.groq.com/keys</b> and paste it in script.js.";
  }

  let history = chatHistories.get(widget) || [];
  history.push({ role: "user", content: input });
  if (history.length > 20) history = history.slice(-20);

  const systemPrompt = buildSystemPrompt();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history
        ],
        temperature: 0.7,
        max_tokens: 512
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Groq API error:', response.status, errData);
      throw new Error(`API Error ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Empty response from API');
    }

    const raw = data.choices[0].message.content;
    let text = raw.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

    history.push({ role: "assistant", content: raw });
    chatHistories.set(widget, history);

    return text;
  } catch (err) {
    console.error('Chatbot error:', err);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}

function initChatbot() {
  document.querySelectorAll('.chat-widget').forEach(widget => {
    const input = widget.querySelector('.chat-input');
    const sendBtn = widget.querySelector('.chat-send');
    const body = widget.querySelector('.chat-body');

    chatHistories.set(widget, []);

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      input.disabled = true;
      sendBtn.disabled = true;

      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user-msg';
      userMsg.innerHTML = `
        <div class="msg-text">${text}</div>
        <div class="msg-time">You &middot; Just now</div>
      `;
      body.appendChild(userMsg);
      input.value = '';
      body.scrollTop = body.scrollHeight;

      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-msg bot-msg loading-msg';
      loadingMsg.innerHTML = `
        <div class="msg-text typing-indicator"><span></span><span></span><span></span></div>
      `;
      body.appendChild(loadingMsg);
      body.scrollTop = body.scrollHeight;

      const reply = await getAIBotReply(text, widget);

      loadingMsg.remove();

      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg bot-msg';
      botMsg.innerHTML = `
        <div class="msg-text">${reply}</div>
        <div class="msg-time">Assistant &middot; Just now</div>
      `;
      body.appendChild(botMsg);
      body.scrollTop = body.scrollHeight;

      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const session = getSession();
  updateNav();
  if (session) {
    const users = getUsers();
    const userInterests = (users[session.email] && users[session.email].interests) || [];
    selectedInterests = userInterests;
    loadInterestsPage(session.name, userInterests);
    if (userInterests.length > 0) {
      buildDashboard();
      showPage('dashboard');
    } else {
      showPage('interests');
    }
  } else {
    showPage('welcome');
  }
  // Init wizard grids even if not logged in (for when page is first loaded)
  buildDomainGrid();
  buildChips();
  buildDurationGrid();
  buildLevelGrid();
  updateFwSelCount();
  updateStep2Next();
  updateGoBtn();
  initFAQ();
  initChatbot();
});