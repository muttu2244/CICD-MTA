import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface RiskAnalysis {
  riskScore: number;
  confidence: number;
  classification: 'intent' | 'location' | 'warning' | 'safe';
  reasoning: string;
  keywords: string[];
}

interface PredictiveInsight {
  id: string;
  type: 'trend_prediction' | 'risk_hotspot' | 'behavior_pattern' | 'safety_opportunity';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  emotions: string[];
  safetyRelevance: number;
}

export class AnalyticsEngine {
  async analyzeContent(content: string, platform: string): Promise<RiskAnalysis> {
    try {
      const prompt = `
        Analyze this social media content for subway surfing risk indicators:
        Content: "${content}"
        Platform: ${platform}
        
        Evaluate for:
        1. Intent to engage in subway surfing
        2. Location planning or coordination
        3. Warning signs or dangerous behavior
        4. Safety messaging or prevention content
        
        Provide analysis in JSON format:
        {
          "riskScore": number (0-100),
          "confidence": number (0-1),
          "classification": "intent|location|warning|safe",
          "reasoning": "explanation of analysis",
          "keywords": ["relevant", "keywords", "found"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return analysis as RiskAnalysis;
    } catch (error) {
      console.error('Error analyzing content:', error);
      return {
        riskScore: 0,
        confidence: 0,
        classification: 'safe',
        reasoning: 'Analysis failed',
        keywords: []
      };
    }
  }

  async generatePredictiveInsights(trendData: any[], riskFeedItems: any[]): Promise<PredictiveInsight[]> {
    try {
      const prompt = `
        Based on this subway surfing monitoring data, generate predictive insights:
        
        Trend Data: ${JSON.stringify(trendData.slice(0, 5))}
        Risk Feed: ${JSON.stringify(riskFeedItems.slice(0, 5))}
        
        Generate 3-5 actionable insights about:
        1. Emerging risk patterns
        2. Potential hotspot locations
        3. Behavioral trends
        4. Safety intervention opportunities
        
        Return JSON array of insights:
        {
          "insights": [
            {
              "id": "unique_id",
              "type": "trend_prediction|risk_hotspot|behavior_pattern|safety_opportunity",
              "title": "Brief insight title",
              "description": "Detailed explanation",
              "confidence": number (0-1),
              "timeframe": "when this applies",
              "actionable": boolean,
              "priority": "low|medium|high|critical"
            }
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{"insights":[]}');
      return result.insights || [];
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  async analyzeSentiment(content: string): Promise<SentimentAnalysis> {
    try {
      const prompt = `
        Analyze the sentiment and emotional content of this text:
        "${content}"
        
        Focus on safety-related sentiment and emotional indicators that might relate to subway surfing attitudes.
        
        Return JSON:
        {
          "sentiment": "positive|negative|neutral",
          "score": number (-1 to 1),
          "emotions": ["emotion1", "emotion2"],
          "safetyRelevance": number (0-1)
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return analysis as SentimentAnalysis;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        sentiment: 'neutral',
        score: 0,
        emotions: [],
        safetyRelevance: 0
      };
    }
  }

  async detectPatterns(historicalData: any[]): Promise<any[]> {
    try {
      const prompt = `
        Analyze this historical subway surfing data for patterns:
        ${JSON.stringify(historicalData)}
        
        Identify:
        1. Time-based patterns (when activity peaks)
        2. Location clustering
        3. Platform-specific behaviors
        4. Seasonal variations
        
        Return JSON array of detected patterns:
        {
          "patterns": [
            {
              "type": "temporal|spatial|behavioral|seasonal",
              "description": "pattern description",
              "strength": number (0-1),
              "implications": "what this means for safety"
            }
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const result = JSON.parse(response.choices[0].message.content || '{"patterns":[]}');
      return result.patterns || [];
    } catch (error) {
      console.error('Error detecting patterns:', error);
      return [];
    }
  }

  async predictRiskEvents(currentData: any): Promise<any[]> {
    try {
      const prompt = `
        Based on current subway surfing monitoring data, predict potential risk events in the next 24-48 hours:
        ${JSON.stringify(currentData)}
        
        Consider:
        1. Current activity levels
        2. Platform engagement patterns
        3. Historical precedents
        4. Environmental factors (time, weather, events)
        
        Return JSON predictions:
        {
          "predictions": [
            {
              "event": "predicted event type",
              "probability": number (0-1),
              "timeframe": "when it might occur",
              "location": "where it might happen",
              "preventionActions": ["action1", "action2"]
            }
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const result = JSON.parse(response.choices[0].message.content || '{"predictions":[]}');
      return result.predictions || [];
    } catch (error) {
      console.error('Error predicting risk events:', error);
      return [];
    }
  }
}

export const analyticsEngine = new AnalyticsEngine();