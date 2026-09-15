import { query } from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Live counts from MySQL tables
    const [taCount] = await query('SELECT COUNT(*) as count FROM therapeutic_areas WHERE is_active = 1');
    const [prodCount] = await query("SELECT COUNT(*) as count FROM products WHERE status = 'published'");
    const [newsCount] = await query("SELECT COUNT(*) as count FROM news_articles WHERE status = 'published'");
    const [newEnquiriesCount] = await query("SELECT COUNT(*) as count FROM contact_enquiries WHERE status = 'new'");
    const [totalEnquiriesCount] = await query('SELECT COUNT(*) as count FROM contact_enquiries');
    const [mediaCount] = await query('SELECT COUNT(*) as count FROM media');

    // 2. Recent enquiries (up to 5)
    const recentEnquiries = await query(
      `SELECT id, full_name, email, organisation, contacting_as, enquiry_type, status, submitted_at
       FROM contact_enquiries
       ORDER BY submitted_at DESC
       LIMIT 5`
    );

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          therapeuticAreas: taCount?.count || 0,
          products: prodCount?.count || 0,
          publishedNews: newsCount?.count || 0,
          newEnquiries: newEnquiriesCount?.count || 0,
          totalEnquiries: totalEnquiriesCount?.count || 0,
          totalMedia: mediaCount?.count || 0,
        },
        recentEnquiries: recentEnquiries || [],
      },
    });
  } catch (error) {
    next(error);
  }
};
