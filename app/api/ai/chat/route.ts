import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, history, activePage } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const systemPrompt = `You are the central Spark AI Assistant for a cozy productivity application.
Your goal is to converse with the user, answer questions, and perform actions across the app's components (Kanban, Calendar, Notes, Whiteboard, Settings, and Template Builder).

The current date and time is: ${new Date().toISOString()}.
The current active page in the app is: ${activePage || 'dashboard'}.

You must return ONLY a raw JSON object. Do not include markdown code blocks, do not include any explanatory text before or after the JSON, and do not wrap the JSON in backticks.
The JSON must adhere strictly to this schema:
{
  "reply": "Your conversational response here. If you need more information to execute an action (e.g., date/time for a calendar entry, or text details), ask for it in this reply and set 'action' to null. If you successfully schedule or queue an action, mention it warmly in the reply.",
  "action": null | {
    "type": "ADD_KANBAN_TASK" | "CREATE_KANBAN_BOARD" | "ADD_CALENDAR_TASK" | "CREATE_NOTE" | "REFINE_NOTE" | "CREATE_WHITEBOARD_DIAGRAM" | "GENERATE_TEMPLATE_APP" | "UPDATE_SETTINGS",
    "payload": {
      // For ADD_KANBAN_TASK:
      "boardId": "string (optional - if omitted, frontend will default to the current active board)",
      "title": "string",
      "description": "string (optional)",
      "dueDate": "YYYY-MM-DD (optional)",
      "priority": "Low" | "Medium" | "High" (optional),
      "labels": ["string"] (optional)

      // For CREATE_KANBAN_BOARD:
      "name": "string",
      "color": "hex color code (optional, e.g. '#6366F1', '#10B981', '#EC4899')"

      // For ADD_CALENDAR_TASK:
      "title": "string",
      "type": "task" | "reminder",
      "date": "YYYY-MM-DD (required - if the user did not specify a date or time frame like 'tomorrow', do NOT return this action; ask for it in the reply)",
      "time": "HH:MM (optional)",
      "category": "Work" | "Personal" | "Meeting" | "Health" | "Urgent",
      "description": "string (optional)"

      // For CREATE_NOTE:
      "title": "string",
      "content": "HTML string (can contain headings and paragraphs)",
      "color": "teal" | "sage" | "peach" | "oat" | "cyan" | "violet" (optional)

      // For REFINE_NOTE:
      "noteId": "string (optional - defaults to current note)",
      "option": "grammar" | "rephrase" | "shorter" | "longer" | "simplify" | "tone"

      // For CREATE_WHITEBOARD_DIAGRAM:
      "name": "string",
      "prompt": "string (the diagram description)",
      "type": "flowchart" | "mindmap" | "system"

      // For GENERATE_TEMPLATE_APP:
      "prompt": "string (app prompt)"

      // For UPDATE_SETTINGS:
      "density": "comfortable" | "compact" (optional),
      "aiCopilot": boolean (optional)
    }
  }
}

Clarification Flow Rule:
If the user says something ambiguous like "add meeting" or "remind me to build database" without specifying a date or timeframe, do NOT guess the date. Instead, set 'action' to null and ask: "I can set a meeting for that. What date and time should I schedule it for?"
Only return the action when you have all the required parameters.
`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: systemPrompt }] },
              ...history.map((h: any) => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: typeof h.text === 'string' ? h.text : JSON.stringify(h) }]
              })),
              { role: 'user', parts: [{ text: prompt }] }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

          if (responseText.startsWith('```')) {
            responseText = responseText.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
          }
          responseText = responseText.trim();

          const parsed = JSON.parse(responseText);
          if (parsed.reply) {
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.error('Gemini API call failed, running local mock parser:', err);
      }
    }

    // Fallback: Smart keyword and regex-based parser
    const result = runLocalParser(prompt, activePage);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ 
      reply: "Oops, I ran into an error processing that request. Let me know if I can help you with anything else!",
      action: null,
      error: error.message 
    });
  }
}

