import fs from 'fs';
import path from 'path';

// Prefixes for detecting function and class definitions
const FUNC_PREFIXES = ['function ', 'const ', 'let ', 'var '];
const CLASS_PREFIX = 'class ';
const NEWLINE = '\n';

/**
 * Extracts the function name from a line of JavaScript code.
 *
 * Handles function declarations, arrow functions, and variable declarations for functions.
 *
 * @param {string} line - The line of code to analyze.
 * @returns {string|null} - The name of the function if found, otherwise null.
 */
function getFunctionName(line) {
  // Split the line by common delimiters and assume the function name is the second element
  const parts = line.split(/\s|\(|\)|{|}|\[|\]|;|,/).filter(part => part.length > 0);
  return parts[1] || null; // Extract function name
}

/**
 * Extracts the class name from a line of JavaScript code.
 *
 * Handles class definitions.
 *
 * @param {string} line - The line of code to analyze.
 * @returns {string|null} - The name of the class if found, otherwise null.
 */
function getClassName(line) {
  // Split the line by common delimiters and assume the class name is the second element
  const parts = line.split(/\s|{|}/).filter(part => part.length > 0);
  return parts[1] || null; // Extract class name
}

/**
 * Collects all lines of code related to a function or class definition.
 *
 * This function collects lines until a line that is not part of the function or class is encountered.
 *
 * @param {string[]} allLines - The list of lines in the code file.
 * @param {number} i - The index of the starting line for the function or class.
 * @returns {string} - A single string containing the full code block for the function or class.
 */
function getUntilNoSpace(allLines, i) {
  const ret = [allLines[i]];
  for (let j = i + 1; j < allLines.length; j++) {
    const line = allLines[j];
    // Include lines that are part of the function or class definition
    if (line.trim().length === 0 || /[\s\t\)\{\}]/.test(line[0])) {
      ret.push(line);
    } else {
      break;
    }
  }
  return ret.join(NEWLINE);
}

/**
 * Checks if the given line starts a comment or documentation block.
 *
 * @param {string} line - The line of code to check.
 * @param {boolean} inMultiLineComment - Flag indicating if currently within a multi-line comment.
 * @param {boolean} inDocBlock - Flag indicating if currently within a documentation block.
 * @returns {boolean} - True if the line is part of a comment or documentation block, otherwise false.
 */
function isCommentOrDocBlock(line, inMultiLineComment, inDocBlock) {
  if (inMultiLineComment) {
    // If currently inside a multi-line comment, check for comment end
    return line.includes('*/');
  } else if (inDocBlock) {
    // If currently inside a documentation block, check for doc block end
    return line.includes('*/');
  } else {
    // Check for comment or doc block start
    return line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('/**');
  }
}

/**
 * Extracts functions, classes, and miscellaneous code from a JavaScript file.
 *
 * Reads the file content, identifies functions and classes using basic string manipulation,
 * and collects their code and names. Collects any other code under the 'misc' key, excluding comments
 * and documentation blocks.
 *
 * @param {string} filepath - The path to the JavaScript file.
 * @returns {object} - A dictionary containing lists of functions, classes, and miscellaneous code. 
 *                     Each list contains dictionaries with 'code', 'function_name' or 'class_name', and 'filepath' keys.
 */
export function extractCodeElements(filepath) {
  const fileContent = fs.readFileSync(filepath, 'utf8');
  const allLines = fileContent.split(NEWLINE);
  const functions = [];
  const classes = [];
  const misc = [];

  // Compute the relative path from the current working directory
  const relativeFilePath = path.relative(process.cwd(), filepath);

  let inMultiLineComment = false;
  let inDocBlock = false;

  for (let i = 0; i < allLines.length; i++) {
    let line = allLines[i];
    let trimmedLine = line.trim();

    if (isCommentOrDocBlock(trimmedLine, inMultiLineComment, inDocBlock)) {
      if (trimmedLine.startsWith('/*')) {
        inMultiLineComment = true;
        if (trimmedLine.endsWith('*/')) {
          inMultiLineComment = false;
        }
      } else if (trimmedLine.startsWith('/**')) {
        inDocBlock = true;
        if (trimmedLine.endsWith('*/')) {
          inDocBlock = false;
        }
      } else if (trimmedLine.startsWith('//')) {
        continue; // Skip single-line comments
      }
      continue; // Skip comments and documentation blocks
    }

    let isFunction = FUNC_PREFIXES.some(prefix => trimmedLine.startsWith(prefix)) || trimmedLine.includes('=>');
    let isClass = trimmedLine.startsWith(CLASS_PREFIX);
    
    if (isFunction) {
      const code = getUntilNoSpace(allLines, i);
      const functionName = getFunctionName(trimmedLine);
      if (functionName) {
        functions.push({
          code,
          function_name: functionName,
          filepath: relativeFilePath
        });
      }
      i += code.split(NEWLINE).length - 1; // Skip lines already processed for functions
    } else if (isClass) {
      const code = getUntilNoSpace(allLines, i);
      const className = getClassName(trimmedLine);
      if (className) {
        classes.push({
          code,
          class_name: className,
          filepath: relativeFilePath
        });
      }
      i += code.split(NEWLINE).length - 1; // Skip lines already processed for classes
    } else {
      // Collecting miscellaneous code, excluding comments and documentation blocks
      if (trimmedLine.length > 0) {
        misc.push({
          code: trimmedLine,
          filepath: relativeFilePath
        });
      }
    }
  }
  
  return {
    functions,
    classes,
    // misc
    relativeFilePath
  };
}