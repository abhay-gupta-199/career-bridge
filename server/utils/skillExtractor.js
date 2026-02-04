/**
 * Skill Extraction Utility
 * Extracts and normalizes skills from job descriptions, resumes, and raw text
 */

const COMMON_SKILLS = {
  // Frontend
  react: ['react', 'reactjs', 'react.js', 'react js'],
  'react native': ['react native', 'react-native'],
  vue: ['vue', 'vuejs', 'vue.js'],
  angular: ['angular', 'angularjs', 'angular.js'],
  javascript: ['javascript', 'js', 'ecmascript', 'es6'],
  typescript: ['typescript', 'ts', 'tsx'],
  html: ['html', 'html5', 'html 5'],
  css: ['css', 'css3', 'css 3'],
  sass: ['sass', 'scss'],
  less: ['less'],
  tailwind: ['tailwind', 'tailwindcss', 'tailwind css'],
  bootstrap: ['bootstrap'],
  redux: ['redux'],
  'next.js': ['next.js', 'nextjs', 'next js'],

  // Backend
  python: ['python', 'python3', 'python 3', 'py'],
  java: ['java', 'jdk', 'jre'],
  'spring boot': ['spring boot', 'spring framework', 'springboot'],
  'node.js': ['node.js', 'nodejs', 'node', 'npm'],
  express: ['express', 'expressjs', 'express.js'],
  php: ['php'],
  laravel: ['laravel'],
  csharp: ['c#', 'csharp', '.net', 'asp.net'],
  go: ['go', 'golang', 'go lang'],
  rust: ['rust', 'rustlang'],
  ruby: ['ruby'],
  'ruby on rails': ['rails', 'ruby on rails'],
  django: ['django'],
  flask: ['flask'],
  fastapi: ['fastapi'],

  // Databases
  mysql: ['mysql', 'sql'],
  postgresql: ['postgresql', 'postgres', 'psql'],
  mongodb: ['mongodb', 'mongo', 'mongoose'],
  redis: ['redis'],
  elasticsearch: ['elasticsearch', 'elastic search'],
  dynamodb: ['dynamodb', 'dynamo db'],
  cassandra: ['cassandra'],
  firebase: ['firebase', 'firestore'],
  sqlite: ['sqlite'],
  oracle: ['oracle'],

  // Cloud & DevOps
  aws: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'rds'],
  azure: ['azure', 'microsoft azure'],
  'google cloud': ['google cloud', 'gcp', 'google cloud platform'],
  docker: ['docker', 'containerization'],
  kubernetes: ['kubernetes', 'k8s'],
  jenkins: ['jenkins'],
  'ci/cd': ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment'],
  git: ['git', 'github', 'gitlab', 'bitbucket'],
  terraform: ['terraform', 'iac'],
  ansible: ['ansible'],
  nginx: ['nginx'],

  // Testing
  jest: ['jest'],
  pytest: ['pytest'],
  mocha: ['mocha', 'chai'],
  junit: ['junit'],
  selenium: ['selenium'],
  cypress: ['cypress'],

  // Authentication & Security
  jwt: ['jwt', 'json web token'],
  oauth: ['oauth', 'oauth2'],
  security: ['web security', 'owasp'],

  // Tools
  linux: ['linux', 'ubuntu'],
  jira: ['jira'],
  postman: ['postman'],
  figma: ['figma'],

  // Stacks
  mern: ['mern', 'mern stack'],
  mean: ['mean', 'mean stack'],

  // Data & ML
  'machine learning': ['machine learning', 'ml', 'ai'],
  'data science': ['data science'],
  tensorflow: ['tensorflow'],
  pytorch: ['pytorch'],
  pandas: ['pandas'],
  numpy: ['numpy'],

  // Concepts
  rest: ['rest', 'restful', 'rest api', 'restful api'],
  graphql: ['graphql'],
  microservices: ['microservices'],
  agile: ['agile', 'scrum'],
  'data structures': ['data structures', 'dsa', 'algorithms']
};

/**
 * Extract skills from text using keyword matching
 * @param {string} text - Input text to extract skills from
 * @returns {Array} Array of extracted skill names
 */
function extractSkillsFromText(text) {
  if (!text || typeof text !== 'string') return [];

  const normalizedText = text.toLowerCase();
  const extractedSkills = new Set();

  // Check against all common skills
  Object.entries(COMMON_SKILLS).forEach(([skillName, keywords]) => {
    keywords.forEach(keyword => {
      // Use word boundary regex to match whole words/phrases
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (regex.test(normalizedText)) {
        extractedSkills.add(skillName);
      }
    });
  });

  return Array.from(extractedSkills);
}

/**
 * Extract skills from job description
 * @param {Object} jobData - Job data with title, description, requirements
 * @returns {Object} Object with parsed skills and metadata
 */
