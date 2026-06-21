import { NextResponse } from 'next/server';

const COLORS = {
  emerald: '#10B981',
  cyan: '#06B6D4',
  amber: '#D97706',
  indigo: '#6366F1',
  rose: '#EC4899',
  orange: '#F97316',
  coral: '#FF6B5A',
  slate: '#64748B',
};

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const systemPrompt = `You are a professional web app and template layout generator. Your task is to output a single-page mini application layout based on the user's request: "${prompt}".
You must return ONLY a raw JSON object. Do not include markdown code blocks, do not include any explanatory text before or after the JSON, and do not wrap the JSON in backticks.
The JSON must adhere strictly to this schema:
{
  "appName": "A short, catchy name for the app",
  "description": "A short description of what the app does",
  "icon": "One of these exact strings: 'Flame', 'Wallet', 'DollarSign', 'Utensils', 'BookOpen', 'Activity', 'Compass', 'CheckSquare', 'Sparkles', 'Trophy', 'Shield', 'Layers', 'ListTodo'",
  "color": "One of these pastel/accent hex codes: '#10B981' (Emerald), '#06B6D4' (Cyan), '#D97706' (Amber), '#6366F1' (Indigo), '#EC4899' (Rose), '#F97316' (Orange), '#FF6B5A' (Coral), '#64748B' (Slate)",
  "layout": "single-page",
  "sections": [
    {
      "id": "section_unique_id",
      "title": "Title of the Section",
      "components": [
        {
          "id": "comp_unique_id",
          "type": "stats" | "list" | "table" | "form" | "progress" | "checklist" | "tags" | "chart",
          "title": "Component Title",
          
          // REQUIRED FOR "stats":
          "stats": [
            { "label": "Stat Label", "value": "Stat Value", "desc": "Optional short subtext" }
          ],
          
          // REQUIRED FOR "checklist":
          "items": [
            { "id": "check_item_id", "label": "Item Label", "checked": false }
          ],
          
          // REQUIRED FOR "progress":
          "value": 50, // number from 0 to 100
          
          // REQUIRED FOR "form":
          "fields": [
            { "id": "field_id", "label": "Field Label", "type": "text" | "number" | "select" | "checkbox", "placeholder": "Optional placeholder", "options": ["Option A", "Option B"] }
          ],
          "submitText": "Submit Button Label",
          
          // REQUIRED FOR "table":
          "headers": ["Col 1", "Col 2"],
          "rows": [
            ["Val 1A", "Val 1B"],
            ["Val 2A", "Val 2B"]
          ],
          
          // REQUIRED FOR "list":
          "items": [
            { "id": "list_item_id", "title": "Main Title", "subtitle": "Optional subtitle", "tag": "Optional Tag", "tagColor": "hex code color" }
          ],
          
          // REQUIRED FOR "chart":
          "chartType": "bar" | "line" | "pie",
          "labels": ["Label A", "Label B", "Label C"],
          "data": [30, 50, 20],
          
          // REQUIRED FOR "tags":
          "tags": [
            { "label": "Tag Text", "color": "hex code color" }
          ]
        }
      ]
    }
  ]
}

Layout Guidelines:
1. Provide a realistic experience with 2-3 sections.
2. In each section, place 1-2 relevant components.
3. Make sure the template starts in an empty or clean initial state. For example:
   - Stats cards representing totals or metrics (like spent, balance, completed habits, hours) must start at 0, 0%, or $0.00.
   - Checklists must have all items set to "checked": false.
   - Progress components must start at "value": 0.
   - Tables must start with no rows: "rows": [].
   - Charts must start with baseline zero data: "data": [0, 0, 0...].
   - Lists must start empty: "items": [].
4. Ensure components in sections flow logically (e.g. stats and charts at the top or side, checklists and forms together, tables at the bottom).
`;

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

          if (responseText.startsWith('```')) {
            responseText = responseText.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
          }
          responseText = responseText.trim();

          const parsed = JSON.parse(responseText);
          if (parsed.appName && parsed.sections) {
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.error('Gemini API execution failed for template, falling back to mock generator:', err);
      }
    }

    // Fallback: Smart mock template generator
    const mockApp = generateMockApp(prompt);
    
    // Small delay to simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return NextResponse.json(mockApp);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate template' }, { status: 500 });
  }
}

