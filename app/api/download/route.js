import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

// Mock processed data (in a real app, you'd fetch this from a database)
const mockProcessedData = [
  { name: 'John Doe', email: 'john@example.com', company: 'Acme Inc', linkedin: 'https://linkedin.com/in/johndoe' },
  { name: 'Jane Smith', email: 'jane@example.com', company: 'Tech Corp', linkedin: 'https://linkedin.com/in/janesmith' },
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');
    const format = searchParams.get('format');

    if (!fileId || !format) {
      return NextResponse.json({ error: 'Missing fileId or format' }, { status: 400 });
    }

    // Here you would typically fetch the processed data for the given fileId from your database
    // For now, we'll use the mock data
    const data = mockProcessedData;

    let content;
    let contentType;
    let fileName;

    if (format === 'csv') {
      content = generateCSV(data);
      contentType = 'text/csv';
      fileName = 'processed_file.csv';
    } else if (format === 'xlsx') {
      content = generateExcel(data);
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      fileName = 'processed_file.xlsx';
    } else {
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Error generating file:', error);
    return NextResponse.json({ error: 'Failed to generate file' }, { status: 500 });
  }
}

function generateCSV(data) {
  const headers = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map(row => Object.values(row).join(',')).join('\n');
  return headers + rows;
}

function generateExcel(data) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Processed Data');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}