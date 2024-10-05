import { NextResponse } from 'next/server';

// In a real application, you would fetch this data from a database
const mockFiles = [
  { id: 1, name: 'contacts1.csv', uploadDate: '2023-05-01T12:00:00Z', status: 'Processed' },
  { id: 2, name: 'leads.xlsx', uploadDate: '2023-05-02T14:30:00Z', status: 'Processing' },
];

export async function GET() {
  try {
    // Here you would typically fetch the list of processed files from your database
    // For now, we'll return the mock data
    return NextResponse.json(mockFiles);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}