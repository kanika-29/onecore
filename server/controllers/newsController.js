import { query } from '../config/db.js';

export const getNews = async (req, res, next) => {
  try {
    const isPublic = !req.user;
    let sql = 'SELECT * FROM news_articles';
    if (isPublic) {
      sql += " WHERE status = 'published'";
    }
    sql += ' ORDER BY published_at DESC, id DESC';

    const articles = await query(sql);

    return res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

export const getNewsByIdOrSlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const articles = await query(
      'SELECT * FROM news_articles WHERE id = ? OR slug = ?',
      [identifier, identifier]
    );

    if (!articles || articles.length === 0) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    return res.status(200).json({
      success: true,
      data: articles[0],
    });
  } catch (error) {
    next(error);
  }
};

export const createNews = async (req, res, next) => {
  try {
    const { title, slug, category, excerpt, content, featured_image_url, status } = req.body;

    if (!title || !slug || !excerpt) {
      return res.status(400).json({ success: false, message: 'Title, slug, and excerpt are required.' });
    }

    const result = await query(
      `INSERT INTO news_articles (title, slug, category, excerpt, content, featured_image_url, status, published_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        title.trim(),
        slug.trim().toLowerCase(),
        category || 'RESEARCH & FORMULATION',
        excerpt.trim(),
        content || null,
        featured_image_url || null,
        status || 'published',
        req.user?.id || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Article created successfully.',
      data: { id: result.insertId },
    });
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, excerpt, content, featured_image_url, status } = req.body;

    const updates = [];
    const params = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (excerpt !== undefined) { updates.push('excerpt = ?'); params.push(excerpt); }
    if (content !== undefined) { updates.push('content = ?'); params.push(content); }
    if (featured_image_url !== undefined) { updates.push('featured_image_url = ?'); params.push(featured_image_url); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided.' });
    }

    params.push(id);
    await query(`UPDATE news_articles SET ${updates.join(', ')} WHERE id = ?`, params);

    return res.status(200).json({
      success: true,
      message: 'Article updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM news_articles WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Article removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
