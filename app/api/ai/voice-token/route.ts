import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'AssemblyAI API key not configured', 
        isMock: true 
      }, { status: 200 });
    }

    const response = await fetch('https://api.assemblyai.com/v2/realtime/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify({ expires_in: 3600 })
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ 
        error: `AssemblyAI API error: ${errText}`, 
        isMock: true 
      }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json({ token: data.token });
  } catch (err: any) {
    return NextResponse.json({ 
      error: err.message || 'Failed to generate token', 
      isMock: true 
    }, { status: 200 });
  }
}
