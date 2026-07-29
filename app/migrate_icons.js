const fs = require('fs');
const path = require('path');

const files = [
  'src/components/navigation/LeftNavigationDrawer.tsx',
  'src/components/prayer/PrayerDetailsBottomSheet.tsx',
  'src/components/location/LocationPickerBottomSheet.tsx',
  'src/components/layout/FeatureGrid.tsx',
  'src/components/goals/GoalTemplateCard.tsx',
  'src/components/goals/GoalProgressCard.tsx',
  'src/components/glass/GlassHeader.tsx',
  'src/components/dashboard/DashboardGoalWidget.tsx',
  'src/components/dashboard/DailySummaryCard.tsx',
  'src/components/analytics/AnalyticsSummaryCard.tsx',
  'src/components/ai-motivation/WelcomeCard.tsx',
  'src/components/ai-motivation/SuggestionChips.tsx',
  'src/components/ai-motivation/SpiritualInsightsBottomSheet.tsx',
  'src/components/ai-motivation/ChatInput.tsx',
  'src/components/ai-motivation/ChatBubble.tsx',
  'src/components/ai-motivation/AiChatBottomSheet.tsx'
];

for (const relPath of files) {
  const fullPath = path.join('d:/SalahMate/app', relPath);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace tags
  content = content.replace(/<MaterialCommunityIcons/g, '<AppIcon');
  content = content.replace(/<\/MaterialCommunityIcons>/g, '</AppIcon>');

  // Handle imports
  if (content.includes(import { MaterialCommunityIcons } from '@expo/vector-icons';)) {
    content = content.replace(import { MaterialCommunityIcons } from '@expo/vector-icons';\n, '');
    
    // Add AppIcon to existing @/components import if it exists
    if (content.includes(} from '@/components')) {
      if (!content.includes('AppIcon')) {
        content = content.replace(/import \{([^}]*)\} from '@\/components';/, (match, p1) => {
          return import { AppIcon,  } from '@/components';;
        });
      }
    } else {
      content = import { AppIcon } from '@/components';\n + content;
    }
  }

  // Handle glyphMap references
  content = content.replace(/keyof typeof MaterialCommunityIcons\.glyphMap/g, 'string');

  fs.writeFileSync(fullPath, content);
  console.log('Migrated ' + relPath);
}
