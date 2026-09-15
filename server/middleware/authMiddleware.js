import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required. Please log in to continue.',
      });
    }

    const secret = process.env.JWT_SECRET || 'onecore_pharma_jwt_secure_key_2026_super_secret_token';
    
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.',
      });
    }

    // Fetch user from MySQL
    const users = await query(
      `SELECT u.id, u.name, u.email, u.role_id, u.is_active, u.must_change_password, r.name as role_name
       FROM admin_users u
       JOIN admin_roles r ON u.role_id = r.id
       WHERE u.id = ? AND u.is_active = 1`,
      [decoded.userId]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or inactive.',
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error occurred.',
    });
  }
};
