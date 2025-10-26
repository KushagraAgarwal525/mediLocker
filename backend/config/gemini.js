import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get the Gemini Pro model (for text-only)
function getModel() {
  return genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
}

// Get the Gemini Flash model for PDF/image analysis (multimodal)
function getVisionModel() {
  // Use gemini-2.5-flash - stable multimodal model with 1M token limit
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

// Analyze medical report with Gemini AI
async function analyzeReport(reportData) {
  try {
    const model = getModel();
    
    const prompt = `As a medical AI assistant, analyze the following patient medical report and provide insights, recommendations, and potential concerns:

${JSON.stringify(reportData, null, 2)}

Please provide:
1. Summary of the patient's condition
2. Key medical findings and their implications
3. Potential risks or concerns
4. Recommended follow-up actions
5. Lifestyle recommendations if applicable

Keep the analysis professional, clear, concise, and helpful for patients.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error analyzing report with Gemini:', error);
    throw error;
  }
}

// Analyze medical report PDF with Gemini AI Vision
async function analyzePDFReport(base64Data, mimeType = 'application/pdf') {
  const prompt = `You are an expert medical AI assistant. Analyze this medical report/prescription document and provide a comprehensive explanation.

Please provide:

1. **Medical Condition/Problem**: Clearly explain the patient's diagnosed condition or health issue in simple terms.

2. **Prescribed Medications**: List each medicine mentioned and explain:
   - What the medicine is used for
   - How it helps treat the condition
   - Why it's important for the patient
   - Any key points about its usage

3. **Test Results**: If any lab tests or diagnostic results are shown, explain what they mean and their significance.

4. **Treatment Plan**: Summarize the overall treatment approach and what the patient should expect.

5. **Important Recommendations**: Highlight any critical instructions, warnings, or follow-up actions the patient should take.

Keep your explanation clear, compassionate, concise and easy to understand for patients while maintaining medical accuracy.`;

  // Try gemini-2.5-flash first (stable multimodal model)
  try {
    console.log('Attempting to use Gemini 2.5 Flash with PDF...');
    const visionModel = getVisionModel();
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    const result = await visionModel.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Successfully analyzed with Gemini 2.5 Flash');
    return text;
  } catch (visionError) {
    console.warn('Gemini 2.5 Flash failed, falling back to text extraction...', visionError.message);
    
    // Fallback: Extract text from PDF and use regular Gemini Pro
    try {
      console.log('Extracting text from PDF...');
      
      // Dynamically import pdf-parse (CommonJS module)
      const pdfParse = (await import('pdf-parse')).default;
      
      if (!pdfParse) {
        throw new Error('pdf-parse module not loaded correctly');
      }
      
      // Convert base64 to buffer
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      
      console.log(`PDF buffer size: ${pdfBuffer.length} bytes`);
      
      // Extract text from PDF
      const data = await pdfParse(pdfBuffer);
      const extractedText = data.text;
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the PDF');
      }
      
      console.log(`✅ Extracted ${extractedText.length} characters from PDF`);
      
      // Use regular Gemini Pro with extracted text
      const textModel = getModel();
      const textPrompt = `${prompt}

Here is the extracted text from the medical report:

${extractedText}`;

      const result = await textModel.generateContent(textPrompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (fallbackError) {
      console.error('Error in fallback text extraction:', fallbackError);
      throw new Error(`Failed to analyze PDF: ${fallbackError.message}`);
    }
  }
}

// Query Gemini AI with custom medical question
async function queryAI(prompt) {
  try {
    const model = getModel();
    
    const medicalPrompt = `As a medical AI assistant, please answer the following medical question professionally and accurately:

${prompt}

Provide a clear, informative response that would be helpful for healthcare professionals or patients seeking medical information.`;

    const result = await model.generateContent(medicalPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error querying Gemini AI:', error);
    throw error;
  }
}

// Batch analyze multiple PDF reports
async function batchAnalyzePDFReports(pdfDataArray) {
  try {
    console.log(`Starting batch analysis of ${pdfDataArray.length} PDFs...`);
    
    // Process PDFs in parallel with a limit to avoid rate limiting
    const BATCH_SIZE = 3; // Process 3 at a time to avoid overwhelming the API
    const results = [];
    
    for (let i = 0; i < pdfDataArray.length; i += BATCH_SIZE) {
      const batch = pdfDataArray.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(pdfDataArray.length / BATCH_SIZE)}`);
      
      const batchPromises = batch.map(async (pdfData, index) => {
        try {
          const result = await analyzePDFReport(pdfData.base64Data, pdfData.mimeType);
          return {
            success: true,
            index: i + index,
            fileName: pdfData.fileName || `PDF ${i + index + 1}`,
            explanation: result
          };
        } catch (error) {
          console.error(`Error analyzing PDF ${i + index + 1}:`, error.message);
          return {
            success: false,
            index: i + index,
            fileName: pdfData.fileName || `PDF ${i + index + 1}`,
            error: error.message
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add a small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < pdfDataArray.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }
    
    console.log(`Batch analysis complete. ${results.filter(r => r.success).length}/${results.length} successful`);
    return results;
  } catch (error) {
    console.error('Error in batch analysis:', error);
    throw error;
  }
}

// Check medication compatibility across all reports
async function checkMedicationCompatibility(newReportBase64, newReportMimeType, existingReportsText) {
  try {
    console.log('Checking medication compatibility...');
    console.log(`Analyzing new report against ${existingReportsText.length} existing reports`);
    
    const visionModel = getVisionModel();
    
    // Build the prompt with extracted text from existing reports
    let prompt = `You are a medical AI assistant specialized in medication safety and drug interactions. 

CRITICAL INSTRUCTIONS:
- You must respond with ONLY a valid JSON object
- No additional text, explanations, or markdown formatting before or after the JSON
- The JSON must have exactly two keys: "status" and "message"
- status: 0 means no concerns (safe), 1 means potential concerns detected
- message: should contain your detailed analysis

TASK: Analyze this NEW medical report/prescription along with the patient's EXISTING reports to identify:

1. **Drug Interactions**: Check if any medications in the new report could interact negatively with medications from existing reports
2. **Allergies**: Identify any potential allergic reactions based on the patient's history
3. **Contraindications**: Check for medical conditions that would make new medications unsafe
4. **Duplicate Medications**: Identify if similar medications are being prescribed that could cause overdosing
5. **Dosage Concerns**: Flag any unusual dosages that seem concerning

`;

    if (existingReportsText && existingReportsText.length > 0) {
      prompt += `\n**PATIENT'S EXISTING MEDICAL REPORTS (${existingReportsText.length} reports):**\n\n`;
      
      existingReportsText.forEach((report, index) => {
        prompt += `--- EXISTING REPORT ${index + 1} ---\n`;
        prompt += `Date: ${report.reportDate || 'Unknown'}\n`;
        prompt += `Block ID: ${report.blockId}\n\n`;
        prompt += `Content:\n${report.extractedText}\n\n`;
        prompt += `---\n\n`;
      });
    } else {
      prompt += `\n**NOTE:** This is the patient's first report in our system. Check for any internal concerns within the new report itself.\n\n`;
    }

    prompt += `**NEW REPORT TO ANALYZE (This is the prescription being uploaded now):**\n`;
    prompt += `[See attached medical report/prescription image below]\n\n`;
    
    prompt += `\n**RESPONSE FORMAT (REQUIRED):**
Return your response as a JSON object with this exact structure:
{
  "status": 0 or 1,
  "message": "Your detailed analysis here"
}

If status is 1, the message should clearly explain:
- What specific concern was found
- Which medications or conditions are involved
- Which existing report (Report 1, Report 2, etc.) contains the conflicting medication
- Why this is a potential problem
- Recommended actions

If status is 0, the message should briefly state:
- That no significant interactions or concerns were detected
- A brief summary confirming the new medications appear safe with existing treatment

Remember: Respond with ONLY the JSON object, nothing else.`;

    // Add the new report as an image for vision analysis
    const newReportPart = {
      inlineData: {
        data: newReportBase64,
        mimeType: newReportMimeType
      }
    };
    
    console.log(`Sending to AI: ${existingReportsText.length} text extracts + 1 new PDF image`);
    
    const result = await visionModel.generateContent([prompt, newReportPart]);
    const response = await result.response;
    let text = response.text().trim();
    
    console.log('Raw AI response:', text);
    
    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON response
    try {
      const jsonResponse = JSON.parse(text);
      
      // Validate response structure
      if (typeof jsonResponse.status !== 'number' || !jsonResponse.message) {
        throw new Error('Invalid response structure from AI');
      }
      
      console.log('✅ Medication compatibility check complete:', jsonResponse);
      return jsonResponse;
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      // Return a safe fallback
      return {
        status: 1,
        message: `Unable to perform automatic safety check. Please review manually with your healthcare provider.\n\nAI Response: ${text.substring(0, 500)}`
      };
    }
    
  } catch (error) {
    console.error('Error checking medication compatibility:', error);
    throw error;
  }
}

export {
  analyzePDFReport,
  checkMedicationCompatibility,
  getModel,
  getVisionModel
};
