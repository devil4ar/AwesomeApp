import TextRecognition from '@react-native-ml-kit/text-recognition';
import { OCRResult } from '../types';

/**
 * Real OCR text extraction using ML Kit
 */
export const mockOCRExtraction = async (
  imageUri: string,
): Promise<OCRResult> => {
  try {
    // Perform actual OCR using ML Kit
    const result = await TextRecognition.recognize(imageUri);

    // Extract structured data from recognized text
    const extractedData = parseOCRText(result.text);

    // Calculate confidence scores from ML Kit blocks
    const confidenceScores = calculateConfidence(result.blocks);

    return {
      name: extractedData.name || '',
      idNumber: extractedData.idNumber || '',
      dateOfBirth: extractedData.dateOfBirth || '',
      confidence: {
        name: confidenceScores.name,
        idNumber: confidenceScores.idNumber,
        dateOfBirth: confidenceScores.dateOfBirth,
      },
    };
  } catch (error) {
    console.error('OCR Error:', error);
    // Fallback to empty data with low confidence
    return {
      name: '',
      idNumber: '',
      dateOfBirth: '',
      confidence: {
        name: 0,
        idNumber: 0,
        dateOfBirth: 0,
      },
    };
  }
};

/**
 * Calculate confidence scores from ML Kit blocks
 */
const calculateConfidence = (
  blocks: any[],
): {
  name: number;
  idNumber: number;
  dateOfBirth: number;
} => {
  let nameConfidence = 0;
  let idConfidence = 0;
  let dobConfidence = 0;
  let nameCount = 0;
  let idCount = 0;
  let dobCount = 0;

  blocks.forEach(block => {
    const text = block.text.toLowerCase();
    const blockConfidence = block.recognizedLanguages?.[0]?.confidence || 0.85;

    // Name-related blocks
    if (text.includes('name') || /^[a-z\s]{4,}$/i.test(block.text)) {
      nameConfidence += blockConfidence * 100;
      nameCount++;
    }

    // ID-related blocks
    if (
      text.includes('id') ||
      text.includes('number') ||
      /^[A-Z0-9-]{5,}$/i.test(block.text)
    ) {
      idConfidence += blockConfidence * 100;
      idCount++;
    }

    // Date-related blocks
    if (
      text.includes('birth') ||
      text.includes('dob') ||
      /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(block.text)
    ) {
      dobConfidence += blockConfidence * 100;
      dobCount++;
    }
  });

  return {
    name: nameCount > 0 ? Math.round(nameConfidence / nameCount) : 50,
    idNumber: idCount > 0 ? Math.round(idConfidence / idCount) : 50,
    dateOfBirth: dobCount > 0 ? Math.round(dobConfidence / dobCount) : 50,
  };
};

/**
 * Parse extracted text to structured data from ML Kit result
 */
export const parseOCRText = (rawText: string): Partial<OCRResult> => {
  const result: Partial<OCRResult> = {};
  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  // Enhanced parsing logic for ID cards
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    const nextLine = lines[i + 1];

    // Extract Name
    if (!result.name) {
      if (lowerLine.includes('name')) {
        // Check if name is on same line after colon/space
        const nameMatch = line.match(/name[:\s]+(.+)/i);
        if (nameMatch) {
          result.name = nameMatch[1].trim();
        } else if (nextLine) {
          // Name might be on next line
          result.name = nextLine;
        }
      } else if (
        /^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(line) &&
        line.length > 5 &&
        line.length < 50
      ) {
        // Likely a name (capitalized words)
        result.name = line;
      }
    }

    // Extract ID Number
    if (!result.idNumber) {
      if (lowerLine.includes('id') || lowerLine.includes('number')) {
        const idMatch = line.match(/[A-Z0-9-]{5,}/i);
        if (idMatch) {
          result.idNumber = idMatch[0];
        } else if (nextLine) {
          const nextIdMatch = nextLine.match(/[A-Z0-9-]{5,}/);
          if (nextIdMatch) {
            result.idNumber = nextIdMatch[0];
          }
        }
      } else if (/^[A-Z0-9-]{6,15}$/.test(line)) {
        // Standalone ID-like pattern
        result.idNumber = line;
      }
    }

    // Extract Date of Birth
    if (!result.dateOfBirth) {
      if (lowerLine.includes('birth') || lowerLine.includes('dob')) {
        const dateMatch = line.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/);
        if (dateMatch) {
          result.dateOfBirth = formatDate(dateMatch[0]);
        } else if (nextLine) {
          const nextDateMatch = nextLine.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/);
          if (nextDateMatch) {
            result.dateOfBirth = formatDate(nextDateMatch[0]);
          }
        }
      } else {
        // Standalone date pattern
        const dateMatch = line.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/);
        if (dateMatch && !result.dateOfBirth) {
          result.dateOfBirth = formatDate(dateMatch[0]);
        }
      }
    }
  }

  return result;
};

/**
 * Format date to MM/DD/YYYY
 */
const formatDate = (dateString: string): string => {
  // Handle different date formats
  const parts = dateString.split(/[/-]/);
  if (parts.length === 3) {
    let [first, second, third] = parts;

    // Handle 2-digit year
    if (third.length === 2) {
      const year = parseInt(third, 10);
      third = year > 50 ? `19${third}` : `20${third}`;
    }

    // Assume MM/DD/YYYY or DD/MM/YYYY based on values
    const firstNum = parseInt(first, 10);

    if (firstNum > 12) {
      // Must be DD/MM/YYYY
      return `${second.padStart(2, '0')}/${first.padStart(2, '0')}/${third}`;
    } else {
      // Assume MM/DD/YYYY
      return `${first.padStart(2, '0')}/${second.padStart(2, '0')}/${third}`;
    }
  }

  return dateString;
};

/**
 * Validate OCR extracted data
 */
export const validateOCRData = (data: OCRResult): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!data.name || data.name.length < 2) {
    errors.name = 'Name is required and must be at least 2 characters';
  }

  if (!data.idNumber || data.idNumber.length < 5) {
    errors.idNumber = 'ID Number is required and must be at least 5 characters';
  }

  if (!data.dateOfBirth || !isValidDate(data.dateOfBirth)) {
    errors.dateOfBirth = 'Valid date of birth is required (MM/DD/YYYY)';
  }

  return errors;
};

/**
 * Validate date format
 */
const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) return false;

  const [month, day, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};
