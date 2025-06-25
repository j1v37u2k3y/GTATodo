# GTA Online Daily Money Checklist

A comprehensive web application to maximize your daily earnings in GTA Online. Track your progress through various
money-making activities with detailed strategies, filtering, and launch location guidance.

![Potential Daily Earnings: $3-5 Million+](https://img.shields.io/badge/Potential%20Daily%20Earnings-$3--5%20Million+-brightgreen)

## Features

- **🎯 Comprehensive Activity Tracking** - Check off completed activities and see your progress
- **📊 Advanced Filtering** - Filter by money potential, difficulty, launch location, and more
- **📍 Launch Location Guide** - Know exactly where to start each activity
- **✅ Completed Tasks View** - Clean summary of your daily accomplishments
- **💾 Progress Persistence** - Your progress is saved between sessions
- **📱 Responsive Design** - Works on desktop and mobile
- **🔧 Data-driven Architecture** - Easy to update missions without touching code

## Quick Start

1. Clone or download this repository
2. Start a local server (required for JSON loading):
   ```bash
   python -m http.server 8000
   # or use VS Code Live Server extension
   ```
3. Open `http://localhost:8000` in your browser
4. Start checking off activities to track your daily earnings!

## Activity Categories

- **⚡ Quick Money (15-30 min)** - CEO/VIP work, nightclub sales, agency contracts
- **🏆 Heists** - Cayo Perico, Casino, Auto Shop contracts, Classic heists, Doomsday
- **🏢 Businesses** - Vehicle cargo, bunker, special cargo, MC businesses
- **📅 Daily & Weekly** - Time trials, daily objectives, passive income collection

## Filtering System

Filter activities by:

- 💰 **Money Potential** - Low, Medium, High, Very High
- ⏰ **Time Required** - Quick, Short, Medium, Long, Very Long
- 🎯 **Difficulty** - Easy, Medium, Hard, Expert
- 👥 **Solo Friendly** - Solo Only, Solo Capable, Team Preferred, Team Required
- 📍 **Launch Location** - Interaction Menu, CEO Office, Agency, Auto Shop, etc.
- 🏆 **Priority** - High, Medium, Low

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data**: JSON-based mission data
- **Storage**: localStorage for progress persistence
- **Dependencies**: None (pure web technologies)

---

# Developer Documentation

*This section provides guidance for developers and Claude Code instances working with this repository.*

## Project Structure

```
GTATodo/
├── index.html              # Main HTML file (minimal structure)
├── index-original.html     # Original single-file version (backup)
├── css/
│   └── styles.css         # Application styles with modern design
├── js/
│   └── app.js             # GTAChecklist class and application logic
├── data/
│   └── missions.json      # All mission/activity data (easily editable)
└── README.md              # This file (serves as both README and CLAUDE.md)
```

## Development Commands

This is a static web application with no build process:

- **Run locally**: `python -m http.server 8000` (requires local server for JSON loading)
- **Test changes**: Refresh browser after saving files
- **No build/lint/test commands**: Simple static files with no tooling

## Architecture Details

### Core Components

1. **data/missions.json** - Centralized data storage
    - All mission and activity data
    - Organized by categories → sections → activities
    - Includes filtering metadata and launch locations
    - Easy to update without code changes

2. **js/app.js** - Application logic
    - `GTAChecklist` class handles all functionality
    - Dynamic DOM rendering from JSON data
    - Progress tracking and persistence
    - Advanced filtering system
    - Completed tasks view

3. **css/styles.css** - Modern styling
    - Gradient backgrounds and animations
    - Responsive grid layouts
    - Filter UI components
    - Completed tasks styling

4. **index.html** - Minimal structure
    - Container elements for dynamic content
    - Filter controls UI
    - Progress tracking elements

### Data Structure

```json
{
  "categories": [
    {
      "id": "category-id",
      "name": "Category Name",
      "icon": "⚡",
      "sections": [
        {
          "id": "section-id",
          "name": "Section Name",
          "activities": [
            {
              "id": "activity-id",
              "name": "Activity Name",
              "priority": "HIGH|MEDIUM|LOW",
              "reward": "$amount",
              "time": "duration",
              "difficulty": "Easy|Medium|Hard|Expert",
              "moneyPotential": "Low ($0-50K)|Medium ($50K-200K)|High ($200K-500K)|Very High ($500K+)",
              "timeRequired": "Quick (0-15 min)|Short (15-30 min)|Medium (30-60 min)|Long (1-2 hours)|Very Long (2+ hours)",
              "soloFriendly": "Solo Only|Solo Capable|Team Preferred|Team Required",
              "launchLocation": {
                "icon": "📱",
                "name": "Location Name",
                "method": "Optional access instructions"
              },
              "requirements": [
                "Requirement 1",
                "Requirement 2"
              ],
              "vehicles": {
                "setup": [
                  "Vehicle 1",
                  "Vehicle 2"
                ],
                "strategy": "Strategy description"
              },
              "details": [
                "Step 1",
                "Step 2",
                "Step 3"
              ]
            }
          ]
        }
      ]
    }
  ],
  "filters": {
    "difficulty": [
      "Easy",
      "Medium",
      "Hard",
      "Expert"
    ],
    "moneyPotential": [
      "Low ($0-50K)",
      "Medium ($50K-200K)",
      "High ($200K-500K)",
      "Very High ($500K+)"
    ],
    "timeRequired": [
      "Quick (0-15 min)",
      "Short (15-30 min)",
      "Medium (30-60 min)",
      "Long (1-2 hours)",
      "Very Long (2+ hours)"
    ],
    "soloFriendly": [
      "Solo Only",
      "Solo Capable",
      "Team Preferred",
      "Team Required"
    ],
    "launchLocation": [
      "Interaction Menu",
      "CEO Office",
      "Agency",
      "Auto Shop",
      ...
    ]
  }
}
```

## Key Features Implementation

### Filtering System

- Multi-criteria filtering with real-time updates
- Visual indicators on tasks showing filter properties
- Section visibility management (hide empty sections)
- Clear all filters functionality

### Launch Locations

- 21 unique launch locations covering all GTA Online activities
- Visual icons and descriptive names
- Optional method instructions for complex access
- Integrated into filtering system

### Completed Tasks View

- Toggle between main tasks and completed summary
- Minimal list format with essential info
- Category badges and reward amounts
- Launch location indicators

### Progress Persistence

- localStorage saves completion state
- Survives browser sessions and refreshes
- Progress bar and counters update in real-time

## Adding New Content

To add new missions or activities:

1. Edit `data/missions.json`
2. Add to appropriate category and section
3. Include all required fields (especially filtering metadata)
4. Add launch location information
5. No code changes needed!

Example activity:

```json
{
   "id": "new-mission",
   "name": "New Mission Name",
   "priority": "HIGH",
   "reward": "$100,000",
   "time": "15 minutes",
   "difficulty": "Medium",
   "moneyPotential": "Medium ($50K-200K)",
   "timeRequired": "Short (15-30 min)",
   "soloFriendly": "Solo Capable",
   "launchLocation": {
      "icon": "📱",
      "name": "Interaction Menu",
      "method": "SecuroServ > VIP/CEO Work > Mission Name"
   },
   "requirements": [
      "CEO/VIP Status"
   ],
   "details": [
      "Step 1",
      "Step 2",
      "Step 3"
   ]
}
```

## Important Notes

- **Browser Security**: Requires local server to load JSON files
- **Data Integrity**: All mission data centralized in JSON for consistency
- **Backup**: Original single-file version preserved as `index-original.html`
- **No External Dependencies**: Pure web technologies for maximum compatibility
- **Mobile First**: Responsive design works on all devices

## Contributing

1. Fork the repository
2. Make changes to `data/missions.json` for content updates
3. Test locally with a web server
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).