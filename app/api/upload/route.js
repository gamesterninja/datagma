import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');
    const mapping = JSON.parse(data.get('mapping'));

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const filename = file.name.toLowerCase();

    let rows;
    if (filename.endsWith('.csv')) {
      const content = new TextDecoder().decode(buffer);
      rows = parse(content, { columns: true, skip_empty_lines: true });
    } else if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(worksheet);
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }

    const processedData = rows.map(row => ({
      name: row[mapping.name],
      company: row[mapping.company],
      email: row[mapping.email],
      linkedin: row[mapping.linkedin]
    }));

    // Here you would typically save the processedData to a database
    // For now, we'll just return it
    return NextResponse.json({ 
      message: 'File uploaded and processed successfully',
      data: processedData
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}