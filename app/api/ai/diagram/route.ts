import { NextResponse } from 'next/server';

interface DiagramNode {
  id: string;
  type: 'rectangle' | 'diamond' | 'ellipse';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
}

interface DiagramArrow {
  id: string;
  startNode: string;
  endNode: string;
  label?: string;
}

interface DiagramResponse {
  title: string;
  nodes: DiagramNode[];
  arrows: DiagramArrow[];
}

// Warm pastel colors matching AuraFlow theme.md palette
const COLORS = {
  emerald: '#A7F3D0',
  cyan: '#A5F3FC',
  amber: '#FDE68A',
  indigo: '#C7D2FE',
  rose: '#FBCFE8',
  coral: '#FECACA',
  slate: '#E2E8F0',
};

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const diagramType = type || 'flowchart';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const systemPrompt = `You are a professional system diagram and flowchart generator. Your task is to output a diagram layout for the type "${diagramType}" based on the user's request: "${prompt}".
You must return ONLY a raw JSON object. Do not include markdown code blocks, do not include any explanatory text before or after the JSON, and do not wrap the JSON in backticks. The JSON must adhere strictly to this schema:

{
  "title": "A descriptive title of the diagram",
  "nodes": [
    {
      "id": "node_1",
      "type": "rectangle" | "diamond" | "ellipse",
      "text": "A very short text inside the node (max 30 chars)",
      "x": 200, 
      "y": 150,
      "width": 180,
      "height": 80,
      "backgroundColor": "#A7F3D0" 
    }
  ],
  "arrows": [
    {
      "id": "arrow_1",
      "startNode": "node_1",
      "endNode": "node_2",
      "label": "Yes" 
    }
  ]
}

Layout Rules:
1. "x" coordinates should range between 100 and 1200.
2. "y" coordinates should range between 100 and 800.
3. Node spacing: ensure nodes DO NOT overlap. Leave at least 150px gap between nodes.
4. "type": Use "diamond" for decision nodes in flowcharts, "ellipse" for start/end nodes, and "rectangle" for regular processes.
5. "backgroundColor": Use clear, readable pastel hex codes:
   - Green/Success: "${COLORS.emerald}"
   - Blue/Cyan/Process: "${COLORS.cyan}"
   - Orange/Yellow/Warning/Decision: "${COLORS.amber}"
   - Purple/Indigo: "${COLORS.indigo}"
   - Red/Coral: "${COLORS.coral}"
   - Pink/Rose: "${COLORS.rose}"
6. Arrows must only connect existing node IDs.
7. Design guidelines:
   - Flowcharts: Linear top-to-bottom or left-to-right progression. Use diamond for decisions.
   - Mind maps: Center node at (500, 400), with branches radiating outward in all directions.
   - System architectures: Distinct horizontal or vertical layers (e.g. Clients on the left, API Gateway in the middle, Database on the right).
   - User Journey: Left-to-right linear step progression.
   - Process Diagram: Sequenced boxes in order.`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

          // Clean markdown code blocks if the LLM wrapped it
          if (responseText.startsWith('```')) {
            responseText = responseText.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
          }
          responseText = responseText.trim();

          const parsed = JSON.parse(responseText);
          if (parsed.nodes && Array.isArray(parsed.nodes)) {
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.error('Gemini API execution failed, falling back to mock generator:', err);
      }
    }

    // Fallback: Smart keyword-based mock generator
    const mockDiagram = generateMockDiagram(prompt, diagramType);
    
    // Simulate API delay for a realistic typing/processing experience
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return NextResponse.json(mockDiagram);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate diagram' }, { status: 500 });
  }
}