function generateMockApp(prompt: string): any {
  const p = prompt.toLowerCase();

  // 1. Habit Tracker
  if (p.includes('habit') || p.includes('streak') || p.includes('routine')) {
    return {
      appName: "Habit Streak Master",
      description: "Build consistency, track daily rituals, and monitor weekly streaks.",
      icon: "Flame",
      color: COLORS.orange,
      layout: "single-page",
      sections: [
        {
          id: "sec_habits_stats",
          title: "Dashboard & Progress",
          components: [
            {
              id: "comp_habits_stats",
              type: "stats",
              title: "Habit Streak Performance",
              stats: [
                { label: "Longest Streak", value: "0 Days", desc: "Start today!" },
                { label: "Daily Completion", value: "0%", desc: "No habits completed today" },
                { label: "Total Habits Pinned", value: "6 Habits", desc: "Active this month" }
              ]
            },
            {
              id: "comp_habits_progress",
              type: "progress",
              title: "Weekly Habit Completion Goal",
              value: 0
            }
          ]
        },
        {
          id: "sec_habits_list",
          title: "Daily Habits Checklist",
          components: [
            {
              id: "comp_habits_chk",
              type: "checklist",
              title: "Today's Rituals",
              items: [
                { id: "h1", label: "🧘‍♀️ Morning Meditation", checked: false },
                { id: "h2", label: "💧 Drink 3 Liters of Water", checked: false },
                { id: "h3", label: "📚 Read 15 Pages", checked: false },
                { id: "h4", label: "🏋️‍♀️ Exercise & Workout", checked: false },
                { id: "h5", label: "💻 Code/Learn for 45 Mins", checked: false },
                { id: "h6", label: "💤 Sleep before 11 PM", checked: false }
              ]
            },
            {
              id: "comp_habits_form",
              type: "form",
              title: "Create New Habit Tracker",
              fields: [
                { id: "habitName", label: "Habit Name", type: "text", placeholder: "e.g., Floss teeth" },
                { id: "habitCategory", label: "Category", type: "select", options: ["Health", "Mind", "Learning", "Career"] },
                { id: "habitGoal", label: "Daily Goal", type: "text", placeholder: "e.g., 2 times a day" }
              ],
              submitText: "Add Habit"
            }
          ]
        }
      ]
    };
  }

  // 2. Budget Tracker
  if (p.includes('budget') || p.includes('finance') || p.includes('expense') || p.includes('spend') || p.includes('money')) {
    return {
      appName: "Cozy Wallet",
      description: "Manage monthly expenses, control budgets, and review spending patterns.",
      icon: "Wallet",
      color: COLORS.emerald,
      layout: "single-page",
      sections: [
        {
          id: "sec_fin_overview",
          title: "Financial Overview",
          components: [
            {
              id: "comp_fin_stats",
              type: "stats",
              title: "June Balance Sheets",
              stats: [
                { label: "Total Balance", value: "$0.00", desc: "No logs registered" },
                { label: "Monthly Income", value: "$0.00", desc: "Salary + Freelance" },
                { label: "Total Expenses", value: "$0.00", desc: "0% of income" }
              ]
            },
            {
              id: "comp_fin_chart",
              type: "chart",
              chartType: "pie",
              title: "Expense Breakdown",
              labels: ["Rent & Utilities", "Groceries", "Entertainment", "Transport", "Savings"],
              data: [0, 0, 0, 0, 0]
            }
          ]
        },
        {
          id: "sec_fin_records",
          title: "Ledger Entries & Forms",
          components: [
            {
              id: "comp_fin_table",
              type: "table",
              title: "Recent Transaction History",
              headers: ["Date", "Description", "Category", "Amount"],
              rows: []
            },
            {
              id: "comp_fin_form",
              type: "form",
              title: "Log New Transaction",
              fields: [
                { id: "amount", label: "Amount ($)", type: "number", placeholder: "e.g., 15.50" },
                { id: "desc", label: "Transaction Description", type: "text", placeholder: "e.g., Grocery store run" },
                { id: "category", label: "Budget Category", type: "select", options: ["Rent & Utilities", "Groceries", "Entertainment", "Transport", "Savings"] }
              ],
              submitText: "Log Expense"
            }
          ]
        }
      ]
    };
  }

  // 3. Meal Planner
  if (p.includes('meal') || p.includes('food') || p.includes('recipe') || p.includes('grocery') || p.includes('cook') || p.includes('neal')) {
    return {
      appName: "Meal & Grocery Planner",
      description: "Organize weekly meals, design recipes, and generate smart grocery checklists.",
      icon: "Utensils",
      color: COLORS.rose,
      layout: "single-page",
      sections: [
        {
          id: "sec_meal_plan",
          title: "Weekly Meal Calendar",
          components: [
            {
              id: "comp_meal_table",
              type: "table",
              title: "This Week's Meal Planner",
              headers: ["Day", "Breakfast", "Lunch", "Dinner"],
              rows: [
                ["Monday", "", "", ""],
                ["Tuesday", "", "", ""],
                ["Wednesday", "", "", ""],
                ["Thursday", "", "", ""],
                ["Friday", "", "", ""]
              ]
            }
          ]
        },
        {
          id: "sec_grocery_list",
          title: "Grocery Shopping Checklist",
          components: [
            {
              id: "comp_grocery_chk",
              type: "checklist",
              title: "Ingredients to Buy",
              items: [
                { id: "g1", label: "🥑 Avocados", checked: false },
                { id: "g2", label: "🥬 Romaine Lettuce", checked: false },
                { id: "g3", label: "🍝 Penne Pasta", checked: false },
                { id: "g4", label: "🥩 Chicken Breast", checked: false },
                { id: "g5", label: "🥛 Almond Milk", checked: false },
                { id: "g6", label: "🍅 Tomatoes", checked: false }
              ]
            },
            {
              id: "comp_grocery_form",
              type: "form",
              title: "Add Grocery Item",
              fields: [
                { id: "itemName", label: "Grocery Item & Qty", type: "text", placeholder: "e.g., Greek Yogurt 500g" },
                { id: "itemCategory", label: "Aisle Section", type: "select", options: ["Produce", "Dairy", "Meat & Seafood", "Pantry", "Bakery"] }
              ],
              submitText: "Add Item"
            }
          ]
        }
      ]
    };
  }

  // 4. Study Planner
  if (p.includes('study') || p.includes('exam') || p.includes('course') || p.includes('homework') || p.includes('learn') || p.includes('class')) {
    return {
      appName: "Study Hub",
      description: "Manage classes, track assignments, and allocate study pomodoro slots.",
      icon: "BookOpen",
      color: COLORS.indigo,
      layout: "single-page",
      sections: [
        {
          id: "sec_study_stats",
          title: "Aura Study Overview",
          components: [
            {
              id: "comp_study_stats",
              type: "stats",
              title: "Academic Key Metrics",
              stats: [
                { label: "Focus Hours", value: "0.0 Hrs", desc: "No study logs recorded" },
                { label: "Pending Tasks", value: "4 Tasks", desc: "Complete checklists below" },
                { label: "Completed Courses", value: "0 of 4", desc: "On track for finals" }
              ]
            },
            {
              id: "comp_study_progress",
              type: "progress",
              title: "Exam Preparation Progress",
              value: 0
            }
          ]
        },
        {
          id: "sec_study_tasks",
          title: "Tasks & Assignments Ledger",
          components: [
            {
              id: "comp_study_chk",
              type: "checklist",
              title: "Assignments Checklist",
              items: [
                { id: "st1", label: "📖 Read Assigned Chapters", checked: false },
                { id: "st2", label: "🔬 Complete lab exercises", checked: false },
                { id: "st3", label: "💻 Implement application structures", checked: false },
                { id: "st4", label: "📝 Draft essay outline", checked: false }
              ]
            },
            {
              id: "comp_study_form",
              type: "form",
              title: "Add Study Task",
              fields: [
                { id: "taskTitle", label: "Assignment/Task Title", type: "text", placeholder: "e.g., Write React docs summary" },
                { id: "courseName", label: "Related Course", type: "select", options: ["Computer Science", "Physics II", "Modern History", "Calculus III"] },
                { id: "estimatedHours", label: "Est. Hours", type: "number", placeholder: "e.g., 2" }
              ],
              submitText: "Schedule Task"
            }
          ]
        }
      ]
    };
  }

  // 5. Travel Planner
  if (p.includes('travel') || p.includes('trip') || p.includes('pack') || p.includes('flight') || p.includes('explore') || p.includes('itinerary')) {
    return {
      appName: "Cozy Wanderer",
      description: "Design itinerary timelines, structure packing lists, and coordinate bookings.",
      icon: "Compass",
      color: COLORS.amber,
      layout: "single-page",
      sections: [
        {
          id: "sec_travel_overview",
          title: "Trip Outline",
          components: [
            {
              id: "comp_travel_stats",
              type: "stats",
              title: "Summer Vacation Countdowns",
              stats: [
                { label: "Destination", value: "Not Set", desc: "Enter details" },
                { label: "Total Duration", value: "0 Days", desc: "No bookings verified" },
                { label: "Budget Remaining", value: "$0.00", desc: "Awaiting logs" }
              ]
            },
            {
              id: "comp_travel_timeline",
              type: "list",
              title: "Daily Travel Itinerary",
              items: []
            }
          ]
        },
        {
          id: "sec_travel_packing",
          title: "Preparation & Packing",
          components: [
            {
              id: "comp_travel_pack",
              type: "checklist",
              title: "Essential Packing Checklist",
              items: [
                { id: "p1", label: "Passport & Tickets", checked: false },
                { id: "p2", label: "Power Adaptors", checked: false },
                { id: "p3", label: "Walking Shoes", checked: false },
                { id: "p4", label: "Shell Jacket / Umbrella", checked: false },
                { id: "p5", label: "Chargers & Camera Gear", checked: false }
              ]
            },
            {
              id: "comp_travel_form",
              type: "form",
              title: "Add Packing Item",
              fields: [
                { id: "itemName", label: "Item Description", type: "text", placeholder: "e.g., Toothbrush" },
                { id: "itemCategory", label: "Packing Category", type: "select", options: ["Essentials", "Electronics", "Clothing", "Toiletries"] }
              ],
              submitText: "Add Item"
            }
          ]
        }
      ]
    };
  }

  // 6. Generic Creator based on App Name
  const formattedAppName = prompt
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    appName: formattedAppName || "My Custom Workspace",
    description: `A custom-generated single-page template tailored for "${prompt}".`,
    icon: "Sparkles",
    color: COLORS.indigo,
    layout: "single-page",
    sections: [
      {
        id: "sec_custom_dashboard",
        title: "Workspace Center",
        components: [
          {
            id: "comp_custom_stats",
            type: "stats",
            title: "Performance Monitor",
            stats: [
              { label: "Active Items", value: "0 Items", desc: "No entries" },
              { label: "Completion Rate", value: "0%", desc: "Target 85%" },
              { label: "Status Status", value: "Inactive", desc: "Service pending" }
            ]
          },
          {
            id: "comp_custom_progress",
            type: "progress",
            title: "Overall Milestones Reached",
            value: 0
          }
        ]
      },
      {
        id: "sec_custom_records",
        title: "Database Items & Entries",
        components: [
          {
            id: "comp_custom_list",
            type: "list",
            title: "Workspace Checklist & Log",
            items: []
          },
          {
            id: "comp_custom_form",
            type: "form",
            title: "Record Entry Form",
            fields: [
              { id: "title", label: "Entry Title", type: "text", placeholder: "e.g., Finish code review" },
              { id: "description", label: "Brief Description", type: "text", placeholder: "e.g., Verify Next.js routing parameters" },
              { id: "priority", label: "Priority", type: "select", options: ["High", "Medium", "Low"] }
            ],
            submitText: "Log Entry"
          }
        ]
      }
    ]
  };
}
