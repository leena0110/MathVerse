# MathVerse - Adaptive Visual Math Learning Portal

🎯 **Project Overview**
MathVerse is an adaptive visual mathematics learning portal specifically designed for neurodiverse children, with a focus on autism spectrum learners. The platform provides a calm, structured, and sensory-friendly environment where children can learn fundamental math concepts through visual representation and interactive gameplay.

👥 **Team Information**
Roll No: [Your Roll Number]
Name: [Your Name]
Course: [Course Code] - [Course Name]
Institution: Amrita School of Computing, Amrita Vishwa Vidyapeetham, Coimbatore - 641112
Course Teacher: Dr. T. Senthil Kumar (Professor)
Email: t_senthilkumar@cb.amrita.edu

🌟 **Key Features**
1. Visual Learning Modules
   - Quantity Comparison: Compare visual quantities (more, less, same)
   - Number Line Addition: Learn addition through visual movement on number lines
   - Pattern Recognition: Identify and complete visual patterns
   - Number Sequencing: Arrange numbers in correct order via drag-and-drop

2. Adaptive Learning System
   - AI-driven difficulty adjustment based on performance
   - Automatic level progression at 80% accuracy
   - Personalized learning paths

3. Sensory-Friendly Design
   - Calm pastel color palette to reduce visual stress
   - Minimal animations (adjustable speed)
   - No sudden changes or overwhelming stimuli
   - Optional sound effects (disabled by default)

4. Progress Tracking
   - Detailed analytics dashboard for parents/educators
   - Visual charts showing accuracy and progress
   - Session tracking and time management
   - Performance metrics per game module

5. Customizable Experience
   - Adjustable animation speeds
   - Sound on/off toggle
   - Timer visibility control
   - Multiple difficulty modes
   - Theme customization

🛠️ **Technology Stack**
- Frontend Framework: React.js 18
- Routing: React Router DOM v6
- State Management: Context API with React Hooks
- Data Visualization: Recharts library
- Data Persistence: LocalStorage
- Styling: Custom CSS with responsive design
- Development Tools: React Scripts, ESLint

📦 **Installation & Setup**
Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

Steps to Run
1. Clone the repository:
   ```bash
   git clone [your-github-url]
   cd mathverse-autism-portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The application will open at http://localhost:3000

4. Build for production:
   ```bash
   npm run build
   ```

📁 **Project Structure**
```
mathverse-autism-portal/
├── public/
│   └── index.html
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/
│   │   └── ProgressContext.js  # Global state management
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── Dashboard.js
│   │   ├── QuantityComparison.js
│   │   ├── NumberLineAddition.js
│   │   ├── PatternRecognition.js
│   │   ├── NumberSequencing.js
│   │   ├── ParentDashboard.js
│   │   ├── Settings.js
│   │   └── ProductInfo.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

🎮 **How to Use**
- Launch Application: Open the application and land on the home page
- Choose Game: Navigate to Dashboard and select a learning module
- Play & Learn: Follow on-screen instructions for each game
- Track Progress: Parents/educators can view detailed analytics in the Parent Dashboard
- Customize: Adjust settings according to the child's sensory preferences

🧠 **Learning Outcomes**
Cognitive Skills Developed:
- Quantity Recognition: Understanding more/less/equal concepts
- Addition Concepts: Learning addition as movement and increase
- Pattern Recognition: Identifying sequences and predicting outcomes
- Number Sense: Understanding numerical order and relationships

Benefits for Autism Spectrum Learners:
- Visual Processing: Leverages visual strengths common in autism
- Reduced Anxiety: No time pressure, positive-only feedback
- Structured Learning: Predictable patterns and clear expectations
- Sensory Regulation: Customizable sensory input levels
- Self-Paced: Learn at individual speed without pressure

📊 **React Concepts Used**
Core React Concepts:
- Functional Components: All components built as functional components
- React Hooks: useState, useEffect, useContext, useNavigate
- Context API: Global state management for progress tracking
- React Router: Multi-page navigation with protected routes
- Conditional Rendering: Dynamic UI based on state
- Event Handling: User interaction management
- Props: Component data passing
- LocalStorage Integration: Data persistence

Advanced Features:
- Custom hooks for state management
- Responsive design patterns
- Animation and transition effects
- Chart integration with Recharts
- Drag-and-drop functionality
- Real-time state updates

🔬 **Research Backing**
Autism Learning Principles Applied:
- Visual Learning Preference: Studies show 80% of autistic individuals are visual learners
- Reduced Cognitive Load: Minimal distractions align with executive function challenges
- Positive Reinforcement: Research supports error-free learning approaches
- Predictability: Structured environment reduces anxiety
- Self-Paced Learning: Accommodates processing speed variations

🚀 **Future Enhancements**
- Voice Feedback: Optional audio instructions with natural language
- Multi-Language Support: Accessibility for diverse learners
- Advanced Analytics: Machine learning for learning pattern analysis
- Social Features: Safe, moderated peer interaction
- Offline Mode: Progressive Web App capabilities
- Parent-Teacher Communication: Built-in messaging system
- Custom Curriculum: Educator-created content modules
- Gamification: Achievement badges and progress rewards
- API Integration: Connect with educational platforms
- Mobile App: Native iOS and Android versions

📄 **Documentation**
Complete documentation including:
- User guide for parents/educators
- Technical documentation for developers
- Research references and methodology
- Accessibility compliance report

Available in the /docs folder.

🤝 **Collaboration**
- Academic Collaborator: [Name, if applicable]
- Industry Collaborator: [Organization, if applicable]

📧 **Contact**
For questions or support:
- Email: [your-email]
- GitHub: [your-github-url]

📜 **License**
This project is developed as part of academic coursework at Amrita Vishwa Vidyapeetham.

Developed with 💙 for inclusive education.

---

## Backend Setup (Node.js)

A Node.js backend (Express server) is included in the `server` folder.

### To run the backend:
1. Open a terminal in the `server` directory.
2. Run `npm install` to install dependencies.
3. Start the server with `npm start`.
   - The backend will run on [http://localhost:5000](http://localhost:5000)

### Health Check
Visit [http://localhost:5000/api/health](http://localhost:5000/api/health) to verify the backend is running.

### Connecting Frontend & Backend
- The frontend can fetch data from the backend using API calls (see `src/apiTest.js` for an example).
- Update API endpoints as needed for your features.

---
