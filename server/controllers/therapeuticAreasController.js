import { query } from '../config/db.js';

export const getTherapeuticAreas = async (req, res, next) => {
  try {
    const isPublic = !req.user;
    let sql = `
      SELECT ta.*, COUNT(p.id) as product_count
      FROM therapeutic_areas ta
      LEFT JOIN products p ON ta.id = p.therapeutic_area_id
    `;
    if (isPublic) {
      sql += ' WHERE ta.is_active = 1';
    }
    sql += ' GROUP BY ta.id ORDER BY ta.display_order ASC, ta.id ASC';

    const areas = await query(sql);

    // Fetch tags for each area
    for (const area of areas) {
      const tags = await query(
        'SELECT id, name, display_order FROM therapeutic_area_tags WHERE therapeutic_area_id = ? ORDER BY display_order ASC, id ASC',
        [area.id]
      );
      area.tags = tags.map((t) => t.name);
      area.tagObjects = tags;
    }

    return res.status(200).json({
      success: true,
      data: areas,
    });
  } catch (error) {
    next(error);
  }
};

export const getTherapeuticAreaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const areas = await query('SELECT * FROM therapeutic_areas WHERE id = ? OR slug = ?', [id, id]);

    if (!areas || areas.length === 0) {
      return res.status(404).json({ success: false, message: 'Therapeutic area not found.' });
    }

    const area = areas[0];
    const tags = await query(
      'SELECT id, name, display_order FROM therapeutic_area_tags WHERE therapeutic_area_id = ? ORDER BY display_order ASC, id ASC',
      [area.id]
    );
    area.tags = tags.map(t => t.name);
    area.tagObjects = tags;

    // Also get products in this area
    area.products = await query('SELECT id, brand_name, slug, packshot_url, status FROM products WHERE therapeutic_area_id = ?', [area.id]);

    return res.status(200).json({
      success: true,
      data: area,
    });
  } catch (error) {
    next(error);
  }
};

export const createTherapeuticArea = async (req, res, next) => {
  try {
    const { name, slug, number_label, heading, description, image_url, is_active, display_order, tags } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Division/Therapeutic Area name is required.' });
    }

    const areaSlug = slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : name.trim().toLowerCase().replace(/\s+/g, '-');

    let order = display_order;
    if (order === undefined) {
      const [maxOrder] = await query('SELECT MAX(display_order) as max_order FROM therapeutic_areas');
      order = (maxOrder?.max_order || 0) + 1;
    }

    const result = await query(`
      INSERT INTO therapeutic_areas (name, slug, number_label, heading, description, image_url, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name.trim(),
      areaSlug,
      number_label || '01',
      heading || name.trim(),
      description || '',
      image_url || null,
      order,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ]);

    const areaId = result.insertId;

    // Insert tags if provided
    if (Array.isArray(tags) && tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        const tagName = typeof tags[i] === 'string' ? tags[i].trim() : tags[i].name?.trim();
        if (tagName) {
          await query('INSERT INTO therapeutic_area_tags (therapeutic_area_id, name, display_order) VALUES (?, ?, ?)', [areaId, tagName, i + 1]);
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Therapeutic area created successfully.',
      data: { id: areaId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTherapeuticArea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, number_label, heading, description, image_url, is_active, display_order, tags } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name.trim()); }
    if (slug !== undefined) { updates.push('slug = ?'); params.push(slug.trim().toLowerCase().replace(/\s+/g, '-')); }
    if (number_label !== undefined) { updates.push('number_label = ?'); params.push(number_label); }
    if (heading !== undefined) { updates.push('heading = ?'); params.push(heading); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (image_url !== undefined) { updates.push('image_url = ?'); params.push(image_url); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active ? 1 : 0); }
    if (display_order !== undefined) { updates.push('display_order = ?'); params.push(display_order); }

    if (updates.length > 0) {
      params.push(id);
      await query(`UPDATE therapeutic_areas SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    // Update tags if provided
    if (tags !== undefined && Array.isArray(tags)) {
      await query('DELETE FROM therapeutic_area_tags WHERE therapeutic_area_id = ?', [id]);
      for (let i = 0; i < tags.length; i++) {
        const tagName = typeof tags[i] === 'string' ? tags[i].trim() : tags[i].name?.trim();
        if (tagName) {
          await query('INSERT INTO therapeutic_area_tags (therapeutic_area_id, name, display_order) VALUES (?, ?, ?)', [id, tagName, i + 1]);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Therapeutic area updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTherapeuticArea = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if products reference this area
    const products = await query('SELECT id, brand_name FROM products WHERE therapeutic_area_id = ?', [id]);
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete therapeutic area because ${products.length} product(s) are linked to it. Please reassign or delete the products first.`
      });
    }

    await query('DELETE FROM therapeutic_area_tags WHERE therapeutic_area_id = ?', [id]);
    await query('DELETE FROM therapeutic_areas WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Therapeutic area deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const reorderTherapeuticAreas = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array of IDs.' });
    }

    for (let index = 0; index < orderedIds.length; index++) {
      await query('UPDATE therapeutic_areas SET display_order = ? WHERE id = ?', [index + 1, orderedIds[index]]);
    }

    return res.status(200).json({
      success: true,
      message: 'Therapeutic areas reordered successfully.',
    });
  } catch (error) {
    next(error);
  }
};
