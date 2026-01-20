// services/AiAnalysis.js

// NOTE: This now uses HuggingFace Inference API for real NER.
const axios = require("axios");
require("dotenv").config();

// Helper: Call HuggingFace Inference API (NER model)
async function callHuggingFaceNER(text) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const model = "dslim/bert-base-NER";
  const routerUrl = `https://router.huggingface.co/queue/submit`;
  const directUrl = `https://api-inference.huggingface.com/models/${model}`;
  try {
    // Try router endpoint first
    const submitResponse = await axios.post(
      routerUrl,
      {
        inputs: text,
        model,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );
    const jobId = submitResponse.data.id;
    if (!jobId) throw new Error("No job ID returned from HuggingFace router");

    // Poll for result
    const statusUrl = `https://router.huggingface.co/queue/status/${jobId}`;
    let result = null;
    for (let i = 0; i < 10; i++) {
      await new Promise((res) => setTimeout(res, 1000));
      const statusResponse = await axios.get(statusUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      });
      if (
        statusResponse.data.status === "completed" &&
        statusResponse.data.result
      ) {
        result = statusResponse.data.result;
        break;
      } else if (statusResponse.data.status === "failed") {
        throw new Error("HuggingFace job failed");
      }
    }
    if (!result) throw new Error("Timed out waiting for HuggingFace result");
    return result;
  } catch (err) {
    console.error(
      "HuggingFace API error (router):",
      err.response?.data || err.message
    );
    // Fallback: try direct model endpoint
    try {
      const response = await axios.post(
        directUrl,
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 20000,
        }
      );
      return response.data;
    } catch (err2) {
      console.error(
        "HuggingFace API error (direct):",
        err2.response?.data || err2.message
      );
      return null;
    }
  }
}

// Extract skills from text using HuggingFace NER
async function extractSkills(text) {
  const ner = await callHuggingFaceNER(text);
  if (!ner || !Array.isArray(ner)) return [];
  // Extract entities labeled as 'ORG', 'MISC', or custom skill-like
  const skills = ner
    .filter((e) => e.entity_group === "MISC" || e.entity_group === "ORG")
    .map((e) => e.word)
    .filter((v, i, arr) => arr.indexOf(v) === i);
  return skills;
}

// Extract experience using HuggingFace NER (for job titles), plus regex for years
async function extractExperience(text) {
  const ner = await callHuggingFaceNER(text);
  let titles = [];
  if (ner && Array.isArray(ner)) {
    titles = ner
      .filter((e) => e.entity_group === "PER" || e.entity_group === "ORG")
      .map((e) => e.word)
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }
  // Look for years of experience
  const yearsMatch = text.match(/([0-9]+)\s*(ans|years?)/i);
  const years = yearsMatch ? parseInt(yearsMatch[1], 10) : null;
  return { years, titles };
}

// Analyze personality (mockup: count adjectives, exclamation marks, etc.)
function analyzePersonality(text) {
  const enthusiasm = (text.match(/!/g) || []).length;
  const adjectives = (
    text.match(
      /\b(creative|dynamic|motivated|rigorous|autonomous|team player)\b/gi
    ) || []
  ).length;
  return {
    enthusiasm,
    adjectives,
    summary:
      enthusiasm > 2
        ? "Enthusiastic"
        : adjectives > 2
        ? "Descriptive"
        : "Neutral",
  };
}

// Compute compatibility score (mockup: overlap of skills, years, etc.)
function computeCompatibility(
  candidateSkills,
  jobSkills,
  candidateExp,
  jobExp
) {
  const skillOverlap = candidateSkills.filter((skill) =>
    jobSkills.includes(skill)
  ).length;
  const skillScore = jobSkills.length ? skillOverlap / jobSkills.length : 0;
  const expScore =
    candidateExp && jobExp ? Math.min(candidateExp / jobExp, 1) : 0.5;
  // Weighted sum
  return Math.round((skillScore * 0.7 + expScore * 0.3) * 100);
}

// Analytics KPIs (mockup)
async function getKPIs(Application, Candidate, Job) {
  const totalApplications = await Application.countDocuments();
  const totalCandidates = await Candidate.countDocuments();
  const totalJobs = await Job.countDocuments();
  // Average compatibility (mockup: random)
  const avgCompatibility = Math.round(Math.random() * 100);
  // Diversity (mockup: count unique locations)
  const locations = await Candidate.distinct("location");
  return {
    totalApplications,
    totalCandidates,
    totalJobs,
    avgCompatibility,
    diversity: locations.length,
  };
}

module.exports = {
  extractSkills,
  extractExperience,
  analyzePersonality,
  computeCompatibility,
  getKPIs,
};
