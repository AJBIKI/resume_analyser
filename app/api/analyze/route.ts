// import { NextResponse } from "next/server";
// // Fix textstat import
// import * as textstatModule from "textstat";
// const textstat = textstatModule;
// import { callOpenAIApi } from "@/app/lib/openai-api";
// // Create custom pdf-parser to avoid ENOENT error
// import { parsePdf } from "@/app/lib/pdf-parser";
// // Create type declaration for text-readability module
// import rs from 'text-readability';

// // Export AnalysisResult interface for use in other files
// export interface AnalysisResult {
//   matchScore: number;
//   matchingKeywords: string[];
//   missingKeywords: string[];
//   atsIssues: string[];
//   actionVerbFeedback: Array<{ bullet: string; feedback: string }>;
//   readabilityScore: number;
//   grammarIssues: string[];
// }

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const resumeFile = formData.get("resume") as File | null;
//     const jobDescription = formData.get("jobDescription") as string;

//     console.log("FormData received:", {
//       resumeFile: !!resumeFile,
//       jobDescription: !!jobDescription,
//     });

//     if (!resumeFile || !jobDescription) {
//       return NextResponse.json(
//         { error: "Resume file and job description are required" },
//         { status: 400 }
//       );
//     }

//     // Verify file type
//     if (resumeFile.type !== "application/pdf") {
//       return NextResponse.json(
//         { error: "Please upload a PDF file" },
//         { status: 400 }
//       );
//     }

//     // ✅ Extract text from PDF using our custom pdf-parser
//     let resumeText: string;
//     try {
//       const buffer = Buffer.from(await resumeFile.arrayBuffer());
//       const parsed = await parsePdf(buffer);
//       resumeText = parsed.text;

//       if (!resumeText.trim()) {
//         return NextResponse.json(
//           {
//             error:
//               "No text could be extracted from the PDF. Please upload a text-based PDF (not scanned or image-based).",
//           },
//           { status: 400 }
//         );
//       }

//       console.log("Extracted resume text length:", resumeText.length);
//     } catch (error) {
//       console.error("PDF parsing error:", error);
//       return NextResponse.json(
//         {
//           error:
//             "Failed to parse PDF file. Ensure it's a valid, text-based PDF.",
//         },
//         { status: 500 }
//       );
//     }

//     // ✅ Basic ATS checks
//     const atsIssues: string[] = [];
//     if (!resumeText.match(/(Work Experience|Experience)/i)) {
//       atsIssues.push("Missing 'Work Experience' section.");
//     }
//     if (!resumeText.match(/Education/i)) {
//       atsIssues.push("Missing 'Education' section.");
//     }
//     if (!resumeText.includes("@")) {
//       atsIssues.push("Missing email in 'Contact Info' section.");
//     }

//     // ✅ Readability score (Flesch-Kincaid)
//     let readabilityScore = 0;
//     try {
//       readabilityScore = rs.fleschKincaidGrade(resumeText);
//       console.log("Readability score:", readabilityScore);
//     } catch (error) {
//       console.error("Readability score error:", error);
//       atsIssues.push("Unable to calculate readability score due to text issues.");
//     }

//     // 🚀 FIXED: Structured OpenAI Prompt for consistent scoring
//     const openAIPrompt = `
// You are a resume scoring system. Score this resume against the job description using EXACTLY this scoring methodology:

// SCORING BREAKDOWN (Total = 100 points):
// 1. Technical Skills Match (40 points): Count exact matches of technical skills/tools mentioned in job description
// 2. Experience Level (25 points): Years of experience vs required (0-2 years=10pts, 3-5 years=20pts, 5+ years=25pts)
// 3. Education Match (15 points): Degree requirements met (Yes=15pts, Partial=8pts, No=0pts)
// 4. Industry Experience (10 points): Same industry background (Yes=10pts, Related=5pts, No=0pts)  
// 5. Keywords Coverage (10 points): How many job description keywords appear in resume (High=10pts, Medium=5pts, Low=0pts)

// INSTRUCTIONS:
// - Count EXACT matches only, be strict
// - Use consistent scoring rules above
// - Return ONLY valid JSON, no explanations
// - Always include all required fields

// Resume: """${resumeText.slice(0, 2000)}"""
// Job Description: """${jobDescription.slice(0, 2000)}"""

// Return this EXACT JSON structure:
// {
//   "matchScore": [sum of all 5 categories above],
//   "matchingKeywords": [array of exact keyword matches found],
//   "missingKeywords": [array of important job keywords not in resume],
//   "actionVerbFeedback": [{"bullet": "example bullet point", "feedback": "use stronger action verb like 'Achieved'"}],
//   "grammarIssues": [array of specific grammar errors found]
// }
//     `;

//     // 🔥 CONSISTENCY FIX: Add temperature=0 for deterministic responses
//     const { response, error } = await callOpenAIApi(openAIPrompt, {
//       temperature: 0,
//       max_tokens: 1500
//     });

//     if (error) {
//       console.error("OpenAI API error:", error);
//       return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
//     }

//     // ✅ Parse OpenAI JSON
//     let analysis: AnalysisResult;
//     try {
//       analysis = JSON.parse(response);
      
//       // 🛡️ SAFETY: Ensure score is within bounds
//       if (analysis.matchScore > 100) analysis.matchScore = 100;
//       if (analysis.matchScore < 0) analysis.matchScore = 0;
      
