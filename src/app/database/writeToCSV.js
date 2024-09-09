import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

/**
 * Writes the extracted code elements to a CSV file.
 *
 * @param {object} data - The extracted code elements.
 * @param {string} outputPath - The path to the output CSV file.
 */
export function writeToCsv(data, outputPath) {
    const csvWriter = createCsvWriter({
      path: outputPath,
      header: [
        { id: 'type', title: 'Type' },
        { id: 'name', title: 'Name' },
        { id: 'code', title: 'Code' },
        { id: 'filepath', title: 'Filepath' },
        { id: 'embedding', title: 'Embedding' }
      ]
    });
  
    // Combine all extracted data into a single array for CSV writing
    const records = [
      ...data.functions.map(item => ({
        type: 'function',
        name: item.function_name,
        code: item.code,
        filepath: item.filepath,
        embedding: JSON.stringify(item.embedding)
      })),
      ...data.classes.map(item => ({
        type: 'class',
        name: item.class_name,
        code: item.code,
        filepath: item.filepath,
        embedding: JSON.stringify(item.embedding)
      })),
      /* ...data.misc.map(item => ({
        type: 'misc',
        name: '',
        code: item.code,
        filepath: item.filepath,
        embeddings: JSON.stringify(item.embedding)
      })) */
    ];
  
    csvWriter.writeRecords(records)
      .then(() => console.log('CSV file was written successfully'));
  }
  
