// Source: Workout_Plan_by_Gemini.pdf — "The Supreme Kinetic & Hypertrophic
// Architectural Protocol". Every exercise, set, rep, tempo, rest interval,
// RPE, and reasoning is transcribed verbatim from the PDF. Do not modify.

export type ExerciseCategory = "warmup" | "main" | "cooldown";

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  tempo: string;
  rest: string;
  rpe: string;
  reasoning: string;
  category: ExerciseCategory;
}

export interface RecoveryAction {
  name: string;
  volume: string;
  execution: string;
  duration: string;
  reasoning: string;
}

export interface TrainingDay {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  focus: string;
  muscleGroups: string[];
  phase: "Hypertrophy" | "Kinetic" | "Athletic" | "Potentiation" | "Recovery";
  narrative: string;
  exercises?: Exercise[];
  recovery?: RecoveryAction[];
}

export const PROTOCOL_TITLE =
  "The Supreme Kinetic & Hypertrophic Architectural Protocol";
export const PROTOCOL_SUBTITLE = "A Biomechanical Masterclass";
export const PROTOCOL_SYNTHESIS =
  "Absolute architectural synthesis into a biomechanically flawless, structurally impenetrable, and kinetically devastating athletic machine. A highly specific 6:1 microcycle: four days of extreme mechanical-tension hypertrophic armor building, two days of high-velocity athletic field work and stretch-shortening cycle potentiation, and one day of mathematically precise thermoregulatory and parasympathetic recovery tailored to the high-humidity climate of India.";

