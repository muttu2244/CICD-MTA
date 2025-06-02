import { analyticsEngine } from './analytics.js';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailUrl: string;
  duration: string;
}

interface YouTubeSearchResult {
  videos: YouTubeVideo[];
  totalResults: number;
  nextPageToken?: string;
}

interface SubwaySurfingPost {
  id: string;
  platform: 'youtube';
  content: string;
  title: string;
  author: string;
  timestamp: string;
  engagement: {
    views: number;
    likes: number;
    comments: number;
  };
  metadata: {
    duration: string;
    thumbnailUrl: string;
    videoId: string;
  };
  riskScore: number;
  classification: 'intent' | 'incident' | 'challenge' | 'promotion' | 'warning' | 'safe';
  keywords: string[];
}

export class YouTubeService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('YouTube API key is required');
    }
  }

  async searchVideos(query: string, maxResults: number = 50): Promise<YouTubeSearchResult> {
    try {
      // Search for videos
      const searchUrl = `${this.baseUrl}/search?` +
        `part=snippet&q=${encodeURIComponent(query)}&` +
        `type=video&maxResults=${maxResults}&` +
        `order=relevance&publishedAfter=${this.getRecentDate()}&` +
        `key=${this.apiKey}`;

      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) {
        throw new Error(`YouTube search failed: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        return { videos: [], totalResults: 0 };
      }

      // Get video details including statistics
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      const detailsUrl = `${this.baseUrl}/videos?` +
        `part=statistics,contentDetails&id=${videoIds}&` +
        `key=${this.apiKey}`;

      const detailsResponse = await fetch(detailsUrl);
      if (!detailsResponse.ok) {
        throw new Error(`YouTube details failed: ${detailsResponse.statusText}`);
      }

      const detailsData = await detailsResponse.json();

      // Combine search results with detailed statistics
      const videos: YouTubeVideo[] = searchData.items.map((item: any) => {
        const details = detailsData.items?.find((d: any) => d.id === item.id.videoId);
        const statistics = details?.statistics || {};
        const contentDetails = details?.contentDetails || {};

        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          viewCount: parseInt(statistics.viewCount || '0'),
          likeCount: parseInt(statistics.likeCount || '0'),
          commentCount: parseInt(statistics.commentCount || '0'),
          thumbnailUrl: item.snippet.thumbnails?.medium?.url || '',
          duration: contentDetails.duration || 'PT0S'
        };
      });

      return {
        videos,
        totalResults: searchData.pageInfo?.totalResults || 0,
        nextPageToken: searchData.nextPageToken
      };
    } catch (error) {
      console.error('YouTube API error:', error);
      throw error;
    }
  }

  async getSubwaySurfingContent(): Promise<SubwaySurfingPost[]> {
    const searchQueries = [
      'subway surfing NYC',
      'subway surfing challenge',
      'subway surfing incident',
      'subway surfing promotion',
      'subway surfing safety',
      'MTA subway surfing',
      'train surfing NYC',
      'subway surfing danger'
    ];

    const allPosts: SubwaySurfingPost[] = [];

    for (const query of searchQueries) {
      try {
        const results = await this.searchVideos(query, 10);
        
        for (const video of results.videos) {
          // Analyze content using AI
          const analysis = await analyticsEngine.analyzeContent(
            `${video.title} ${video.description}`,
            'youtube'
          );

          const post: SubwaySurfingPost = {
            id: `youtube_${video.id}`,
            platform: 'youtube',
            content: video.description,
            title: video.title,
            author: video.channelTitle,
            timestamp: video.publishedAt,
            engagement: {
              views: video.viewCount,
              likes: video.likeCount,
              comments: video.commentCount
            },
            metadata: {
              duration: this.formatDuration(video.duration),
              thumbnailUrl: video.thumbnailUrl,
              videoId: video.id
            },
            riskScore: analysis.riskScore,
            classification: analysis.classification as any,
            keywords: analysis.keywords
          };

          allPosts.push(post);
        }
      } catch (error) {
        console.error(`Failed to search for "${query}":`, error);
      }
    }

    // Sort by risk score and recency
    return allPosts
      .sort((a, b) => {
        const riskDiff = b.riskScore - a.riskScore;
        if (Math.abs(riskDiff) > 0.1) return riskDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      })
      .slice(0, 100); // Limit to top 100 results
  }

  private getRecentDate(): string {
    // Get videos from the last 7 days
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString();
  }

  private formatDuration(duration: string): string {
    // Convert PT4M13S to "4:13"
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export const youtubeService = new YouTubeService();