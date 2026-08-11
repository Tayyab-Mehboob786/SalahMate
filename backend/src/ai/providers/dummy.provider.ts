import { Injectable } from '@nestjs/common';
import { AIProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class DummyAIProvider implements AIProvider {
  async generateResponse(prompt: string, context: Record<string, any>): Promise<{ reply: string; suggestions: string[] }> {
    const {
      userName,
      todayCompletion,
      missedPrayers,
      streak,
      currentPrayer,
      nextPrayer,
      timeOfDay,
    } = context;

    let reply = `Assalamu alaykum, ${userName}.\n\n`;
    let suggestions: string[] = [];

    // Case 1: All prayers completed
    if (todayCompletion === 5) {
      reply += `Alhamdulillah, ${userName}! You have completed all five prayers today. May Allah accept your worship and keep you steadfast.`;
      suggestions = ['Recommend a Sunnah deed', 'Suggest a dua for gratitude'];
    }
    // Case 2: One prayer remaining
    else if (todayCompletion === 4) {
      reply += `Great progress today! Only ${nextPrayer} remains. May Allah make it easy for you to complete today's Salah.`;
      suggestions = [`How to prepare for ${nextPrayer}?`, 'Share a short Dua'];
    }
    // Case 3: No prayers logged
    else if (todayCompletion === 0 && missedPrayers.length > 0) {
      reply += `I noticed you haven't logged any prayers today. Every prayer is an opportunity to draw closer to Allah. Let's begin with the next Salah.`;
      suggestions = ['How can I improve my consistency?', 'Give me a reminder'];
    }
    // Case 4: Long streak
    else if (streak >= 30) {
      reply += `MashaAllah! You have maintained a ${streak}-day prayer streak. Consistency is one of the most beloved deeds to Allah.`;
      suggestions = ['How do I maintain consistency?', 'Share a motivational Hadith'];
    }
    // Case 5: Streak broken
    else if (streak === 0 && todayCompletion < 5) {
      reply += `Missing a day does not define your journey. Sincere repentance and a fresh start are always available. Let's rebuild your streak together.`;
      suggestions = ['How to build a habit of prayer?', 'Forgiveness in Islam'];
    }
    // Case 7: Late night
    else if (timeOfDay === 'Late Night' || timeOfDay === 'Night') {
      reply += `It's almost the end of the day. Reflect on today's worship and prepare your heart for tomorrow's Fajr.`;
      suggestions = ['Nighttime Sunnahs', 'Dua for sleep'];
    }
    // Case 6: Current prayer time (Fallback generic)
    else {
      reply += `It's currently time for ${currentPrayer}. If you haven't prayed yet, this is a wonderful opportunity.`;
      suggestions = [`Tips for ${currentPrayer}`, 'General Salah advice'];
    }

    return {
      reply,
      suggestions,
    };
  }

  async generateInsight(context: Record<string, any>): Promise<string> {
    const { userName, todayCompletion, streak, currentPrayer, nextPrayer } = context;

    if (todayCompletion === 5) {
      return `Alhamdulillah ${userName}, you've completed all 5 prayers today! Maintain your ${streak}-day streak!`;
    } else if (streak >= 7) {
      return `MashaAllah, you are on a ${streak}-day prayer streak. Keep it up!`;
    } else if (todayCompletion === 0) {
      return `Every prayer is an opportunity, ${userName}. Let's begin with ${nextPrayer}.`;
    } else {
      return `It's time for ${currentPrayer}. May Allah make it easy for you to pray on time.`;
    }
  }
}
