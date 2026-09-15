import { query } from '../config/db.js';

export const getPages = async (req, res, next) => {
  try {
    const pages = await query(`
      SELECT p.*, COUNT(s.id) as section_count
      FROM pages p
      LEFT JOIN page_sections s ON p.id = s.page_id
      GROUP BY p.id
      ORDER BY p.id ASC
    `);
    return res.status(200).json({ success: true, data: pages });
  } catch (error) {
    next(error);
  }
};

export const getPageByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const isPublic = !req.user;

    const pages = await query(
      'SELECT * FROM pages WHERE page_key = ? OR slug = ? OR id = ?',
      [key, key, isNaN(key) ? -1 : parseInt(key, 10)]
    );

    if (!pages || pages.length === 0) {
      return res.status(404).json({ success: false, message: 'Page not found.' });
    }

    const page = pages[0];
    let sectionSql = 'SELECT * FROM page_sections WHERE page_id = ?';
    if (isPublic) {
      sectionSql += ' AND is_active = 1';
    }
    sectionSql += ' ORDER BY display_order ASC, id ASC';

    page.sections = await query(sectionSql, [page.id]);

    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, status, seo_title, seo_description } = req.body;

    const updates = [];
    const params = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (slug !== undefined) { updates.push('slug = ?'); params.push(slug); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (seo_title !== undefined) { updates.push('seo_title = ?'); params.push(seo_title); }
    if (seo_description !== undefined) { updates.push('seo_description = ?'); params.push(seo_description); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided.' });
    }

    params.push(id);
    await query(`UPDATE pages SET ${updates.join(', ')} WHERE id = ?`, params);

    return res.status(200).json({
      success: true,
      message: 'Page settings updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const createPageSection = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const { section_key, section_type, eyebrow, heading, subheading, body, items_json, cta_text, cta_url, image_url, display_order, is_active } = req.body;

    if (!section_key || !section_key.trim()) {
      return res.status(400).json({ success: false, message: 'Section key identifier is required.' });
    }

    // Determine max display order if not provided
    let order = display_order;
    if (order === undefined) {
      const [maxOrder] = await query('SELECT MAX(display_order) as max_order FROM page_sections WHERE page_id = ?', [pageId]);
      order = (maxOrder?.max_order || 0) + 1;
    }

    const result = await query(`
      INSERT INTO page_sections 
        (page_id, section_key, section_type, eyebrow, heading, subheading, body, items_json, cta_text, cta_url, image_url, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageId,
      section_key.trim().toLowerCase().replace(/\s+/g, '_'),
      section_type || 'editorial',
      eyebrow || null,
      heading || '',
      subheading || null,
      body || null,
      items_json || null,
      cta_text || null,
      cta_url || null,
      image_url || null,
      order,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ]);

    return res.status(201).json({
      success: true,
      message: 'Page section created successfully.',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePageSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { eyebrow, heading, subheading, body, items_json, cta_text, cta_url, image_url, is_active, display_order, section_type } = req.body;

    const updates = [];
    const params = [];

    if (eyebrow !== undefined) { updates.push('eyebrow = ?'); params.push(eyebrow); }
    if (heading !== undefined) { updates.push('heading = ?'); params.push(heading); }
    if (subheading !== undefined) { updates.push('subheading = ?'); params.push(subheading); }
    if (body !== undefined) { updates.push('body = ?'); params.push(body); }
    if (items_json !== undefined) { updates.push('items_json = ?'); params.push(items_json); }
    if (cta_text !== undefined) { updates.push('cta_text = ?'); params.push(cta_text); }
    if (cta_url !== undefined) { updates.push('cta_url = ?'); params.push(cta_url); }
    if (image_url !== undefined) { updates.push('image_url = ?'); params.push(image_url); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active ? 1 : 0); }
    if (display_order !== undefined) { updates.push('display_order = ?'); params.push(display_order); }
    if (section_type !== undefined) { updates.push('section_type = ?'); params.push(section_type); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided.' });
    }

    params.push(id);
    await query(`UPDATE page_sections SET ${updates.join(', ')} WHERE id = ?`, params);

    return res.status(200).json({
      success: true,
      message: 'Page section updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deletePageSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM page_sections WHERE id = ?', [id]);
    return res.status(200).json({
      success: true,
      message: 'Page section deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const reorderPageSections = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const { orderedIds } = req.body; // Array of section IDs in new order

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array of section IDs.' });
    }

    for (let index = 0; index < orderedIds.length; index++) {
      await query(
        'UPDATE page_sections SET display_order = ? WHERE id = ? AND page_id = ?',
        [index + 1, orderedIds[index], pageId]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Section order updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