function runLocalParser(prompt: string, activePage: string): { reply: string; action: any } {
  const p = prompt.toLowerCase().trim();

  // 1. ADD CALENDAR TASK
  // E.g., "add meeting at 3pm tomorrow" or "add meeting"
  if (p.includes('meeting') || p.includes('calendar') || p.includes('schedule') || p.includes('remind me')) {
    const isReminder = p.includes('remind') || p.includes('reminder');
    
    // Check if user provided a date/time
    let dateStr: string | null = null;
    let timeStr = "";
    
    const today = new Date(2026, 5, 21); // Simulated today: Sunday June 21, 2026
    
    if (p.includes('today')) {
      dateStr = '2026-06-21';
    } else if (p.includes('tomorrow')) {
      dateStr = '2026-06-22';
    } else if (p.includes('monday') || p.includes('june 22')) {
      dateStr = '2026-06-22';
    } else if (p.includes('tuesday') || p.includes('june 23')) {
      dateStr = '2026-06-23';
    } else if (p.includes('wednesday') || p.includes('june 24')) {
      dateStr = '2026-06-24';
    }

    // Time parsing (rough regex)
    const timeMatch = p.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] || '00';
      const ampm = timeMatch[3].toLowerCase();
      if (ampm === 'pm' && hours < 12) hours += 12;
      if (ampm === 'am' && hours === 12) hours = 0;
      timeStr = `${String(hours).padStart(2, '0')}:${minutes}`;
    }

    if (!dateStr) {
      // Clarification flow trigger
      return {
        reply: `I can help you add that to the Calendar. What date should I schedule it for (e.g. today, tomorrow, or a specific date)?`,
        action: null
      };
    }

    // Extract title
    let title = "Sync Session";
    if (p.includes('remind me to')) {
      title = prompt.substring(prompt.toLowerCase().indexOf('remind me to') + 12).trim();
    } else if (p.includes('add meeting about')) {
      title = prompt.substring(prompt.toLowerCase().indexOf('add meeting about') + 17).trim();
    } else if (p.includes('schedule')) {
      title = prompt.substring(prompt.toLowerCase().indexOf('schedule') + 8).trim();
    } else {
      title = prompt.replace(/(today|tomorrow|at \d+.*|on \w+day)/gi, '').trim();
      if (!title) title = "New Calendar Entry";
    }

    return {
      reply: `I've queued a calendar ${isReminder ? 'reminder' : 'task'}: "${title}" for ${dateStr} ${timeStr ? `at ${timeStr}` : ''}. Would you like me to confirm and save it?`,
      action: {
        type: 'ADD_CALENDAR_TASK',
        payload: {
          title,
          type: isReminder ? 'reminder' : 'task',
          date: dateStr,
          time: timeStr || undefined,
          category: p.includes('urgent') ? 'Urgent' : p.includes('gym') || p.includes('health') ? 'Health' : 'Work',
          description: 'Created via Spark AI voice assistant.'
        }
      }
    };
  }

  // 2. CREATE KANBAN BOARD
  if (p.includes('create board') || p.includes('create kanban') || p.includes('new board')) {
    let name = "New Board Sprint";
    const nameMatch = prompt.match(/(?:create board|create kanban board|new board)\s+(?:called|named)?\s*(.+)/i);
    if (nameMatch) {
      name = nameMatch[1].trim();
    }

    return {
      reply: `I can create a new Kanban Board named "${name}" with Todo, In Progress, and Done columns. Please click confirm below to save it.`,
      action: {
        type: 'CREATE_KANBAN_BOARD',
        payload: {
          name,
          color: '#6366F1'
        }
      }
    };
  }

  // 3. ADD KANBAN TASK
  if (p.includes('add task') || p.includes('create task') || p.includes('add a task')) {
    let title = "New Task Card";
    const titleMatch = prompt.match(/(?:add task|create task|add a task)\s+(?:called|named)?\s*(.+?)(?:\s+to\s+(?:board|kanban).*|$)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    return {
      reply: `I have prepared a new task card: "${title}". Should I add this to your active Kanban board?`,
      action: {
        type: 'ADD_KANBAN_TASK',
        payload: {
          title,
          description: 'Created by Spark AI command center.',
          priority: p.includes('high') || p.includes('urgent') ? 'High' : 'Medium',
          labels: ['Engineering']
        }
      }
    };
  }

  // 4. CREATE NOTE
  if (p.includes('create note') || p.includes('new note') || p.includes('write note')) {
    let title = "Untitled Note";
    const titleMatch = prompt.match(/(?:create note|new note|write note)\s+(?:called|named)?\s*(.+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    return {
      reply: `I've drafted a new note document: "${title}". Click confirm to save it inside your Notebook directory!`,
      action: {
        type: 'CREATE_NOTE',
        payload: {
          title,
          content: `<h1>✨ ${title}</h1><p>Notes drafted via Spark AI Assistant on ${new Date().toLocaleDateString()}.</p>`,
          color: 'teal'
        }
      }
    };
  }

  // 5. SUMMARIZE / REFINE NOTE
  if (p.includes('summarize note') || p.includes('refine note') || p.includes('rephrase note') || p.includes('rewrite note')) {
    let option = 'rephrase';
    if (p.includes('summarize') || p.includes('shorter')) {
      option = 'shorter';
    } else if (p.includes('longer') || p.includes('elaborate')) {
      option = 'longer';
    } else if (p.includes('simplify')) {
      option = 'simplify';
    }

    return {
      reply: `I can optimize and refine your active note content. Click below to run the AI refinement process.`,
      action: {
        type: 'REFINE_NOTE',
        payload: {
          option
        }
      }
    };
  }

  // 6. CREATE WHITEBOARD DIAGRAM
  if (p.includes('whiteboard') || p.includes('draw') || p.includes('flowchart') || p.includes('diagram') || p.includes('mindmap')) {
    let name = "AuraFlow Diagram";
    let type = 'flowchart';
    if (p.includes('mindmap') || p.includes('mind map')) {
      type = 'mindmap';
      name = "Cozy Mind Map";
    } else if (p.includes('architecture') || p.includes('system')) {
      type = 'system';
      name = "System Architecture";
    }

    const promptMatch = prompt.match(/(?:draw|create|generate)\s+(?:a\s+)?(?:flowchart|diagram|mindmap|system|whiteboard)?\s*(?:of|about|for)?\s*(.+)/i);
    const diagramPrompt = promptMatch ? promptMatch[1].trim() : prompt;

    return {
      reply: `I will generate a cozy Excalidraw ${type} diagram layout describing "${diagramPrompt}". Would you like to confirm and place it on the whiteboard?`,
      action: {
        type: 'CREATE_WHITEBOARD_DIAGRAM',
        payload: {
          name,
          prompt: diagramPrompt,
          type
        }
      }
    };
  }

  // 7. GENERATE TEMPLATE APP
  if (p.includes('generate template') || p.includes('build app') || p.includes('create template')) {
    const promptMatch = prompt.match(/(?:generate template|build app|create template)\s+(?:for|of)?\s*(.+)/i);
    const appPrompt = promptMatch ? promptMatch[1].trim() : prompt;

    return {
      reply: `I've queued a new template build request for: "${appPrompt}". Let's trigger the template compiler to build this single-page dashboard.`,
      action: {
        type: 'GENERATE_TEMPLATE_APP',
        payload: {
          prompt: appPrompt
        }
      }
    };
  }

  // 8. UPDATE SETTINGS
  if (p.includes('settings') || p.includes('change theme') || p.includes('dark mode') || p.includes('light mode') || p.includes('spacing')) {
    return {
      reply: `I can help you adjust your space settings. Clicking below will toggle settings parameters.`,
      action: {
        type: 'UPDATE_SETTINGS',
        payload: {
          density: p.includes('compact') ? 'compact' : 'comfortable',
          aiCopilot: true
        }
      }
    };
  }

  // DEFAULT CONVERSATION FALLBACK
  return {
    reply: `Hello Sarah! I'm your central command center Spark AI. You can chat with me, or ask me to schedule events, create Kanban tasks, refine notes, generate new custom dashboards, or sketch diagrams on the whiteboard. Try saying something like: "Add meeting with AI team tomorrow at 3pm" or "Create a Kanban board named Sprint Goals"!`,
    action: null
  };
}
