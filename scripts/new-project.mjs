import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Usage: npm run studio:new-project -- <kebab-case-slug>");
  process.exit(1);
}

const projectsDir = path.join(root, "projects");
const file = path.join(projectsDir, `${slug}.json`);
if (fs.existsSync(file)) {
  console.error(`projects/${slug}.json already exists.`);
  process.exit(1);
}

const title = slug.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
const today = new Date().toISOString().slice(0, 10);

const project = {
  slug,
  title,
  description: "Describe the project and why it matters.",
  status: "exploring",
  updated: today,
  currentVersion: "baseline",
  tags: [],
  reviewQuestions: [],
  versions: [
    {
      id: "baseline",
      name: "Baseline",
      status: "Current",
      whatChanged: "Initial accepted baseline.",
      question: "What should this first coded baseline help us understand?",
      decisionRationale: "This is the accepted starting point until a candidate is deliberately promoted.",
      deploymentUrl: `/playground/${slug}`
    }
  ],
  decisionLog: [],
  context: {
    problem: "Describe the problem.",
    intendedOutcome: "Describe the intended outcome.",
    users: ["Describe the primary user."],
    workflow: "Describe the relevant workflow.",
    currentDirection: "Describe the current design direction.",
    constraints: [],
    acceptedDecisions: [],
    openQuestions: []
  }
};

fs.mkdirSync(projectsDir, { recursive: true });
fs.writeFileSync(file, JSON.stringify(project, null, 2) + "\n");
console.log(`Created projects/${slug}.json. Edit the manifest, then run npm run registry.`);