function extractJobSkills(jobData) {
  const { title = '', description = '', requirements = '', skillsRequired = [] } = jobData;

  // Combine all text sources
  const combinedText = `${title} ${description} ${requirements}`.toLowerCase();

  // Extract skills from text
  const textSkills = extractSkillsFromText(combinedText);

  // Normalize explicitly provided skills
  const providedSkills = (skillsRequired || [])
    .map(skill => skill.toLowerCase().trim())
    .filter(skill => skill.length > 0);

  // Combine and deduplicate
  const allSkills = [...new Set([...textSkills, ...providedSkills])];

  return {
    extractedSkills: textSkills,
    providedSkills: providedSkills,
    combinedSkills: allSkills,
    skillCount: allSkills.length,
    extractionMetadata: {
      totalTextLength: combinedText.length,
      extractedFrom: {
        title: textSkills.filter(skill => title.toLowerCase().includes(skill)).length > 0,
        description: textSkills.filter(skill => description.toLowerCase().includes(skill)).length > 0,
        requirements: textSkills.filter(skill => requirements.toLowerCase().includes(skill)).length > 0
      }
    }
  };
}

/**
 * Extract skills from resume text
 * @param {string} resumeText - Resume text content
 * @returns {Object} Object with parsed resume skills
 */
function extractResumeSkills(resumeText) {
  if (!resumeText) return {
    extractedSkills: [],
    resumeText: '',
    skillCount: 0
  };

  const skills = extractSkillsFromText(resumeText);

  // Count skill frequency in resume
  const skillFrequency = {};
  skills.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = resumeText.match(regex) || [];
    skillFrequency[skill] = matches.length;
  });

  return {
    extractedSkills: skills,
    resumeText: resumeText.substring(0, 200), // Preview
    skillCount: skills.length,
    skillFrequency: skillFrequency,
    topSkills: Object.entries(skillFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill]) => skill)
  };
}

/**
 * Calculate skill match between two skill arrays
 * @param {Array} resumeSkills - Skills from resume
 * @param {Array} jobSkills - Skills from job
 * @returns {Object} Match details
 */
function calculateSkillMatch(resumeSkills = [], jobSkills = []) {
  const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
  const jobSet = new Set(jobSkills.map(s => s.toLowerCase()));

  const matchedSkills = Array.from(resumeSet).filter(skill => jobSet.has(skill));
  const missingSkills = Array.from(jobSet).filter(skill => !resumeSet.has(skill));
  const extraSkills = Array.from(resumeSet).filter(skill => !jobSet.has(skill));

  const matchPercentage = jobSet.size > 0 ? (matchedSkills.length / jobSet.size) * 100 : 0;

  return {
    matchedSkills,
    missingSkills,
    extraSkills,
    matchCount: matchedSkills.length,
    totalRequired: jobSet.size,
    matchPercentage: parseFloat(matchPercentage.toFixed(2))
  };
}

/**
 * Normalize skill name to standard format
 * @param {string} skill - Skill name
 * @returns {string} Normalized skill name
 */
function normalizeSkill(skill) {
  const normalized = skill.toLowerCase().trim();

  // Find matching standard skill name
  for (const [standardName, keywords] of Object.entries(COMMON_SKILLS)) {
    if (keywords.includes(normalized)) {
      return standardName;
    }
  }

  return normalized;
}

/**
 * Get skill categories for given skills
 * @param {Array} skills - Array of skill names
 * @returns {Object} Skills grouped by category
 */
function categorizeSkills(skills = []) {
  const categories = {
    frontend: [],
    backend: [],
    database: [],
    devops: [],
    testing: [],
    tools: [],
    dataml: [],
    other: []
  };

  const skillMappings = {
    frontend: ['react', 'react native', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'redux', 'next.js'],
    backend: ['python', 'java', 'spring boot', 'node.js', 'express', 'php', 'laravel', 'csharp', 'go', 'rust', 'ruby', 'ruby on rails', 'django', 'flask', 'fastapi', 'rest', 'graphql', 'microservices', 'jwt', 'oauth', 'security', 'mern', 'mean'],
    database: ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'cassandra', 'firebase', 'sqlite', 'oracle'],
    devops: ['aws', 'azure', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'git', 'terraform', 'ansible', 'nginx'],
    testing: ['jest', 'pytest', 'mocha', 'junit', 'selenium', 'cypress'],
    tools: ['linux', 'windows', 'mac', 'jira', 'confluence', 'slack', 'postman', 'figma', 'webpack', 'npm', 'yarn', 'bash'],
    dataml: ['machine learning', 'data science', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'sklearn'],
    other: ['agile', 'data structures']
  };

  skills.forEach(skill => {
    const normalized = normalizeSkill(skill);
    let categorized = false;

    for (const [category, categorySkills] of Object.entries(skillMappings)) {
      if (categorySkills.includes(normalized)) {
        categories[category].push(normalized);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      categories.other.push(normalized);
    }
  });

  // Remove duplicates
  Object.keys(categories).forEach(cat => {
    categories[cat] = [...new Set(categories[cat])];
  });

  return categories;
}

module.exports = {
  extractSkillsFromText,
  extractJobSkills,
  extractResumeSkills,
  calculateSkillMatch,
  normalizeSkill,
  categorizeSkills,
  COMMON_SKILLS
};
