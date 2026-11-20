import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';
import Custodian, { ICustodian } from '../models/Custodian.js';

export interface AuthRequest extends Request {
  user?: IUser;
  custodian?: ICustodian | null;
}

const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return process.env.JWT_SECRET;
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    try {
      const decoded = jwt.verify(token, getJwtSecret()) as { id: string };
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User account not found'
        });
      }

      req.user = user;

      // If user is a custodian, optionally fetch their custodian record
      if (user.role === 'custodian' || user.custodianId) {
        req.custodian = await Custodian.findOne({ userId: user._id });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication server error'
    });
  }
};

// Optional auth: allows public calls, but if token is supplied, attaches user
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, getJwtSecret()) as { id: string };
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          if (user.role === 'custodian' || user.custodianId) {
            req.custodian = await Custodian.findOne({ userId: user._id });
          }
        }
      } catch (e) {
        // Ignore token errors for optional auth
      }
    }
    next();
  } catch (error) {
    next();
  }
};

// Role authorization
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' is not authorized for this resource`
      });
    }
    next();
  };
};

// Verified Custodian authorization
export const requireVerifiedCustodian = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.role === 'admin') {
    return next(); // Admins bypass
  }

  if (req.user.role !== 'custodian') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to cultural custodians'
    });
  }

  const custodian = req.custodian || (await Custodian.findOne({ userId: req.user._id }));

  if (!custodian) {
    return res.status(403).json({
      success: false,
      message: 'No custodian profile registered for this account'
    });
  }

  if (custodian.verificationStatus !== 'VERIFIED') {
    return res.status(403).json({
      success: false,
      message: `Custodian verification pending or rejected (Current status: ${custodian.verificationStatus}). Only verified custodians can publish content or experiences.`,
      status: custodian.verificationStatus
    });
  }

  req.custodian = custodian;
  next();
};
