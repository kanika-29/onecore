import { query } from '../config/db.js';

export const submitContactEnquiry = async (req, res, next) => {
  try {
    const raw = req.body || {};

    // Universal field normalization supporting all website forms:
    // 1. General Contact Form (/contact)
    // 2. Distribution & Franchise Application (/partnerships)
    // 3. Institutional Access & Monograph Request (/areas-of-care)
    // 4. Pharmacovigilance & Safety Report (/patients-caregivers)
    const fullName = (
      raw.fullName ||
      raw.partnerName ||
      raw.name ||
      raw.contactName ||
      ''
    ).trim();

    const email = (
      raw.email ||
      raw.workEmail ||
      ''
    ).trim().toLowerCase();

    const phone = (
      raw.phone ||
      raw.mobile ||
      raw.phoneNumber ||
      ''
    ).trim() || null;

    const organisation = (
      raw.organisation ||
      raw.organization ||
      raw.firmName ||
      raw.hospital ||
      raw.institution ||
      ''
    ).trim() || null;

    const contactType = (
      raw.contactType ||
      raw.role ||
      raw.contacting_as ||
      (raw.partnerName || raw.firmName
        ? 'Prospective Partner / Distributor'
        : raw.workEmail
        ? 'Institutional / Healthcare Representative'
        : raw.productOrBatch
        ? 'Patient / Healthcare Professional (Safety Desk)'
        : 'General Public')
    ).trim();

    const natureOfEnquiry = (
      raw.natureOfEnquiry ||
      raw.enquiry_type ||
      raw.enquiryType ||
      (raw.partnerName || raw.firmName
        ? 'Distribution & Franchise Application'
        : raw.workEmail
        ? 'Institutional Portfolio & Dossier Request'
        : raw.productOrBatch
        ? 'Pharmacovigilance & Quality Observation'
        : 'General Enquiry')
    ).trim();

    // Validation
    if (!fullName) {
      return res.status(400).json({ success: false, message: 'Please provide your name.' });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'The email address format is invalid.' });
    }

    // Build structured message body with any specialized metadata
    const userMessage = (
      raw.message ||
      raw.observationSummary ||
      raw.observation ||
      raw.details ||
      ''
    ).trim();

    const metaItems = [];
    if (raw.city || raw.state || raw.country) {
      const loc = [raw.city, raw.state, raw.country].filter(Boolean).join(', ');
      if (loc) metaItems.push(`Location / Territory: ${loc}`);
    }
    if (raw.experienceYears) {
      metaItems.push(`Pharma Distribution Experience: ${raw.experienceYears} Years`);
    }
    if (raw.drugLicense) {
      metaItems.push(`Drug License: ${raw.drugLicense}`);
    }
    if (raw.gstNumber) {
      metaItems.push(`GST Number: ${raw.gstNumber}`);
    }
    if (raw.therapeuticInterest) {
      metaItems.push(`Therapeutic Interest: ${raw.therapeuticInterest}`);
    }
    if (raw.productOrBatch) {
      metaItems.push(`Reported Product / Batch: ${raw.productOrBatch}`);
    }

    let finalMessage = '';
    if (metaItems.length > 0) {
      finalMessage = `[SUBMISSION METADATA]\n${metaItems.join('\n')}\n\n`;
      if (userMessage) {
        finalMessage += `[DETAILS]\n${userMessage}`;
      }
    } else {
      finalMessage = userMessage || `Request for ${natureOfEnquiry} submitted through the website portal.`;
    }

    // Sanitize & insert into MySQL with default status 'new'
    const result = await query(
      `INSERT INTO contact_enquiries 
       (full_name, email, phone, organisation, contacting_as, enquiry_type, message, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new', NOW())`,
      [
        fullName.slice(0, 120),
        email.slice(0, 150),
        phone ? phone.slice(0, 50) : null,
        organisation ? organisation.slice(0, 150) : null,
        contactType.slice(0, 80),
        natureOfEnquiry.slice(0, 80),
        finalMessage.slice(0, 5000),
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you. Your enquiry has been received and routed to our team.',
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
