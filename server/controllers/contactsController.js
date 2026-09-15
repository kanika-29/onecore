import { query } from '../config/db.js';

export const submitContactEnquiry = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      organisation,
      contactType,
      natureOfEnquiry,
      message,
    } = req.body;

    // Strict backend validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }
    if (!contactType || !contactType.trim()) {
      return res.status(400).json({ success: false, message: 'Contact role category is required.' });
    }
    if (!natureOfEnquiry || !natureOfEnquiry.trim()) {
      return res.status(400).json({ success: false, message: 'Nature of enquiry is required.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    // Sanitize & insert into MySQL with default status 'new'
    const result = await query(
      `INSERT INTO contact_enquiries
       (full_name, email, phone, organisation, contacting_as, enquiry_type, message, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new', NOW())`,
      [
        fullName.trim().slice(0, 120),
        email.trim().toLowerCase().slice(0, 150),
        phone ? phone.trim().slice(0, 50) : null,
        organisation ? organisation.trim().slice(0, 150) : null,
        contactType.trim().slice(0, 80),
        natureOfEnquiry.trim().slice(0, 80),
        message.trim().slice(0, 5000),
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you. Your enquiry has been received.',
      data: {
        enquiryId: result.insertId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;

    let sql = 'SELECT * FROM contact_enquiries WHERE 1=1';
    const params = [];

    if (status && ['new', 'in_progress', 'resolved', 'archived'].includes(status)) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ' AND (full_name LIKE ? OR email LIKE ? OR organisation LIKE ? OR message LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword, keyword);
    }

    sql += ' ORDER BY submitted_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const enquiries = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM contact_enquiries WHERE 1=1';
    const countParams = [];
    if (status && ['new', 'in_progress', 'resolved', 'archived'].includes(status)) {
      countSql += ' AND status = ?';
      countParams.push(status);
    }
    const [countResult] = await query(countSql, countParams);

    return res.status(200).json({
      success: true,
      data: {
        enquiries,
        total: countResult?.total || 0,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enquiries = await query('SELECT * FROM contact_enquiries WHERE id = ?', [id]);

    if (!enquiries || enquiries.length === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    return res.status(200).json({
      success: true,
      data: enquiries[0],
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (status && !['new', 'in_progress', 'resolved', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (adminNotes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(adminNotes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update.' });
    }

    params.push(id);
    await query(`UPDATE contact_enquiries SET ${updates.join(', ')} WHERE id = ?`, params);

    return res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM contact_enquiries WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
