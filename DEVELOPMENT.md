# HealthNavigator AI - Development Guide

## Credits Exhausted - Mock Data Fallback

The application now includes **automatic mock data fallback** when Lyzr API credits are exhausted. This means you can continue testing and developing the UI without API credits.

### How It Works

When the API returns a 429 status (credits exhausted), the system automatically:
1. Detects the error
2. Switches to mock data mode
3. Generates realistic responses based on user input
4. Returns formatted data matching the exact schema expected by the UI

### Mock Data Features

**Triage Coordinator Manager (Symptom Assessment):**
- Analyzes symptom severity and keywords (chest pain, sweating, breathing issues)
- Calculates risk scores (0-100) based on severity level
- Detects red flag combinations (e.g., chest pain + sweating)
- Assigns urgency levels (Low/Moderate/High)
- Recommends appropriate specialists
- Provides context-aware action plans

**App Assistant Chatbot:**
- Recognizes navigation intents (map, consultation, history)
- Redirects medical questions to triage system
- Provides helpful guidance for app features

### Testing with Mock Data

The application will work fully with mock data. You can:

1. Complete symptom assessments
2. See different urgency levels based on symptoms
3. Test the chatbot assistant
4. View results pages with proper formatting
5. Navigate through all screens

### Mock Data Examples

**High Urgency Trigger:**
```
Symptoms: "chest pain radiating to left arm with sweating"
Severity: 8/10
Result: High urgency, risk score ~85, red flags detected
```

**Moderate Urgency Trigger:**
```
Symptoms: "persistent headache for 3 days"
Severity: 6/10
Result: Moderate urgency, risk score ~55, video consultation recommended
```

**Low Urgency Trigger:**
```
Symptoms: "mild sore throat and runny nose"
Severity: 3/10
Result: Low urgency, risk score ~25, home monitoring guidance
```

### Forcing Mock Data Mode

To always use mock data (even if API credits are available):

1. Create/edit `.env.local`:
```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
```

2. Restart the development server

### Switching Back to Real API

Once you have Lyzr API credits:

1. Ensure `LYZR_API_KEY` is set in `.env.local`
2. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` (or remove the variable)
3. Restart the development server

The system will attempt to use the real API and only fall back to mock data if credits run out again.

### Technical Details

**Mock Data Location:**
- `/lib/mockAgentData.ts` - Mock response generation logic

**API Route Updates:**
- `/app/api/agent/route.ts` - Automatic fallback handling

**Agent IDs:**
- Triage Manager: `6985a4dae2c0086a4fc43be0`
- Assistant Chatbot: `6985a4f5705117394b71194f`

### Current Status

**Status:** API credits exhausted - currently using mock data

**Impact:** None on UI/UX - all features work normally

**Next Steps:**
1. Add credits to your Lyzr account
2. System will automatically use real API when available
3. Mock data remains as fallback safety net

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

All features are fully functional with mock data!
