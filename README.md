# ⚡ RTL Learning — ASIC & Hardware Architecture Workbench

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_AI-2.4-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

An interactive, production-grade 60-day ASIC front-end RTL design, Static Timing Analysis (STA), Clock Domain Crossing (CDC), and Tier-1 silicon interview preparation workbench with an integrated simulation lab, curriculum roadmap, and AI RTL Mentor.

---

## 📌 Overview

**RTL Learning** is engineered for digital design engineers, ASIC/FPGA developers, and microarchitecture candidates targeting Tier-1 semiconductor firms (Apple Silicon, NVIDIA, Qualcomm, Google TPU, Broadcom, AMD). 

Rather than treating Verilog as abstract software code, this workbench emphasizes **hardware physics**, **simulation event queues**, **synthesis-to-gate mapping**, and **physical silicon constraints** across TSMC deep-submicron FinFET nodes.

```
       ┌─────────────────────────────────────────────────────────────┐
       │             RTL PREP WORKBENCH ARCHITECTURE                 │
       └─────────────────────────────────────────────────────────────┘
                                      │
         ┌────────────────────────────┼───────────────────────────┐
         ▼                            ▼                           ▼
  [ 60-Day Curriculum ]      [ RTL Simulation Lab ]      [ Silicon Interview Prep ]
  • 6 Master Phases          • Multi-Tab Editor (.v/.sv) • Tier-1 Company Flashcards
  • Interactive Heatmap      • Waveform Viewer           • Whiteboard ASIC Puzzles
  • Daily Quizzes & Audits   • Verilator / IVerilog Logs • Synthesizable Solutions
         │                            │                           │
         └────────────────────────────┼───────────────────────────┘
                                      ▼
                        [ AI RTL Mentor & Debugger ]
                        • IEEE 1364/1800 Standard QA
                        • Latch / X-Propagation Audit
                        • Timing & Slack Remediation
```

---

## 🚀 Key Features

### 1. 📅 60-Day ASIC Mastery Curriculum Matrix
An interactive 10x6 roadmap matrix broken down into 6 specialized phases with milestone gate reviews:

| Phase | Days | Focus Domain | Key Topics & Deliverables |
|:---:|:---:|:---|:---|
| **Phase 1** | Days 1–10 | **Verilog Fundamentals & Simulation Semantics** | IEEE 1364 standard, 4-state logic (0, 1, X, Z), event queue regions, delta cycles (`#0`), blocking vs non-blocking hazards, continuous net assignments. |
| **Phase 2** | Days 11–20 | **RTL Design Patterns, FSMs & Datapaths** | 2-always vs 3-always FSMs, Moore/Mealy trade-offs, binary vs Gray vs one-hot encoding, ALU pipelining, synchronous FIFOs, UART protocol. |
| **Phase 3** | Days 21–30 | **SystemVerilog RTL & SVA Assertions** | IEEE 1800 constructs, `always_comb`, `always_ff`, `always_latch`, interfaces, packages, immediate/concurrent SVA assertions, sequence matching, DPI-C. |
| **Phase 4** | Days 31–40 | **ASIC RTL Concepts: CDC, Reset & Lint** | CDC physics, metastability, MTBF equations, 2-FF/3-FF synchronizers, Gray pointer asynchronous FIFOs, reset synchronizers, SpyGlass lint rules. |
| **Phase 5** | Days 41–50 | **Synthesis Awareness, STA & Low Power** | Logic synthesis, netlists, Setup/Hold timing equations, SDC constraints, clock skew/jitter, false/multicycle paths, UPF/CPF power gating. |
| **Phase 6** | Days 51–60 | **Bus Protocols, Architecture & Tapeout** | AXI4, AHB, APB bus master/slave handshakes, cache coherency, memory controllers, PnR signoff, and Tier-1 hardware interview simulation. |

---

### 2. 🧪 Interactive RTL Simulation Lab (`RtlLabView`)
* **Multi-File Workspace**: Tabbed code editing supporting Design files (`.v`), Testbenches (`.sv`), and Timing Constraints (`.sdc`).
* **Waveform Visualization**: Interactive cycle-accurate waveform viewer with draggable time cursor and bus expansion.
* **Dual Output Modes**: Switch seamlessly between **Terminal Logs** (iverilog / verilator compiler output) and **Automated Grader** (syntax check, timing violation reports).
* **Silicon Target Configuration**: Configurable target nodes (e.g., TSMC 5nm FinFET) and real-time timing slack feedback.

---

### 3. 🎯 Tier-1 Silicon Interview Prep (`InterviewPrepView`)
* **Company-Specific Flashcards**: Curated technical questions from real interview loops at **Apple Silicon**, **NVIDIA**, **Qualcomm**, **Google**, **Broadcom**, and **Analog Devices**.
* **Whiteboard Architectural Puzzles**: Detailed problem statements, hint ladders, architectural breakdowns, and complete synthesizable Verilog code:
  * *Asynchronous FIFO Depth Calculation* (burst-rate calculation & Gray counter wrap-around).
  * *50% Duty Cycle Divide-by-3 Clock Generator* (dual-edge counter and phase-shifted combinatorial OR).
  * *Glitch-Free Dual-Clock Multiplexer* (cross-coupled falling-edge gating avoiding runt clock pulses).

