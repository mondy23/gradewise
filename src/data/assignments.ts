import { Assignment } from '../types/grading';

export const assignments: Assignment[] = [
{
  id: 'bio-1',
  courseId: 'bio',
  title: 'Cellular Respiration Quiz',
  type: 'Short answer',
  dueDate: '2026-10-14T23:59:00',
  maxPoints: 20,
  instructions:
  'Answer each question in 2–4 complete sentences.\n\n1. Describe the three main stages of cellular respiration and where each occurs in the cell.\n2. Explain why oxygen is called the final electron acceptor.\n3. Compare the ATP yield of aerobic respiration to fermentation.',
  answerKey:
  '1. Glycolysis (cytoplasm), the Krebs / citric acid cycle (mitochondrial matrix), and the electron transport chain (inner mitochondrial membrane).\n2. Oxygen accepts electrons at the end of the ETC and combines with H⁺ to form water; without it the chain backs up and ATP production stops.\n3. Aerobic respiration yields roughly 30–38 ATP per glucose; fermentation yields only 2 ATP (from glycolysis).',
  rubric: [
  { id: 'bio1-c1', title: 'Stages & locations', description: 'Names all three stages and the correct cellular location of each.', points: 8, source: 'teacher' },
  { id: 'bio1-c2', title: 'Role of oxygen', description: 'Explains oxygen accepting electrons at the end of the ETC and forming water.', points: 6, source: 'teacher' },
  { id: 'bio1-c3', title: 'ATP comparison', description: 'Gives approximate ATP yields for both processes.', points: 4, source: 'teacher' },
  { id: 'bio1-c4', title: 'Scientific language', description: 'Uses accurate vocabulary and complete sentences.', points: 2, source: 'teacher' }],

  samples: [
  { text: 'Cellular respiration has three stages. Glycolysis happens in the cytoplasm and splits glucose into pyruvate. The Krebs cycle happens in the mitochondrial matrix, and the electron transport chain is on the inner mitochondrial membrane. Oxygen is the final electron acceptor because it picks up electrons at the end of the ETC and joins with hydrogen to make water. Aerobic respiration makes about 36 ATP, while fermentation only makes 2.', quality: 0.95, confidence: 0.94 },
  { text: 'The stages are glycolysis, the Krebs cycle, and the electron transport chain. Glycolysis is in the cytoplasm and the other two are in the mitochondria. Oxygen is needed at the end so electrons have somewhere to go, otherwise everything stops. Aerobic gives way more ATP than fermentation (around 36 vs 2).', quality: 0.8, confidence: 0.88 },
  { text: 'Glycolysis occurs in the cytoplasm, the Krebs cycle in the matrix of the mitochondria, and the electron transport chain along the inner membrane. Oxygen is the final electron acceptor — it takes the electrons at the end of the chain and forms water, which keeps the chain moving. Aerobic respiration produces roughly 32–36 ATP, compared to just 2 ATP for fermentation.', quality: 0.9, confidence: 0.91 },
  { text: 'First is glycolysis then the citric acid cycle then the ETC. Oxygen is important because we breathe it in and it helps make energy for the cell. Fermentation is what happens in muscles when they get tired and makes lactic acid.', quality: 0.52, confidence: 0.62 },
  { text: 'Glycolysis (cytosol) → pyruvate oxidation + Krebs (matrix) → oxidative phosphorylation (cristae). O₂ is the terminal oxidant: its high electronegativity pulls electrons through the chain, keeping the proton gradient going for ATP synthase. Net yield is closer to ~30 ATP using modern P/O ratios, vs 2 for fermentation.', quality: 0.82, confidence: 0.67, flag: 'off-key' },
  { text: 'Glycolysis splits glucose in the cytoplasm. Then the Krebs cycle and electron transport chain happen in the mitochondria. Oxygen accepts the electrons at the end and makes water. Aerobic makes about 36 ATP and fermentation makes 2.', quality: 0.85, confidence: 0.9 },
  { text: '1. Glycolysis, Krebs cycle, electron transport chain. Glycolysis is in the cytoplasm.\n2. Oxygen is the', quality: 0.3, confidence: 0.82, flag: 'incomplete' },
  { text: '[Handwritten scan] Three stages: glycolysis in cytoplasm, Krebs cycle in mitochondria, ETC in the … [illegible] … oxygen accepts electrons making water. Aerobic ~36 ATP, fermentation 2 ATP.', quality: 0.72, confidence: 0.58, flag: 'unreadable', failsFirst: true, attachment: 'handwritten_scan.pdf' },
  { text: 'Glycolysis is in the cytoplasm, Krebs cycle in the mitochondrial matrix, ETC on the inner membrane. Oxygen is the last stop for electrons and makes water. Aerobic respiration is about 36 ATP, fermentation is 2 because only glycolysis runs.', quality: 0.88, confidence: 0.9 },
  { text: '', quality: 0, confidence: 0.99, flag: 'missing' }]

},
{
  id: 'bio-2',
  courseId: 'bio',
  title: 'Enzyme Activity Lab Report',
  type: 'Lab report',
  dueDate: '2026-10-10T23:59:00',
  maxPoints: 30,
  instructions:
  'Submit your lab report for the catalase activity experiment.\n\nInclude: a hypothesis, a data table and graph of reaction rate vs. temperature, an analysis of the trend you observed, and a conclusion that discusses at least two sources of error.',
  answerKey:
  'Expected trend: reaction rate increases from 10°C to an optimum near 35–40°C, then drops sharply above ~50°C as catalase denatures. Strong analysis connects the decline to changes in the active site shape. Error sources may include inconsistent potato sample size, timing errors, and temperature drift during trials.',
  suggestedCriteria: [
  { id: 'bio2-s1', title: 'Hypothesis', description: 'Testable hypothesis that predicts how temperature affects enzyme activity.', points: 5, source: 'ai' },
  { id: 'bio2-s2', title: 'Data & graph', description: 'Organized data table and a correctly labeled graph of rate vs. temperature.', points: 10, source: 'ai' },
  { id: 'bio2-s3', title: 'Analysis of trend', description: 'Identifies the optimum and explains the decline through denaturation of the active site.', points: 10, source: 'ai' },
  { id: 'bio2-s4', title: 'Conclusion & error', description: 'Conclusion addresses the hypothesis and discusses at least two sources of error.', points: 5, source: 'ai' }],

  samples: [
  { text: 'Hypothesis: If temperature increases, catalase activity will increase until about 37°C and then decrease. Our data showed the fastest rate at 37°C (4.2 mL O₂/min) and almost no activity at 60°C. This is because high heat denatures the enzyme and changes the active site so hydrogen peroxide no longer fits. Errors: potato pieces weren’t the same size and the water bath cooled during trials.', quality: 0.93, confidence: 0.9, attachment: 'lab_graph.png' },
  { text: 'We thought higher temperature would make it faster. The graph goes up and then down. At 60 degrees it barely bubbled. The enzyme probably broke. One error was timing.', quality: 0.55, confidence: 0.68 },
  { text: 'Hypothesis: Catalase works best at body temperature. Rate peaked at 40°C then fell, which shows denaturation of the protein structure. Sources of error include temperature drift and measuring foam height by eye.', quality: 0.84, confidence: 0.86, attachment: 'data_table.xlsx' },
  { text: 'Hypothesis: temperature affects catalase. Data table attached.', quality: 0.28, confidence: 0.8, flag: 'incomplete', attachment: 'data_table.xlsx' },
  { text: 'The rate increased steadily up to 45°C. Our results suggest catalase from potatoes may have a higher optimum than human catalase, which could be an adaptation. Errors: uneven sample mass, inconsistent peroxide concentration.', quality: 0.78, confidence: 0.64, flag: 'off-key' },
  { text: '', quality: 0, confidence: 0.99, flag: 'missing' }]

},
{
  id: 'bio-3',
  courseId: 'bio',
  title: 'Photosynthesis Exit Ticket',
  type: 'Exit ticket',
  dueDate: '2026-10-16T15:00:00',
  maxPoints: 10,
  instructions: 'In your own words: what are the inputs and outputs of photosynthesis, and why do plants need both the light-dependent reactions and the Calvin cycle?',
  samples: [
  { text: 'Inputs are carbon dioxide, water and light. Outputs are glucose and oxygen. The light reactions make ATP and NADPH, which the Calvin cycle uses to build sugar from CO₂.', quality: 0.94, confidence: 0.86 },
  { text: 'Plants take in sunlight, water, and CO₂ and make sugar and oxygen. They need both parts because one makes energy and the other makes the food.', quality: 0.74, confidence: 0.78 },
  { text: 'Photosynthesis uses light to make food.', quality: 0.3, confidence: 0.72, flag: 'incomplete' },
  { text: 'CO₂ + H₂O + light → C₆H₁₂O₆ + O₂. The light reactions split water and charge ATP/NADPH; the Calvin cycle fixes carbon using that energy.', quality: 0.9, confidence: 0.84 },
  { text: '', quality: 0, confidence: 0.99, flag: 'missing' }]

},
{
  id: 'hist-1',
  courseId: 'hist',
  title: 'Causes of WWI — Short Essay',
  type: 'Essay',
  dueDate: '2026-10-12T23:59:00',
  maxPoints: 25,
  instructions: 'Write a 400–600 word essay arguing which long-term cause (militarism, alliances, imperialism, or nationalism) contributed most to the outbreak of World War I. Use at least two specific pieces of historical evidence.',
  rubric: [
  { id: 'hist1-c1', title: 'Thesis', description: 'Clear, arguable claim that ranks one cause above others.', points: 5, source: 'teacher' },
  { id: 'hist1-c2', title: 'Evidence', description: 'At least two specific, accurate historical examples.', points: 10, source: 'teacher' },
  { id: 'hist1-c3', title: 'Analysis', description: 'Explains how the evidence supports the thesis and addresses a counterargument.', points: 7, source: 'teacher' },
  { id: 'hist1-c4', title: 'Writing', description: 'Organized paragraphs, transitions, and minimal errors.', points: 3, source: 'teacher' }],

  samples: [
  { text: 'While the assassination of Archduke Franz Ferdinand sparked the war, the alliance system turned a regional conflict into a world war. Austria-Hungary’s ultimatum to Serbia pulled in Russia, which triggered Germany’s declaration of war and the Schlieffen Plan’s invasion of Belgium, bringing Britain in under the 1839 Treaty of London…', quality: 0.92, confidence: 0.85 },
  { text: 'Militarism was the biggest cause because countries were building huge armies and navies. Britain and Germany had a naval race with the Dreadnought. Everyone was ready for war so when it started it got big fast.', quality: 0.7, confidence: 0.77 },
  { text: 'Nationalism caused WWI. People loved their countries a lot and wanted to be the best.', quality: 0.35, confidence: 0.74, flag: 'incomplete' },
  { text: 'I argue that imperial rivalry in Africa — especially the Moroccan Crises of 1905 and 1911 — mattered more than alliances, because it hardened Anglo-French cooperation against Germany years before 1914…', quality: 0.86, confidence: 0.63, flag: 'off-key' },
  { text: '', quality: 0, confidence: 0.99, flag: 'missing' }]

},
{
  id: 'hist-2',
  courseId: 'hist',
  title: 'Industrial Revolution DBQ',
  type: 'Essay',
  dueDate: '2026-10-03T23:59:00',
  maxPoints: 40,
  previouslyGraded: { date: 'Oct 6', average: 78 },
  instructions: 'Using Documents A–F, evaluate the extent to which the Industrial Revolution improved living conditions for urban workers in Britain between 1780 and 1850.',
  answerKey: 'Strong responses take a qualified position (e.g. improvements in goods and wages over time, but worsened housing, sanitation, and child labor in the short term). They cite at least four documents, source at least two (author POV, purpose), and bring in outside evidence such as the Factory Act of 1833 or Chadwick’s 1842 sanitary report.',
  suggestedCriteria: [
  { id: 'hist2-s1', title: 'Thesis & position', description: 'Qualified, defensible claim responding to the prompt.', points: 8, source: 'ai' },
  { id: 'hist2-s2', title: 'Document use', description: 'Uses at least four documents accurately to support the argument.', points: 14, source: 'ai' },
  { id: 'hist2-s3', title: 'Sourcing', description: 'Analyzes author point of view or purpose for at least two documents.', points: 10, source: 'ai' },
  { id: 'hist2-s4', title: 'Outside evidence', description: 'Brings in relevant evidence beyond the documents.', points: 8, source: 'ai' }],

  samples: [
  { text: 'The Industrial Revolution improved conditions in the long run but made them worse in the short term. Document B shows overcrowded housing in Manchester, while Document E shows rising real wages after 1820. Chadwick’s report (outside evidence) documented the sanitation crisis…', quality: 0.9, confidence: 0.84 },
  { text: 'Life got worse for workers. Document A shows kids working in factories and Document C shows pollution. It was bad.', quality: 0.45, confidence: 0.69 },
  { text: 'Conditions improved for some and not others. Documents A, D and F show the divide. The author of Document D was a factory owner so he might exaggerate how good it was.', quality: 0.76, confidence: 0.8 },
  { text: '', quality: 0, confidence: 0.99, flag: 'missing' }]

},
{
  id: 'alg-1',
  courseId: 'alg',
  title: 'Quadratic Functions Problem Set',
  type: 'Problem set',
  dueDate: '2026-10-08T23:59:00',
  maxPoints: 24,
  previouslyGraded: { date: 'Oct 9', average: 82 },
  instructions: 'Show all work.\n\n1. Find the vertex and axis of symmetry of f(x) = 2x² − 8x + 3.\n2. Solve x² + 6x − 7 = 0 by factoring.\n3. Use the quadratic formula to solve 3x² − 4x − 2 = 0.\n4. A ball’s height is h(t) = −16t² + 64t + 5. Find its maximum height.',
  answerKey: '1. Vertex (2, −5); axis x = 2.\n2. (x + 7)(x − 1) = 0 → x = −7, x = 1.\n3. x = (2 ± √10) / 3.\n4. t = 2 s, maximum height 69 ft.',
  rubric: [
  { id: 'alg1-c1', title: 'Vertex & axis', description: 'Correct vertex and axis with work shown.', points: 6, source: 'teacher' },
  { id: 'alg1-c2', title: 'Factoring', description: 'Correct factors and both solutions.', points: 6, source: 'teacher' },
  { id: 'alg1-c3', title: 'Quadratic formula', description: 'Correct substitution and simplified radical answer.', points: 6, source: 'teacher' },
  { id: 'alg1-c4', title: 'Application', description: 'Finds time of max height and the maximum height.', points: 6, source: 'teacher' }],

  samples: [
  { text: '1. x = −b/2a = 8/4 = 2, f(2) = 8 − 16 + 3 = −5 → vertex (2, −5), axis x = 2\n2. (x+7)(x−1) = 0 → x = −7, 1\n3. x = (4 ± √40)/6 = (2 ± √10)/3\n4. t = 64/32 = 2, h(2) = −64 + 128 + 5 = 69 ft', quality: 0.97, confidence: 0.95 },
  { text: '1. vertex (2, −5)\n2. x = 7, x = −1\n3. x = (4 ± √40)/6\n4. 69 ft', quality: 0.68, confidence: 0.74 },
  { text: '1. (2, −5), x = 2\n2. x = −7 and 1\n3. I got (2 ± √10)/3\n4. max at t = 2, h = 69', quality: 0.9, confidence: 0.92 },
  { text: '1. completed the square: 2(x − 2)² − 5, so vertex (2, −5)\n2. x = −7, 1\n3. (2 ± √10)/3\n4. graphed it on Desmos, max ≈ 69', quality: 0.86, confidence: 0.66, flag: 'off-key' },
  { text: '1. vertex (2, −5)\n2. x = −7, 1', quality: 0.4, confidence: 0.86, flag: 'incomplete' },
  { text: '', quality: 0, confidence: 0.99, flag: 'missing' }]

},
{
  id: 'alg-2',
  courseId: 'alg',
  title: 'Logarithms Check-in',
  type: 'Short answer',
  dueDate: '2026-10-15T23:59:00',
  maxPoints: 12,
  instructions: '1. Evaluate log₂ 32.\n2. Rewrite 5³ = 125 in logarithmic form.\n3. Solve log₃(x + 1) = 2.',
  answerKey: '1. 5\n2. log₅ 125 = 3\n3. x + 1 = 9 → x = 8',
  suggestedCriteria: [
  { id: 'alg2-s1', title: 'Evaluate logarithm', description: 'Correctly evaluates log₂ 32 = 5.', points: 4, source: 'ai' },
  { id: 'alg2-s2', title: 'Exponential ↔ log form', description: 'Correctly rewrites the equation in logarithmic form.', points: 4, source: 'ai' },
  { id: 'alg2-s3', title: 'Solve log equation', description: 'Converts to exponential form and solves for x = 8.', points: 4, source: 'ai' }],

  samples: [
  { text: '1. 5\n2. log₅(125) = 3\n3. 3² = x + 1 → x = 8', quality: 0.98, confidence: 0.96 },
  { text: '1. 5\n2. log₃ 125 = 5\n3. x = 8', quality: 0.66, confidence: 0.79 },
  { text: '1. 16\n2. log₅ 125 = 3\n3. x = 5', quality: 0.38, confidence: 0.69 },
  { text: '1. 5\n2. log₅ 125 = 3\n3. x = 8', quality: 0.95, confidence: 0.95 },
  { text: '', quality: 0, confidence: 0.99, flag: 'missing' }]

}];