export const DAYS: TrainingDay[] = [
  {
    id: "day-1",
    index: 1,
    title: "Anterior Armor, V-Taper Synthesis & Rotational Grip",
    subtitle: "Chest · Lats · Obliques · Forearms",
    focus: "Anterior Armor",
    phase: "Hypertrophy",
    muscleGroups: ["Chest", "Lats", "Obliques", "Forearms"],
    narrative:
      "The microcycle initiates with an aggressive structural assault on the major anterior and posterior upper-body structures. Convergent pressing mechanics and deep loaded stretches maximize three-dimensional pectoral volume. Unilateral latissimus dorsi expansion is prioritized to construct an exaggerated, sweeping V-Taper. The Anterior Oblique Sling and pronation-focused forearm work forge steel-cable-like brachioradialis density.",
    exercises: [
      {
        category: "warmup",
        name: "Thoracic Spine Foam Rolling & Extension",
        sets: "2",
        reps: "60s",
        tempo: "2-2-2-2",
        rest: "15s",
        rpe: "N/A",
        reasoning:
          "Mobilizes the thoracic spine, increasing facet joint glide. Critical for preserving glenohumeral mobility and allowing maximum scapular retraction during heavy pressing and rowing, preventing impingement and ensuring optimal power transfer across the upper extremities.",
      },
      {
        category: "warmup",
        name: "Scapular Wall Slides",
        sets: "2",
        reps: "15",
        tempo: "2-0-2-1",
        rest: "30s",
        rpe: "4",
        reasoning:
          "Activates the serratus anterior and lower trapezius, establishing neuromuscular control of the scapulothoracic joint. Provides a stable, rigid anchor for the humerus, allowing the pectoralis major to generate raw absolute strength safely without destabilizing the shoulder capsule.",
      },
      {
        category: "warmup",
        name: "Plyometric Medicine Ball Chest Passes",
        sets: "3",
        reps: "5",
        tempo: "1-0-X-0",
        rest: "60s",
        rpe: "9 (Intent)",
        reasoning:
          "Primes the CNS by activating high-threshold motor units in the pectoralis major and triceps. Utilizing the stretch-shortening cycle (SSC) increases the rate of force development (RFD) and neural drive immediately prior to heavy mechanical loading, ensuring maximal fiber recruitment.",
      },
      {
        category: "main",
        name: "Convergent Machine Chest Press (Myo-Rep Match)",
        sets: "1 Act. + 3–5 Myo",
        reps: "12–15 (Target), then Match",
        tempo: "3-1-X-1",
        rest: "15s (Myo) / 180s (Next Block)",
        rpe: "8–9 (75% 1RM)",
        reasoning:
          "Convergent machines allow the humerus to cross the body's midline, maximizing sternocostal fiber shortening. Myo-rep matching accumulates maximal effective reps close to failure while minimizing systemic fatigue, exploiting Henneman's size principle to force Type II fiber growth.",
      },
      {
        category: "main",
        name: "Deep Incline Dumbbell Flye Press",
        sets: "4",
        reps: "8–10",
        tempo: "4-2-X-1",
        rest: "120s",
        rpe: "8 (80% 1RM)",
        reasoning:
          "Targets the clavicular head of the pectoralis major through extreme stretch-mediated hypertrophy. The 2-second pause in the maximally lengthened position places immense passive tension on the titin filaments, inducing sarcomerogenesis and creating thick, bulletproof upper chest armor.",
      },
      {
        category: "main",
        name: "Meadows Row (Unilateral Landmine)",
        sets: "4",
        reps: "10–12",
        tempo: "3-1-X-1",
        rest: "90s per side",
        rpe: "8 (75% 1RM)",
        reasoning:
          "A unilateral horizontal pull that aligns resistance with the lower latissimus dorsi fibers. The staggered stance and extreme stretch at the bottom stimulate muscle fascicle lengthening. Develops a sweeping V-taper while demanding deep core anti-rotation stabilization.",
      },
      {
        category: "main",
        name: "Anterior Oblique Sling Cable Woodchops",
        sets: "4",
        reps: "12",
        tempo: "3-0-X-1",
        rest: "90s",
        rpe: "8 (75% 1RM)",
        reasoning:
          "Directly targets the Anterior Oblique Sling (AOS), integrating the external obliques and contralateral internal obliques. Builds dense, blocky obliques capable of transferring devastating rotational torque from the lower body through the trunk, creating an indestructible kinetic transmission system.",
      },
      {
        category: "main",
        name: "Loaded Strap Pronation",
        sets: "4",
        reps: "10–12",
        tempo: "3-0-X-2",
        rest: "120s",
        rpe: "8–9 (80% 1RM)",
        reasoning:
          "Mandated for building \"steel cable\" forearms. Pronation — the inward rotation of the forearm — is a foundational force multiplier in elite arm wrestling. A strap over the thumb knuckle isolates the pronator teres and brachioradialis, building devastating functional wrist control.",
      },
      {
        category: "cooldown",
        name: "Deep Pectoral Wall Stretch",
        sets: "2",
        reps: "120s",
        tempo: "Static",
        rest: "30s",
        rpe: "6 (Stretch)",
        reasoning:
          "Prolonged static stretching (>1 minute) alters fascial elasticity and reduces post-exercise muscle tone. Down-regulates the sympathetic nervous system, shifting the body into a parasympathetic state to begin recovery and passive stretch-mediated adaptations.",
      },
    ],
  },
  {
    id: "day-2",
    index: 2,
    title: "Lower Body High-Velocity Mass",
    subtitle: "Stretch-Mediated Glutes & Vertical Plyometrics",
    focus: "Kinetic Engine",
    phase: "Hypertrophy",
    muscleGroups: ["Quads", "Glutes", "Hamstrings", "Forearms"],
    narrative:
      "Bridges heavy iron with high-velocity mechanics. The deep squat maximizes quadriceps and gluteal stretch; the barbell hip thrust generates over 75% more gluteus maximus activation at peak extension. Ballistic trap-bar jumps translate mass into ATP-PCr driven sprint-speed. Seated leg curls enforce stretch-mediated hamstring hypertrophy across both hip and knee joints.",
    exercises: [
      {
        category: "warmup",
        name: "World's Greatest Stretch",
        sets: "2",
        reps: "10 per side",
        tempo: "2-2-2-2",
        rest: "15s",
        rpe: "N/A",
        reasoning:
          "Opens the hips, stretches the psoas, and mobilizes the thoracic spine. Increases synovial fluid viscosity in the coxal and glenohumeral joints, preparing the kinetic chain for extreme range-of-motion loading under heavy weight.",
      },
      {
        category: "warmup",
        name: "Pogo Jumps",
        sets: "3",
        reps: "20",
        tempo: "0-0-X-0",
        rest: "45s",
        rpe: "7",
        reasoning:
          "Low-amplitude, fast-contact plyometrics designed to increase tendon stiffness in the Achilles and patellar tendons. Rapidly activates the fast SSC by minimizing ground contact time, preparing the lower limbs for explosive power output and optimal elastic energy storage.",
      },
      {
        category: "main",
        name: "Deep Paused Back Squat",
        sets: "4",
        reps: "6–8",
        tempo: "4-2-X-1",
        rest: "180s",
        rpe: "8 (80% 1RM)",
        reasoning:
          "Squats maximize the lever arm of the gluteus maximus at full hip flexion while forcing massive quadriceps and adductor activation. The 2-second pause at maximum depth eliminates the stretch reflex, forcing sheer mechanical tension and driving severe myofibrillar packing without creating slow, rigid mass.",
      },
      {
        category: "main",
        name: "Heavy Barbell Hip Thrust",
        sets: "4",
        reps: "8–12",
        tempo: "2-0-X-3",
        rest: "180s",
        rpe: "9 (85% 1RM)",
        reasoning:
          "Generates massive mean and peak gluteus maximus EMG activation at full extension. The 3-second peak isometric hold develops incredibly dense, commanding, and aesthetically shaped glutes that serve as the ultimate posterior engine for sprinting and rotational striking.",
      },
      {
        category: "main",
        name: "Trap-Bar Jumps",
        sets: "5",
        reps: "3–5",
        tempo: "2-0-X-0",
        rest: "180s",
        rpe: "30% 1RM",
        reasoning:
          "Translates raw structural strength into explosive vertical force. Loads the body optimally to utilize the stretch-shortening cycle without placing shearing stress on the lumbar spine. Low reps and high rest exclusively recruit the highest-threshold fast-twitch motor units.",
      },
      {
        category: "main",
        name: "Seated Leg Curls",
        sets: "4",
        reps: "10–15",
        tempo: "3-1-X-1",
        rest: "120s",
        rpe: "8 (75% 1RM)",
        reasoning:
          "Places the hamstrings in a lengthened position across both the hip and knee joints, triggering profound stretch-mediated hypertrophy. Builds dense hamstring mass essential for explosive knee flexion during sprinting, preventing skinny legs while maintaining high functional velocity.",
      },
      {
        category: "main",
        name: "Loaded Cupping (Wrist Flexion)",
        sets: "4",
        reps: "15–20",
        tempo: "3-0-X-2",
        rest: "90s",
        rpe: "8 (70% 1RM)",
        reasoning:
          "Focuses on extreme wrist flexion (cupping) using a thick handle or loading pin. Cupping is the foundational control position in functional grip and arm wrestling, building massive flexor bellies that give the forearms a thick, armored aesthetic while granting inescapable, devastating grappling strength.",
      },
      {
        category: "cooldown",
        name: "Active Couch Stretch",
        sets: "2",
        reps: "90s per leg",
        tempo: "Static",
        rest: "30s",
        rpe: "6 (Stretch)",
        reasoning:
          "Intensely stretches the rectus femoris and iliopsoas. Counteracts the extreme hip flexion and extension forces applied during the workout, preventing anterior pelvic tilt and ensuring the athlete maintains unhindered stride length for maximum sprinting speed.",
      },
    ],
  },
  {
    id: "day-3",
    index: 3,
    title: "The Athletic Engine & Oblique Sling",
    subtitle: "Alactic Sprints & Transverse Power",
    focus: "Field Work",
    phase: "Athletic",
    muscleGroups: ["CNS", "Obliques", "Fascia", "Hips"],
    narrative:
      "Hypertrophy without kinetic application is cosmetically useless. This session maximizes the Reactive Strength Index, musculotendinous stiffness, and multi-planar agility. Depth jumps trigger a forceful stretch reflex via Type Ia afferent nerve fibers. Heavy rotational work leverages the Serape Effect to carve deeply etched, blocky obliques that function as an indestructible structural transmission system.",
    exercises: [
      {
        category: "warmup",
        name: "A-Skips & B-Skips",
        sets: "3",
        reps: "20 Meters",
        tempo: "Explosive",
        rest: "45s",
        rpe: "N/A",
        reasoning:
          "Drills neuromuscular timing for sprinting. Reinforces proper hip flexion and violent ground-strike mechanics, effectively linking the neural pathways between the cerebral cortex and lower limb motor units for impending maximum velocity sprint output.",
      },
      {
        category: "warmup",
        name: "Lateral Bounds",
        sets: "3",
        reps: "8 per leg",
        tempo: "1-0-X-1",
        rest: "60s",
        rpe: "8 (Intent)",
        reasoning:
          "Awakens the frontal plane stabilizers, particularly the gluteus medius and minimus. Prepares the ankle complex for multidirectional shock absorption and prevents lower extremity injury during high-speed agility changes by reinforcing lateral musculotendinous stiffness.",
      },
      {
        category: "main",
        name: "Maximum Velocity Sprints",
        sets: "6",
        reps: "30 Meters",
        tempo: "Absolute Max",
        rest: "180s–240s",
        rpe: "100% Output",
        reasoning:
          "Maximum speed sprinting is the ultimate fast-twitch muscle fiber activator. Keeping sprints under 5 seconds and mandating full 3–4 minute rest avoids glycolytic fatigue and CNS burnout, heavily developing the ATP-PCr system and forging dense, high-velocity athletic mass.",
      },
      {
        category: "main",
        name: "Depth Jumps",
        sets: "4",
        reps: "4",
        tempo: "Drop-X",
        rest: "120s",
        rpe: "Max Output",
        reasoning:
          "The gold standard for measuring and improving the Reactive Strength Index (RSI). The athlete drops from a box, absorbs the eccentric shock, and rebounds instantly. Minimizes electromechanical delay (amortization phase <0.25s) and dramatically increases tendon stiffness, translating to terrifying real-world agility.",
      },
      {
        category: "main",
        name: "Medicine Ball Rotational Slams",
        sets: "4",
        reps: "8 per side",
        tempo: "1-0-X-0",
        rest: "90s",
        rpe: "Max Velocity",
        reasoning:
          "Heavily utilizes the \"Serape Effect\" — the crossing of the anterior and posterior oblique slings from shoulder to contralateral hip. Violent rotation and slamming develops massive rotational torque and structural rigidity, directly transferring to devastating kicking and striking power.",
      },
      {
        category: "main",
        name: "Paloff Press (Anti-Rotation)",
        sets: "3",
        reps: "12 per side",
        tempo: "2-3-2-0",
        rest: "60s",
        rpe: "7 (Isometric)",
        reasoning:
          "A premier anti-rotation exercise that builds a deeply etched, blocky 8-pack. Requires the core to act as an indestructible Kevlar shield, resisting transverse plane forces and ensuring the spine is rigidly protected during violent real-world force transfers.",
      },
      {
        category: "cooldown",
        name: "90/90 Hip Internal/External Rotation",
        sets: "2",
        reps: "60s per side",
        tempo: "Static / Active",
        rest: "30s",
        rpe: "6 (Stretch)",
        reasoning:
          "Restores capsular mobility in the hips after extreme sprint and jump loading. Maintaining optimal internal and external rotation is paramount for preventing lower back compensation and ensuring kinetic chain efficiency during rotational torque generation.",
      },
    ],
  },
  {
    id: "day-4",
    index: 4,
    title: "V-Taper, Boulder Shoulders & Forearm Rising",
    subtitle: "3D Armor & Grip Masterpiece",
    focus: "3D Armor",
    phase: "Hypertrophy",
    muscleGroups: ["Delts", "Traps", "Triceps", "Forearms"],
    narrative:
      "Extreme width across the shoulder girdle and profound upper back density. The Kelso Shrug — hinging the torso parallel to the floor — shifts the line of pull to isolate the middle and lower trapezius fibers, driving massive upper-back thickness. Explicit \"rising\" (radial deviation) targets the weakest link in an opponent's kinetic chain.",
    exercises: [
      {
        category: "warmup",
        name: "Prone Y-T-W Raises",
        sets: "2",
        reps: "10 each",
        tempo: "2-0-1-2",
        rest: "45s",
        rpe: "N/A",
        reasoning:
          "Primes the entire rotator cuff complex (supraspinatus, infraspinatus, teres minor) and lower trapezius. Essential for glenohumeral stabilization prior to heavy overhead loading and intense scapular retraction, mitigating injury risk.",
      },
      {
        category: "warmup",
        name: "Plyometric Push-ups",
        sets: "3",
        reps: "6",
        tempo: "1-0-X-0",
        rest: "60s",
        rpe: "8 (Intent)",
        reasoning:
          "Facilitates upper-body neural drive. Exploits the neurophysiological stretch reflex to maximize force output and prime the triceps and anterior deltoids for heavy closed-chain pressing mechanics, shortening the amortization phase.",
      },
      {
        category: "main",
        name: "Wall-Supported Handstand Push-ups",
        sets: "4",
        reps: "AMRAP (Sub-Max)",
        tempo: "3-1-X-1",
        rest: "180s",
        rpe: "8–9 (Bodyweight)",
        reasoning:
          "A closed-kinetic-chain vertical press that requires total-body tension, extreme core rigidity, and raw anterior/medial deltoid strength. Develops dense shoulder mass that perfectly mirrors functional real-world pushing power.",
      },
      {
        category: "main",
        name: "Machine Lateral Raises (Myo-Rep Match)",
        sets: "1 Act. + 3–5 Myo",
        reps: "15–20 (Target), then Match",
        tempo: "3-1-X-1",
        rest: "15s (Myo) / 180s (Next Block)",
        rpe: "8–9 (70% 1RM)",
        reasoning:
          "The deltoids heavily favor metabolite accumulation for sarcoplasmic hypertrophy. Myo-rep matching ensures the lateral head is subjected to maximum effective reps near failure, expanding the shoulders to create the illusion of a remarkably tight waist and an exaggerated V-Taper.",
      },
      {
        category: "main",
        name: "Kelso Shrugs (Chest-Supported)",
        sets: "4",
        reps: "10–15",
        tempo: "3-1-1-3",
        rest: "90s",
        rpe: "8 (75% 1RM)",
        reasoning:
          "Requires hinging parallel to the floor and isolating scapular retraction. Biomechanically shifts the load to the middle/lower trapezius and rhomboids, building profound, thick back density that creates towering neck protection and upper-back armor.",
      },
      {
        category: "main",
        name: "Overhead Cable Triceps Extensions",
        sets: "4",
        reps: "12–15",
        tempo: "3-2-X-1",
        rest: "90s",
        rpe: "8 (75% 1RM)",
        reasoning:
          "Placing the shoulder in extreme flexion maximally stretches the long head of the triceps brachii. This position leverages stretch-mediated hypertrophy to produce significantly more muscle growth than traditional pushdowns, forging massive arm thickness.",
      },
      {
        category: "main",
        name: "Radial Deviation (Rising) with Judo Belt / Pin",
        sets: "4",
        reps: "10–15",
        tempo: "3-0-X-2",
        rest: "90s",
        rpe: "8 (75% 1RM)",
        reasoning:
          "\"Rising\" is the act of pointing the knuckles upward (radial deviation). In arm wrestling and combat grappling, dominating the riser breaks an opponent's structural alignment. A judo belt wrapped over the knuckles attached to a loading pin builds terrifying static strength in the extensor carpi radialis.",
      },
      {
        category: "cooldown",
        name: "Latissimus Dorsi Deep Hang",
        sets: "2",
        reps: "60s",
        tempo: "Static",
        rest: "60s",
        rpe: "Bodyweight",
        reasoning:
          "A passive dead hang that decompresses the lumbar spine and places the latissimus dorsi under extreme stretch. Prolonged elongation stimulates fascial stretching, creating room for lateral sarcoplasmic expansion while maintaining full glenohumeral mobility.",
      },
    ],
  },
  {
    id: "day-5",
    index: 5,
    title: "Unilateral Posterior Dominance & Transverse Agility",
    subtitle: "Hamstrings · Glute Medius · Multidirectional Power",
    focus: "Posterior Chain",
    phase: "Kinetic",
    muscleGroups: ["Hamstrings", "Glutes", "Calves", "Forearms"],
    narrative:
      "Heavy Romanian Deadlifts place immense passive mechanical tension on the hamstrings at long muscle lengths, mandating muscle fascicle lengthening (adding sarcomeres in series). The forearm masterpiece advances through Fat Gripz reverse curls — forcefully recruiting the brachioradialis while creating extreme static/crush grip strength.",
    exercises: [
      {
        category: "warmup",
        name: "Banded Lateral Walks",
        sets: "2",
        reps: "15 per side",
        tempo: "2-0-2-0",
        rest: "30s",
        rpe: "5",
        reasoning:
          "Isolates and fires the gluteus medius. Critical for preventing knee valgus (inward caving) during heavy unilateral loading and extreme lateral deceleration forces encountered in field work.",
      },
      {
        category: "warmup",
        name: "Single-Leg Broad Jumps",
        sets: "3",
        reps: "4 per leg",
        tempo: "1-0-X-1",
        rest: "60s",
        rpe: "9 (Intent)",
        reasoning:
          "Recruits high-threshold motor units unilaterally. Develops extreme horizontal force production and trains the neuromuscular system to stabilize and absorb shock efficiently upon landing on a single limb, bridging strength to field agility.",
      },
      {
        category: "main",
        name: "Heavy Romanian Deadlifts (RDL)",
        sets: "4",
        reps: "8",
        tempo: "4-2-X-1",
        rest: "180s",
        rpe: "8.5 (80% 1RM)",
        reasoning:
          "Places massive passive mechanical tension on the hamstrings at long muscle lengths. The 4-second eccentric and 2-second stretch pause mandate severe muscle fascicle lengthening. Builds dense, highly conditioned posterior mass crucial for sprint deceleration.",
      },
      {
        category: "main",
        name: "Deficit Bulgarian Split Squats",
        sets: "4",
        reps: "8–10 per leg",
        tempo: "3-2-X-1",
        rest: "120s",
        rpe: "8 (75% 1RM)",
        reasoning:
          "Unilateral lower-body loading that demands immense gluteus medius stabilization. Elevating the front foot (deficit) forces extreme hip flexion, heavily triggering stretch-mediated gluteal and vastus medialis hypertrophy while erasing bilateral strength deficits.",
      },
      {
        category: "main",
        name: "Transverse Bounding (Skater Jumps)",
        sets: "4",
        reps: "6 per leg",
        tempo: "1-0-X-0",
        rest: "120s",
        rpe: "Max Output",
        reasoning:
          "Bounding laterally and rotationally trains the fascia and musculotendinous units to act as multidirectional springs. Decreasing the amortization phase during frontal-plane landing develops elite agility and injury resilience for real-world kinetic scenarios.",
      },
      {
        category: "main",
        name: "Fat Gripz Reverse Curls",
        sets: "4",
        reps: "12–15",
        tempo: "3-0-X-1",
        rest: "90s",
        rpe: "8 (75% 1RM)",
        reasoning:
          "Thick bars force extreme hand activation (irradiation), deeply stimulating the brachioradialis and wrist extensors. Complements the cupping and pronation work, completing the \"coiled steel cable\" forearm aesthetic while fortifying the elbow joint against heavy loads.",
      },
      {
        category: "cooldown",
        name: "Supine Hamstring PNF Stretching",
        sets: "2",
        reps: "60s per leg",
        tempo: "PNF (Contract-Relax)",
        rest: "30s",
        rpe: "7 (Stretch)",
        reasoning:
          "Proprioceptive Neuromuscular Facilitation (PNF) overrides the Golgi tendon organ reflex, allowing for deeper elongation of the hamstring fascia. Prevents the massive mechanical tension of the RDLs from causing chronic posterior stiffness.",
      },
    ],
  },
  {
    id: "day-6",
    index: 6,
    title: "Systemic High-Threshold Potentiation",
    subtitle: "Explosive Full Body — Olympic Derivatives",
    focus: "Total Body Potentiation",
    phase: "Potentiation",
    muscleGroups: ["Full Body", "Traps", "Obliques", "Wrists"],
    narrative:
      "The final brutal mechanical exposure of the microcycle. The Hang Muscle Snatch links lower-body triple extension to explosive upper-body pulling, forcing the trapezius and posterior chain into total synchrony. The forearm masterpiece culminates with sledgehammer leverage drills — training explosive supination and unyielding pronation under heavy torque.",
    exercises: [
      {
        category: "warmup",
        name: "PVC Pipe Dislocates & Overhead Squats",
        sets: "2",
        reps: "10 each",
        tempo: "2-0-2-0",
        rest: "30s",
        rpe: "N/A",
        reasoning:
          "Flushes the entire kinetic chain with blood, grooves the overhead squat mobility pattern, and ensures the shoulders and hips possess full rotational freedom for Olympic pulling derivatives, mitigating impingement risk.",
      },
      {
        category: "warmup",
        name: "Medicine Ball Overhead Throws (Backward)",
        sets: "3",
        reps: "5",
        tempo: "1-0-X-0",
        rest: "60s",
        rpe: "9 (Intent)",
        reasoning:
          "Maximizes triple extension explosiveness. Ignites the CNS for total-body synchronous firing without accumulating mechanical fatigue, perfectly priming the neuromuscular system for the hang muscle snatch.",
      },
      {
        category: "main",
        name: "Hang Muscle Snatch",
        sets: "5",
        reps: "3–5",
        tempo: "2-0-X-0",
        rest: "180s",
        rpe: "60–70% 1RM",
        reasoning:
          "A phenomenally explosive lift that bridges the gap between the lower body's triple extension and the upper body's pulling mechanics. Recruits massive fast-twitch fibers in the traps, lateral deltoids, and posterior chain. Builds towering trapezius mass and terrifying total-body synchronization.",
      },
      {
        category: "main",
        name: "Heavy Sledgehammer Leverage Drills",
        sets: "4",
        reps: "10 per hand",
        tempo: "3-0-1-2",
        rest: "90s",
        rpe: "8",
        reasoning:
          "Holding a sledgehammer by the handle and rotating it slowly through supination and pronation builds unbreakable wrist structural integrity and extreme crush/leverage strength. Essential for real-world heavy object manipulation, striking stabilization, and elite grappling mechanics.",
      },
      {
        category: "main",
        name: "Heavy Landmine Russian Twists",
        sets: "4",
        reps: "10 per side",
        tempo: "2-0-X-1",
        rest: "90s",
        rpe: "8 (75% 1RM)",
        reasoning:
          "A barbell landmine creates a heavy, arcing lever. Forces the external and internal obliques to decelerate massive loads (eccentric phase) and violently reverse the force (concentric phase), maximizing the functional capability of the Anterior and Posterior Oblique Slings.",
      },
      {
        category: "main",
        name: "Extended Plank on Gymnastic Rings",
        sets: "3",
        reps: "60s+",
        tempo: "Isometric",
        rest: "60s",
        rpe: "9 (Isometric)",
        reasoning:
          "Extreme instability applied to an anti-extension core movement forces every micro-stabilizer in the abdominal wall and serratus anterior to fire maximally. Cements the \"bulletproof core\" aesthetic while bulletproofing the lumbar spine against shearing forces.",
      },
      {
        category: "cooldown",
        name: "Deep Global Fascial Release (Foam Rolling)",
        sets: "1",
        reps: "5 Mins",
        tempo: "Slow",
        rest: "N/A",
        rpe: "Variable",
        reasoning:
          "A total-body myofascial release protocol targeting the IT bands, lats, and thoracic spine. Reduces fascial adhesions built up over six days of extreme mechanical loading, paving the way for Day 7's cellular regeneration and preventing chronic tissue binding.",
      },
    ],
  },
  {
    id: "day-7",
    index: 7,
    title: "Systemic Recovery & Thermoregulatory Adaptation",
    subtitle: "India Context — Hydration · Fascia · Parasympathetic",
    focus: "Regeneration",
    phase: "Recovery",
    muscleGroups: ["CNS", "Fascia", "Autonomic"],
    narrative:
      "Muscle architecture is dismantled during training; it is reconstructed and supercompensated during recovery. In the Indian climate, high heat and humidity impede evaporative cooling. Day 7 aggressively targets hydration optimization, autonomic nervous system down-regulation, and passive structural elongation.",
    recovery: [
      {
        name: "Isotonic Thermoregulatory Rehydration",
        volume: "1–2 Liters",
        execution:
          "Early morning consumption of Nimbu Paani (lemon water with rock salt / sendha namak) or Coconut Water.",
        duration: "Continuous sipping",
        reasoning:
          "In the Indian climate, massive amounts of sodium (800–1,200mg/hr), potassium (150–300mg/hr), and chloride are lost via sweat during extreme exertion. Traditional Indian hydration methods like coconut water and nimbu paani naturally match the osmotic gradient of human blood, immediately restoring cell volumization, nerve function, and clearing metabolic waste far more efficiently than plain water.",
      },
      {
        name: "Long-Duration Static Stretching (Fascial Elongation)",
        volume: "1 Session",
        execution:
          "3–5 minute passive holds targeting the calves, hamstrings, and pectorals via orthoses or stretch boards.",
        duration: "30 Mins Total",
        reasoning:
          "Emerging research in stretch-mediated hypertrophy confirms that extremely long-duration static stretching induces mechanical tension that directly stimulates anabolic signaling pathways and protein synthesis independent of active lifting. Structurally expands the fascial casing, allowing for greater muscle volume without active CNS taxation.",
      },
      {
        name: "Cold Water Immersion (CWI) or Contrast Therapy",
        volume: "1 Session",
        execution:
          "10–15 minutes in 10–15°C water (or cool showers), targeting the lower limbs and torso.",
        duration: "15 Mins",
        reasoning:
          "Heat stress drastically elevates core temperature, prolonging CNS fatigue and inflammation in humid climates. CWI reduces skin temperature, constricts peripheral blood vessels to flush out metabolites, and rapidly shifts the body into a parasympathetic (rest and digest) state, drastically lowering circulating cortisol and halting catabolism.",
      },
      {
        name: "Diaphragmatic Box Breathing",
        volume: "1 Session",
        execution: "4s Inhale, 4s Hold, 4s Exhale, 4s Hold.",
        duration: "10 Mins",
        reasoning:
          "Conscious, deep diaphragmatic breathing directly stimulates the vagus nerve. Forcefully commands the autonomic nervous system to exit the sympathetic \"fight or flight\" mode triggered by six days of brutal lifting, maximizing the release of natural growth hormone (GH) and accelerating CNS baseline restoration for the upcoming microcycle.",
      },
    ],
  },
];

export const getDay = (id: string) => DAYS.find((d) => d.id === id);
