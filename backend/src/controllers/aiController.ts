import { Request, Response } from 'express';
import { aiService } from '../services/aiService.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Permission-gated Grounded Cultural Assistant query
// @route   POST /api/ai/ask
// @access  Public / Optional Auth
export const askCulturalAssistant = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a query for the cultural assistant.'
      });
    }

    const authReq = req as AuthRequest;
    const userRole = authReq.user ? authReq.user.role : 'anonymous';
    const userId = authReq.user ? (authReq.user._id as any).toString() : undefined;

    const result = await aiService.queryCulturalAssistant(query, userRole as any, userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('AI assistant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process cultural query',
      fallback: "I couldn't retrieve verified information at this moment. Please check with our custodians directly."
    });
  }
};