//     } catch (error) {
//       console.error("JSON parsing error:", error);
//       return NextResponse.json(
//         { error: "Failed to parse analysis response" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       matchScore: analysis.matchScore || 0,
//       matchingKeywords: analysis.matchingKeywords || [],
//       missingKeywords: analysis.missingKeywords || [],
//       atsIssues,
//       actionVerbFeedback: analysis.actionVerbFeedback || [],
//       readabilityScore,
//       grammarIssues: analysis.grammarIssues || [],
//     });
//   } catch (error) {
//     console.error("API error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
// Fix textstat import
import * as textstatModule from "textstat";
const textstat = textstatModule;
import { callOpenAIApi } from "@/app/lib/openai-api";
// Create custom pdf-parser to avoid ENOENT error
import { parsePdf } from "@/app/lib/pdf-parser";

// Type declaration for text-readability (inline fix)
declare module 'text-readability' {
  export function fleschKincaidGrade(text: string): number;
}

import rs from 'text-readability';

// Export AnalysisResult interface for use in other files
export interface AnalysisResult {
  matchScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  atsIssues: string[];
  actionVerbFeedback: Array<{ bullet: string; feedback: string }>;
  readabilityScore: number;
  grammarIssues: string[];
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string;

    console.log("FormData received:", {
      resumeFile: !!resumeFile,
      jobDescription: !!jobDescription,
    });

    if (!resumeFile || !jobDescription) {
      return NextResponse.json(
        { error: "Resume file and job description are required" },
        { status: 400 }
      );
    }

    // Verify file type
    if (resumeFile.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Please upload a PDF file" },
        { status: 400 }
      );
    }

    // ✅ Extract text from PDF using our custom pdf-parser
    let resumeText: string;
    try {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      const parsed = await parsePdf(buffer);
      resumeText = parsed.text;

      if (!resumeText.trim()) {
        return NextResponse.json(
          {
            error:
              "No text could be extracted from the PDF. Please upload a text-based PDF (not scanned or image-based).",
          },
          { status: 400 }
        );
      }

      console.log("Extracted resume text length:", resumeText.length);
    } catch (error) {
      console.error("PDF parsing error:", error);
      return NextResponse.json(
        {
          error:
            "Failed to parse PDF file. Ensure it's a valid, text-based PDF.",
        },
        { status: 500 }
      );
    }

    // ✅ Basic ATS checks
    const atsIssues: string[] = [];
    if (!resumeText.match(/(Work Experience|Experience)/i)) {
      atsIssues.push("Missing 'Work Experience' section.");
    }
    if (!resumeText.match(/Education/i)) {
      atsIssues.push("Missing 'Education' section.");
    }
    if (!resumeText.includes("@")) {
      atsIssues.push("Missing email in 'Contact Info' section.");
    }

    // ✅ Readability score (Flesch-Kincaid)
    let readabilityScore = 0;
    try {
      readabilityScore = rs.fleschKincaidGrade(resumeText);
      console.log("Readability score:", readabilityScore);
    } catch (error) {
      console.error("Readability score error:", error);
      atsIssues.push("Unable to calculate readability score due to text issues.");
    }

    // 🚀 FIXED: Structured OpenAI Prompt for consistent scoring
    const openAIPrompt = `
You are a resume scoring system. Score this resume against the job description using EXACTLY this scoring methodology:

SCORING BREAKDOWN (Total = 100 points):
1. Technical Skills Match (40 points): Count exact matches of technical skills/tools mentioned in job description
2. Experience Level (25 points): Years of experience vs required (0-2 years=10pts, 3-5 years=20pts, 5+ years=25pts)
3. Education Match (15 points): Degree requirements met (Yes=15pts, Partial=8pts, No=0pts)
4. Industry Experience (10 points): Same industry background (Yes=10pts, Related=5pts, No=0pts)  
5. Keywords Coverage (10 points): How many job description keywords appear in resume (High=10pts, Medium=5pts, Low=0pts)

INSTRUCTIONS:
- Count EXACT matches only, be strict
- Use consistent scoring rules above
- Return ONLY valid JSON, no explanations
- Always include all required fields

Resume: """${resumeText.slice(0, 2000)}"""
Job Description: """${jobDescription.slice(0, 2000)}"""

Return this EXACT JSON structure:
{
  "matchScore": [sum of all 5 categories above],
  "matchingKeywords": [array of exact keyword matches found],
  "missingKeywords": [array of important job keywords not in resume],
  "actionVerbFeedback": [{"bullet": "example bullet point", "feedback": "use stronger action verb like 'Achieved'"}],
  "grammarIssues": [array of specific grammar errors found]
}
    `;

    // 🔥 CONSISTENCY FIX: Add temperature=0 for deterministic responses
    const { response, error } = await callOpenAIApi(openAIPrompt, {
      temperature: 0,
      max_tokens: 1500
    });

    if (error) {
      console.error("OpenAI API error:", error);
      return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
    }

    // ✅ Parse OpenAI JSON
    let analysis: AnalysisResult;
    try {
      analysis = JSON.parse(response);
      
      // 🛡️ SAFETY: Ensure score is within bounds
      if (analysis.matchScore > 100) analysis.matchScore = 100;
      if (analysis.matchScore < 0) analysis.matchScore = 0;
      
    } catch (error) {
      console.error("JSON parsing error:", error);
      return NextResponse.json(
        { error: "Failed to parse analysis response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      matchScore: analysis.matchScore || 0,
      matchingKeywords: analysis.matchingKeywords || [],
      missingKeywords: analysis.missingKeywords || [],
      atsIssues,
      actionVerbFeedback: analysis.actionVerbFeedback || [],
      readabilityScore,
      grammarIssues: analysis.grammarIssues || [],
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
