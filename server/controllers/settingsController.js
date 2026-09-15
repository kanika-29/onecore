import { query } from '../config/db.js';

export const getSettings = async (req, res, next) => {
  try {
    const siteSettings = await query('SELECT * FROM site_settings ORDER BY setting_group ASC, id ASC');
    let contactSettings = null;
    try {
      const rows = await query('SELECT * FROM contact_settings LIMIT 1');
      contactSettings = rows[0] || null;
    } catch {
      // contact_settings table fallback
    }

    const settingsMap = {};
    if (Array.isArray(siteSettings)) {
      siteSettings.forEach((item) => {
        settingsMap[item.setting_key] = item.setting_value;
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        siteSettings: siteSettings || [],
        settingsMap,
        contactSettings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = req.body;

    if (typeof settings !== 'object' || settings === null) {
      return res.status(400).json({ success: false, message: 'Invalid payload.' });
    }

    for (const [key, val] of Object.entries(settings)) {
      const stringValue = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
      await query(
        `INSERT INTO site_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, stringValue]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactSettings = async (req, res, next) => {
  try {
    const {
      general_email,
      product_email,
      business_email,
      careers_email,
      safety_email,
      phone,
      address,
      office_hours,
      email,
      business_hours,
    } = req.body;

    const mainEmail = general_email || email || 'info@onecorepharma.in';
    const mainPhone = phone || '8169255034';
    const mainHours = office_hours || business_hours || '10 AM to 7 PM';
    const mainAddress = address || '';

    try {
      await query(
        `INSERT INTO contact_settings (id, email, phone, business_hours)
         VALUES (1, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           email = VALUES(email),
           phone = VALUES(phone),
           business_hours = VALUES(business_hours)`,
        [mainEmail, mainPhone, mainHours]
      );
    } catch (e) {
      console.warn('contact_settings table update fallback:', e.message);
    }

    const pairs = {
      general_email: mainEmail,
      product_email: product_email || mainEmail,
      business_email: business_email || mainEmail,
      careers_email: careers_email || mainEmail,
      safety_email: safety_email || mainEmail,
      contact_email: mainEmail,
      contact_phone: mainPhone,
      phone: mainPhone,
      contact_hours: mainHours,
      office_hours: mainHours,
      address: mainAddress,
    };

    for (const [key, val] of Object.entries(pairs)) {
      await query(
        `INSERT INTO site_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, String(val || '')]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Contact settings updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const updateSiteSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');

    await query(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [key, stringValue]
    );

    return res.status(200).json({
      success: true,
      message: `Setting ${key} updated successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

