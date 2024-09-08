import fs from 'fs';

// Function to read code from a file
export async function readCodeFromFile(filePath) {
  return fs.promises.readFile(filePath, 'utf8');
}