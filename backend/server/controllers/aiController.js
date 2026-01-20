// controllers/aiController.js
const Candidate = require("../models/CandidateModel");
const Job = require("../models/Job");
const Application = require("../models/Application");
const {
  extractSkills,
  extractExperience,
  analyzePersonality,
  computeCompatibility,
  getKPIs,
} = require("../services/AiAnalysis");

// POST /api/ai/analyze-cv
exports.analyzeCV = async (req, res) => {
  try {
    const { text, jobId } = req.body;
    if (!text)
      return res.status(400).json({ message: "CV/profile text required" });
    let jobSkills = [];
    let jobExp = 1;
    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        jobSkills = job.requirements || [];
        jobExp = 1; // Could be improved if job has exp field
      }
    }
    const skills = await extractSkills(text);
    const experience = await extractExperience(text);
    const personality = analyzePersonality(text);
    const compatibility = computeCompatibility(
      skills,
      jobSkills,
      experience.years,
      jobExp
    );
    res.json({ skills, experience, personality, compatibility });
  } catch (err) {
    res.status(500).json({ message: "AI analysis failed", error: err.message });
  }
};

// GET /api/ai/rank-candidates/:jobId
exports.rankCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const candidates = await Candidate.find().populate("userId");
    // For each candidate, compute compatibility
    const ranked = await Promise.all(
      candidates.map(async (c) => {
        const text = [
          c.headline,
          c.skills.join(" "),
          c.about,
          (c.experience || []).map((e) => e.title + e.company).join(" "),
        ].join(" ");
        const skills = await extractSkills(text);
        const exp = await extractExperience(text);
        const score = computeCompatibility(
          skills,
          job.requirements || [],
          exp.years,
          1
        );
        return {
          candidate: {
            id: c._id,
            name: c.userId?.name,
            email: c.userId?.email,
            skills: c.skills,
            experience: c.experience,
            headline: c.headline,
          },
          score,
        };
      })
    );
    ranked.sort((a, b) => b.score - a.score);
    res.json(ranked);
  } catch (err) {
    res.status(500).json({ message: "Ranking failed", error: err.message });
  }
};

// GET /api/ai/kpis
exports.getKPIs = async (req, res) => {
  try {
    const kpis = await getKPIs(Application, Candidate, Job);
    res.json(kpis);
  } catch (err) {
    res.status(500).json({ message: "KPI fetch failed", error: err.message });
  }
};