function generateMockDiagram(prompt: string, type: string): DiagramResponse {
  const p = prompt.toLowerCase();
  
  // 1. Auth/Login flows
  if (p.includes('auth') || p.includes('login') || p.includes('sign') || p.includes('user')) {
    if (type === 'system' || p.includes('architecture')) {
      return {
        title: '🔒 Cozy Authentication System Architecture',
        nodes: [
          { id: 'client', type: 'ellipse', text: '📱 Next.js Client App', x: 100, y: 300, width: 160, height: 70, backgroundColor: COLORS.indigo },
          { id: 'gateway', type: 'rectangle', text: '🌐 Clerk API Gateway', x: 350, y: 300, width: 170, height: 75, backgroundColor: COLORS.rose },
          { id: 'auth_service', type: 'rectangle', text: '🔐 Clerk Session Auth', x: 600, y: 200, width: 170, height: 75, backgroundColor: COLORS.cyan },
          { id: 'user_db', type: 'rectangle', text: '💾 Neon PostgreSQL DB', x: 850, y: 300, width: 170, height: 75, backgroundColor: COLORS.emerald },
          { id: 'sync_api', type: 'rectangle', text: '🔄 Sync User Route', x: 600, y: 400, width: 170, height: 75, backgroundColor: COLORS.amber },
        ],
        arrows: [
          { id: 'a1', startNode: 'client', endNode: 'gateway', label: 'HTTP Request' },
          { id: 'a2', startNode: 'gateway', endNode: 'auth_service', label: 'Verify JWT' },
          { id: 'a3', startNode: 'gateway', endNode: 'sync_api', label: 'Sync Webhook' },
          { id: 'a4', startNode: 'sync_api', endNode: 'user_db', label: 'Upsert User' },
          { id: 'a5', startNode: 'auth_service', endNode: 'client', label: 'Session Token' },
        ]
      };
    } else {
      // Flowchart or other
      return {
        title: '🔑 User Authentication Process Flow',
        nodes: [
          { id: 'start', type: 'ellipse', text: '🏁 Start: Click Login', x: 300, y: 100, width: 150, height: 60, backgroundColor: COLORS.indigo },
          { id: 'input', type: 'rectangle', text: '⌨️ Enter Email & Pass', x: 300, y: 220, width: 170, height: 70, backgroundColor: COLORS.cyan },
          { id: 'decision', type: 'diamond', text: '❓ Credentials Valid?', x: 295, y: 350, width: 180, height: 120, backgroundColor: COLORS.amber },
          { id: 'error', type: 'rectangle', text: '❌ Show Validation Error', x: 580, y: 375, width: 180, height: 70, backgroundColor: COLORS.coral },
          { id: 'db_check', type: 'rectangle', text: '💾 Query User Record', x: 300, y: 530, width: 170, height: 70, backgroundColor: COLORS.emerald },
          { id: 'success', type: 'ellipse', text: '🎉 Redirect to Dashboard', x: 300, y: 660, width: 180, height: 60, backgroundColor: COLORS.emerald },
        ],
        arrows: [
          { id: 'a1', startNode: 'start', endNode: 'input' },
          { id: 'a2', startNode: 'input', endNode: 'decision' },
          { id: 'a3', startNode: 'decision', endNode: 'error', label: 'No' },
          { id: 'a4', startNode: 'error', endNode: 'input', label: 'Retry' },
          { id: 'a5', startNode: 'decision', endNode: 'db_check', label: 'Yes' },
          { id: 'a6', startNode: 'db_check', endNode: 'success' },
        ]
      };
    }
  }

  // 2. Database/API/Server cache query flows
  if (p.includes('database') || p.includes('db') || p.includes('cache') || p.includes('query') || p.includes('sql')) {
    return {
      title: '⚡ Server Query Caching Pipeline',
      nodes: [
        { id: 'req', type: 'ellipse', text: '📡 API Fetch Request', x: 300, y: 100, width: 160, height: 60, backgroundColor: COLORS.indigo },
        { id: 'check_cache', type: 'rectangle', text: '🧠 Check Redis Cache', x: 300, y: 220, width: 170, height: 70, backgroundColor: COLORS.cyan },
        { id: 'hit_decision', type: 'diamond', text: '❓ Cache Hit?', x: 295, y: 350, width: 180, height: 120, backgroundColor: COLORS.amber },
        { id: 'db_query', type: 'rectangle', text: '💾 Query PostgreSQL DB', x: 560, y: 375, width: 180, height: 70, backgroundColor: COLORS.rose },
        { id: 'write_cache', type: 'rectangle', text: '✏️ Write cache key', x: 560, y: 510, width: 170, height: 70, backgroundColor: COLORS.emerald },
        { id: 'return_data', type: 'ellipse', text: '🚀 Return JSON Response', x: 300, y: 640, width: 180, height: 60, backgroundColor: COLORS.emerald },
      ],
      arrows: [
        { id: 'a1', startNode: 'req', endNode: 'check_cache' },
        { id: 'a2', startNode: 'check_cache', endNode: 'hit_decision' },
        { id: 'a3', startNode: 'hit_decision', endNode: 'db_query', label: 'No' },
        { id: 'a4', startNode: 'db_query', endNode: 'write_cache' },
        { id: 'a5', startNode: 'write_cache', endNode: 'return_data' },
        { id: 'a6', startNode: 'hit_decision', endNode: 'return_data', label: 'Yes' },
      ]
    };
  }

  // 3. Mind map default
  if (type === 'mindmap' || p.includes('mind') || p.includes('brain') || p.includes('idea')) {
    return {
      title: `🧠 Cozy Mind Map: ${prompt}`,
      nodes: [
        { id: 'root', type: 'ellipse', text: prompt.substring(0, 30), x: 500, y: 350, width: 200, height: 90, backgroundColor: COLORS.indigo },
        
        // North
        { id: 'n1', type: 'rectangle', text: '💡 Core Concept 1', x: 500, y: 150, width: 160, height: 60, backgroundColor: COLORS.cyan },
        { id: 'n1_sub1', type: 'ellipse', text: 'Detail A', x: 350, y: 70, width: 100, height: 50, backgroundColor: COLORS.emerald },
        { id: 'n1_sub2', type: 'ellipse', text: 'Detail B', x: 650, y: 70, width: 100, height: 50, backgroundColor: COLORS.emerald },
        
        // East
        { id: 'e1', type: 'rectangle', text: '🎨 Design & Feel', x: 800, y: 365, width: 160, height: 60, backgroundColor: COLORS.rose },
        { id: 'e1_sub1', type: 'ellipse', text: 'Sage / Oatmeal', x: 1020, y: 300, width: 120, height: 50, backgroundColor: COLORS.rose },
        { id: 'e1_sub2', type: 'ellipse', text: 'Lucide Icons', x: 1020, y: 430, width: 120, height: 50, backgroundColor: COLORS.rose },
        
        // South
        { id: 's1', type: 'rectangle', text: '🛠️ Tech Stack', x: 500, y: 550, width: 160, height: 60, backgroundColor: COLORS.amber },
        { id: 's1_sub1', type: 'ellipse', text: 'React 19 / Next.js', x: 350, y: 660, width: 130, height: 50, backgroundColor: COLORS.amber },
        { id: 's1_sub2', type: 'ellipse', text: 'Excalidraw canvas', x: 650, y: 660, width: 130, height: 50, backgroundColor: COLORS.amber },

        // West
        { id: 'w1', type: 'rectangle', text: '🚀 Key Milestones', x: 200, y: 365, width: 160, height: 60, backgroundColor: COLORS.coral },
      ],
      arrows: [
        { id: 'a1', startNode: 'root', endNode: 'n1' },
        { id: 'a2', startNode: 'n1', endNode: 'n1_sub1' },
        { id: 'a3', startNode: 'n1', endNode: 'n1_sub2' },
        
        { id: 'a4', startNode: 'root', endNode: 'e1' },
        { id: 'a5', startNode: 'e1', endNode: 'e1_sub1' },
        { id: 'a6', startNode: 'e1', endNode: 'e1_sub2' },
        
        { id: 'a7', startNode: 'root', endNode: 's1' },
        { id: 'a8', startNode: 's1', endNode: 's1_sub1' },
        { id: 'a9', startNode: 's1', endNode: 's1_sub2' },

        { id: 'a10', startNode: 'root', endNode: 'w1' },
      ]
    };
  }

  // 4. Default: beautiful generic flowchart progression
  return {
    title: `📈 Flowchart: ${prompt}`,
    nodes: [
      { id: 'n1', type: 'ellipse', text: '🌱 Initialize Concept', x: 100, y: 300, width: 160, height: 60, backgroundColor: COLORS.indigo },
      { id: 'n2', type: 'rectangle', text: '🔬 Analyze Requirements', x: 350, y: 300, width: 170, height: 70, backgroundColor: COLORS.cyan },
      { id: 'n3', type: 'diamond', text: '❓ Viable Solution?', x: 610, y: 275, width: 160, height: 120, backgroundColor: COLORS.amber },
      { id: 'n4_fail', type: 'rectangle', text: '🔄 Pivot and Research', x: 610, y: 100, width: 160, height: 70, backgroundColor: COLORS.coral },
      { id: 'n4_success', type: 'rectangle', text: '🛠️ Implement Prototype', x: 860, y: 300, width: 170, height: 70, backgroundColor: COLORS.emerald },
      { id: 'n5', type: 'ellipse', text: '🚀 Release Production', x: 1120, y: 300, width: 160, height: 60, backgroundColor: COLORS.emerald },
    ],
    arrows: [
      { id: 'a1', startNode: 'n1', endNode: 'n2' },
      { id: 'a2', startNode: 'n2', endNode: 'n3' },
      { id: 'a3', startNode: 'n3', endNode: 'n4_fail', label: 'No' },
      { id: 'a4', startNode: 'n4_fail', endNode: 'n2', label: 'Restart' },
      { id: 'a5', startNode: 'n3', endNode: 'n4_success', label: 'Yes' },
      { id: 'a6', startNode: 'n4_success', endNode: 'n5' },
    ]
  };
}