---

### 4. 📝 Daily Quizzes & Self-Audit Checklists
* **Deep Conceptual Quizzes**: 10 questions per module testing physical intuition (FPGA vs ASIC routing, $I_{ddq}$ contention currents, X-propagation optimism, tri-state pads).
* **Immediate Architectural Feedback**: Detailed post-submission explanations highlighting why wrong answers cause silicon-level defects.
* **Day Inspector Drawer**: Slide-out drawer providing module specifications, port definitions, and tapeout criteria.

---

### 5. 🤖 Gemini AI RTL Mentor
* Powered by Google's **Gemini API** (`@google/genai`).
* Serves as an on-demand ASIC mentor trained on IEEE 1364-2001, IEEE 1800-2017, and Synopsys Design Compiler manuals.
* Quick prompts for instant analysis:
  * *"Why `reg` is not necessarily a Flip-Flop"*
  * *"How Qualcomm engineers test X-propagation & optimism"*
  * *"Gate-level synthesis of ternary conditional assignments"*

---

## 🛠️ Tech Stack

* **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Bundler & Tooling**: [Vite 8](https://vitejs.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom hardware dark & silicon theme palettes
* **Animations**: [Motion](https://motion.dev/) (Framer Motion v12)
* **Icons**: [Lucide React](https://lucide.dev/) & [Google Material Symbols](https://fonts.google.com/icons)
* **AI Intelligence**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini SDK)

---

## 📂 Project Structure

```bash
RTL-prep/
├── index.html                   # Entry HTML with silicon font preconnects
├── metadata.json                # Applet & capability manifest
├── package.json                 # Dependencies & build scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── .env.example                 # Example environment variables
└── src/
    ├── App.tsx                  # Root app layout & route coordination
    ├── main.tsx                 # React DOM mount point
    ├── index.css                # Global styles, Tailwind v4 imports & theme tokens
    ├── context/
    │   └── AppContext.tsx       # Global state (theme, active tab, completed days, quiz state)
    ├── types/
    │   └── curriculum.ts        # Type definitions for days, phases, quizzes & puzzles
    ├── data/
    │   ├── curriculumData.ts    # 60-day syllabus data & phase descriptions
    │   ├── interviewData.ts     # Company flashcards & whiteboard interview challenges
    │   └── quizData.ts          # Module quizzes with in-depth hardware explanations
    └── components/
        ├── common/
        │   └── DayInspectorDrawer.tsx  # Slide-out detail drawer for curriculum days
        ├── dashboard/
        │   └── DashboardView.tsx       # 60-node heatmap, metrics, and progress overview
        ├── interview/
        │   └── InterviewPrepView.tsx   # Company flashcards & whiteboard puzzle solver
        ├── lab/
        │   └── RtlLabView.tsx          # Multi-tab RTL editor, waveform viewer, and grader
        ├── layout/
        │   ├── Header.tsx              # Top navigation, node selector, theme switch
        │   └── Sidebar.tsx             # Collapsible side navigation menu
        ├── lesson/
        │   └── LessonView.tsx          # Daily lecture breakdown, code walkthrough, AI mentor
        ├── quiz/
        │   └── DailyQuizzesView.tsx    # Daily interactive multi-choice quiz interface
        ├── roadmap/
        │   └── RoadmapView.tsx         # Comprehensive 60-day filterable roadmap explorer
        └── settings/
            └── SettingsView.tsx        # EDA toolchain, timing slack, and profile settings
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have installed:
* **Node.js**: v18.0.0 or higher
* **npm** (v9+) or **pnpm** / **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/davidchoudhary527-RTL/RTL-prep.git
cd RTL-prep
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure your keys:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
APP_URL="http://localhost:3000"
```
> **Note**: If running inside Google AI Studio, `GEMINI_API_KEY` is injected automatically via the Secrets panel.

### 4. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 5. Build for Production
To generate an optimized production bundle:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

### 6. Lint & Type Check
```bash
npm run lint
```

---

## 🎨 Themes

The workbench includes 3 tailored visual themes:
* **Dark (Default)**: Deep midnight `#0f131c` background optimized for long RTL design and waveform debugging sessions.
* **Light**: Clean, high-contrast palette for daylight reading and documentation review.
* **Silicon**: Specialized dark-cyan foundry aesthetic inspired by modern semiconductor cleanroom consoles and EDA tool suites.

Toggle themes anytime using the palette switch icon in the top header.

---

## 🤝 Contributing

Contributions, bug fixes, and additional interview puzzles are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewWhiteboardPuzzle`)
3. Commit your changes (`git commit -m 'Add async FIFO clock jitter puzzle'`)
4. Push to the branch (`git push origin feature/NewWhiteboardPuzzle`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **Apache-2.0 License**. See the [LICENSE](LICENSE) file for more details.

---

<p align="center">
  Crafted with precision for next-generation Silicon Architects and RTL Engineers.
</p>
