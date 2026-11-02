import { query } from '../config/db.js';

const DIVISION_ALIAS_MAP = {
  'womens-health': ['womens-health', 'womens health', 'women-health', 'women health', 'femme', "women's health", 'women’s health', 'womenshealth', 'reproductive health'],
  'women-health': ['womens-health', 'womens health', 'women-health', 'women health', 'femme', "women's health", 'women’s health', 'womenshealth'],
  'femme': ['womens-health', 'womens health', 'women-health', 'women health', 'femme', "women's health", 'women’s health', 'womenshealth'],
  'paediatrics': ['paediatrics', 'paediatric', 'pediatrics', 'pediatric', 'pediaplus', 'pedia', 'child health'],
  'paediatric': ['paediatrics', 'paediatric', 'pediatrics', 'pediatric', 'pediaplus', 'pedia'],
  'pediatrics': ['paediatrics', 'paediatric', 'pediatrics', 'pediatric', 'pediaplus', 'pedia'],
  'pediatric': ['paediatrics', 'paediatric', 'pediatrics', 'pediatric', 'pediaplus', 'pedia'],
  'pediaplus': ['paediatrics', 'paediatric', 'pediatrics', 'pediatric', 'pediaplus', 'pedia'],
  'orthopaedics': ['orthopaedics', 'orthopaedic', 'orthopedics', 'orthopedic', 'ortheon', 'musculoskeletal'],
  'orthopaedic': ['orthopaedics', 'orthopaedic', 'orthopedics', 'orthopedic', 'ortheon'],
  'orthopedics': ['orthopaedics', 'orthopaedic', 'orthopedics', 'orthopedic', 'ortheon'],
  'orthopedic': ['orthopaedics', 'orthopaedic', 'orthopedics', 'orthopedic', 'ortheon'],
  'ortheon': ['orthopaedics', 'orthopaedic', 'orthopedics', 'orthopedic', 'ortheon'],
  'neurology': ['neurology', 'neuro', 'neurix', 'neurological'],
  'neuro': ['neurology', 'neuro', 'neurix', 'neurological'],
  'neurix': ['neurology', 'neuro', 'neurix', 'neurological'],
  'ophthalmology': ['ophthalmology', 'ophthalmic', 'eyerix', 'eyrix', 'ocular', 'eye-care', 'eye care', 'eye'],
  'ocular': ['ophthalmology', 'ophthalmic', 'eyerix', 'eyrix', 'ocular', 'eye-care', 'eye care', 'eye'],
  'eyerix': ['ophthalmology', 'ophthalmic', 'eyerix', 'eyrix', 'ocular', 'eye-care', 'eye care', 'eye'],
  'eyrix': ['ophthalmology', 'ophthalmic', 'eyerix', 'eyrix', 'ocular', 'eye-care', 'eye care', 'eye'],
  'eye-care': ['ophthalmology', 'ophthalmic', 'eyerix', 'eyrix', 'ocular', 'eye-care', 'eye care', 'eye'],
  'dermatology': ['dermatology', 'derma', 'vellis', 'cutaneous', 'skin', 'skin-care', 'skin care'],
  'derma': ['dermatology', 'derma', 'vellis', 'cutaneous', 'skin', 'skin-care', 'skin care'],
  'vellis': ['dermatology', 'derma', 'vellis', 'cutaneous', 'skin', 'skin-care', 'skin care'],
  'skin': ['dermatology', 'derma', 'vellis', 'cutaneous', 'skin', 'skin-care', 'skin care'],
  'ent': ['ent', 'otira', 'ear-nose-throat', 'ear nose throat', 'ear, nose and throat'],
  'otira': ['ent', 'otira', 'ear-nose-throat', 'ear nose throat'],
  'ear-nose-throat': ['ent', 'otira', 'ear-nose-throat', 'ear nose throat'],
  'general-medicine': ['general-medicine', 'general medicine', 'omnara', 'general', 'internal-medicine', 'internal medicine'],
  'general': ['general-medicine', 'general medicine', 'omnara', 'general', 'internal-medicine', 'internal medicine'],
  'omnara': ['general-medicine', 'general medicine', 'omnara', 'general', 'internal-medicine', 'internal medicine'],
  'internal-medicine': ['general-medicine', 'general medicine', 'omnara', 'general', 'internal-medicine', 'internal medicine'],
  'oncology': ['oncology', 'cytos', 'cancer-care', 'cancer care', 'cancer'],
  'cytos': ['oncology', 'cytos', 'cancer-care', 'cancer care', 'cancer'],
  'cancer-care': ['oncology', 'cytos', 'cancer-care', 'cancer care', 'cancer'],
};

const DIVISION_TO_AREA_ID = {
  'womens-health': 1, 'femme': 1, 'women-health': 1,
  'paediatrics': 2, 'pediatrics': 2, 'pediaplus': 2, 'paediatric': 2, 'pediatric': 2,
  'orthopaedics': 3, 'orthopedics': 3, 'ortheon': 3, 'orthopaedic': 3, 'orthopedic': 3,
  'neurology': 4, 'neuro': 4, 'neurix': 4,
  'ophthalmology': 5, 'eyerix': 5, 'eyrix': 5, 'ocular': 5, 'eye-care': 5,
  'dermatology': 6, 'derma': 6, 'vellis': 6, 'skin': 6,
  'ent': 7, 'otira': 7, 'ear-nose-throat': 7,
  'general-medicine': 8, 'omnara': 8, 'general': 8, 'internal-medicine': 8,
  'oncology': 9, 'cytos': 9, 'cancer-care': 9,
};

const AREA_ID_TO_CANONICAL = {
  1: { slug: 'womens-health', name: "Women's Health" },
  2: { slug: 'paediatrics', name: 'Paediatrics' },
  3: { slug: 'orthopaedics', name: 'Orthopaedics' },
  4: { slug: 'neurology', name: 'Neurology' },
  5: { slug: 'ophthalmology', name: 'Ophthalmology' },
  6: { slug: 'dermatology', name: 'Dermatology' },
  7: { slug: 'ent', name: 'ENT' },
  8: { slug: 'general-medicine', name: 'General Medicine' },
  9: { slug: 'oncology', name: 'Oncology' },
};

export const getProducts = async (req, res, next) => {
  try {
    // Disable all caching so live updates and past records show immediately
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const divisionQuery = req.query.division || req.query.divisionSlug || req.query.category || req.query.therapeuticArea || req.query.slug;
    const searchQuery = req.query.search || req.query.q;
    const isPublic = !req.user;

    let joinPta = '';
    const conditions = [];
    const params = [];

    if (isPublic) {
      conditions.push("p.status = 'published'");
    }

    if (divisionQuery) {
      const slug = divisionQuery.toLowerCase().trim();
      const slugSpaced = slug.replace(/[-_]+/g, ' ');
      const slugDashed = slug.replace(/[\s_]+/g, '-');

      let searchTerms = [slug, slugSpaced, slugDashed];
      if (DIVISION_ALIAS_MAP[slug]) {
        searchTerms.push(...DIVISION_ALIAS_MAP[slug]);
      }
      if (DIVISION_ALIAS_MAP[slugDashed]) {
        searchTerms.push(...DIVISION_ALIAS_MAP[slugDashed]);
      }
      searchTerms = [...new Set(searchTerms)];

      const areaId = DIVISION_TO_AREA_ID[slug] || DIVISION_TO_AREA_ID[slugDashed];
      if (areaId) {
        joinPta = 'LEFT JOIN product_therapeutic_areas pta ON p.id = pta.product_id AND pta.therapeutic_area_id = ?';
        params.push(areaId);
        conditions.push('(p.therapeutic_area_id = ? OR pta.therapeutic_area_id = ?)');
        params.push(areaId, areaId);
      } else {
        const placeholders = searchTerms.map(() => '?').join(', ');
        conditions.push(`(ta.slug IN (${placeholders}) OR ta.name IN (${placeholders}))`);
        params.push(...searchTerms, ...searchTerms);
      }
    }

    let sql = `
      SELECT DISTINCT p.*, ta.name as therapeutic_area_name, ta.slug as therapeutic_area_slug,
             ${joinPta ? 'COALESCE(pta.display_order, p.display_order)' : 'p.display_order'} as active_display_order
      FROM products p
      LEFT JOIN therapeutic_areas ta ON p.therapeutic_area_id = ta.id
      ${joinPta}
    `;

    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
      const term = `%${searchQuery.trim()}%`;
      conditions.push('(p.brand_name LIKE ? OR p.short_description LIKE ? OR p.full_description LIKE ? OR p.composition_summary LIKE ? OR ta.name LIKE ? OR ta.slug LIKE ?)');
      params.push(term, term, term, term, term, term);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY active_display_order ASC, p.id ASC';

    const rawProducts = await query(sql, params);

    // Guaranteed deduplication by product ID
    const uniqueRawMap = new Map();
    for (const r of rawProducts) {
      if (!uniqueRawMap.has(r.id)) {
        uniqueRawMap.set(r.id, r);
      }
    }
    const dedupedProducts = Array.from(uniqueRawMap.values());

    const products = dedupedProducts.map(p => {
      const brandName = p.brand_name || p.brandName || p.name || '';
      const shortDesc = p.short_description || p.shortDescription || p.composition_summary || p.composition || p.full_description || '';
      const fullDesc = p.full_description || p.fullDescription || p.description || '';
      const packshot = p.packshot_url || p.productPrimaryPackshotImage || p.image || '/assets/placeholder.png';
      const divSlug = divisionQuery || p.therapeutic_area_slug || 'general-medicine';
      const taName = p.therapeutic_area_name || 'General Medicine';
      const productUrl = (p.slug === 'oneflexo' || brandName.toLowerCase() === 'oneflexo')
        ? '/areas-of-care/orthopaedics/oneflexo'
        : `/areas-of-care/${divSlug}/${p.slug}`;

      return {
        ...p,
        id: p.id,
        brandName,
        brand_name: brandName,
        name: brandName,
        slug: p.slug,
        shortDescription: shortDesc,
        short_description: shortDesc,
        fullDescription: fullDesc,
        full_description: fullDesc,
        description: shortDesc || fullDesc,
        composition: p.composition_summary || shortDesc,
        composition_summary: p.composition_summary || shortDesc,
        packshot_url: packshot,
        productPrimaryPackshotImage: packshot,
        image: packshot,
        division: divSlug,
        divisionSlug: divSlug,
        therapeuticArea: taName,
        therapeutic_area_name: taName,
        therapeutic_area_slug: divSlug,
        category: divSlug,
        status: p.status || 'published',
        display_order: p.display_order || 0,
        link_url: p.link_url || null,
        link_label: p.link_label || null,
        external_link: p.link_url || null,
        external_link_label: p.link_label || null,
        updatedAt: p.updated_at || new Date(),
        productUrl,
      };
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Database query error in getProducts:', error);
    next(error);
  }
};

export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    // Disable all caching on single product fetch
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { identifier } = req.params;
    const products = await query(
      `SELECT p.*, ta.name as therapeutic_area_name, ta.slug as therapeutic_area_slug
       FROM products p
       LEFT JOIN therapeutic_areas ta ON p.therapeutic_area_id = ta.id
       WHERE p.id = ? OR p.slug = ?`,
      [identifier, identifier]
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = products[0];

    // Compositions
    product.compositions = await query(
      'SELECT * FROM product_compositions WHERE product_id = ? ORDER BY display_order ASC, id ASC',
      [product.id]
    );

    // Benefits
    product.benefits = await query(
      'SELECT * FROM product_benefits WHERE product_id = ? ORDER BY display_order ASC, id ASC',
      [product.id]
    );

    // Dosage
    const dosage = await query('SELECT * FROM product_dosage WHERE product_id = ?', [product.id]);
    product.dosage = dosage[0] || null;

    // Mechanisms
    product.mechanisms = await query(
      'SELECT * FROM product_mechanisms WHERE product_id = ? ORDER BY display_order ASC, id ASC',
      [product.id]
    );

    // Safety
    product.safetySections = await query(
      'SELECT * FROM product_safety_sections WHERE product_id = ? ORDER BY display_order ASC, id ASC',
      [product.id]
    );

    // Gallery Images (Multiple Photos)
    product.images = await query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC, id ASC',
      [product.id]
    );

    // Multi-specialty areas
    const areaRows = await query(
      'SELECT therapeutic_area_id FROM product_therapeutic_areas WHERE product_id = ?',
      [product.id]
    );
    const areaIds = areaRows.map((r) => r.therapeutic_area_id);
    if (product.therapeutic_area_id && !areaIds.includes(product.therapeutic_area_id)) {
      areaIds.push(product.therapeutic_area_id);
    }
    product.therapeutic_area_ids = areaIds;

    const brandName = product.brand_name || product.brandName || product.name || '';
    const shortDesc = product.short_description || product.shortDescription || product.composition_summary || product.composition || product.full_description || '';
    const fullDesc = product.full_description || product.fullDescription || product.description || '';
    const packshot = product.packshot_url || product.productPrimaryPackshotImage || product.product_primary_packshot_image || product.image || '/assets/placeholder.png';
    const divSlug = product.divisionSlug || product.division || product.therapeutic_area_slug || 'general-medicine';
    const taName = product.therapeuticArea || product.therapeutic_area_name || 'General Medicine';

    const enriched = {
      ...product,
      therapeutic_area_ids: areaIds,
      brandName,
      brand_name: brandName,
      name: brandName,
      shortDescription: shortDesc,
      short_description: shortDesc,
      fullDescription: fullDesc,
      full_description: fullDesc,
      description: shortDesc || fullDesc,
      composition: product.composition_summary || shortDesc,
      composition_summary: product.composition_summary || shortDesc,
      packshot_url: packshot,
      productPrimaryPackshotImage: packshot,
      product_primary_packshot_image: packshot,
      image: packshot,
      division: divSlug,
      divisionSlug: divSlug,
      therapeuticArea: taName,
      therapeutic_area_name: taName,
      therapeutic_area_slug: divSlug,
      category: divSlug,
      link_url: product.link_url || null,
      link_label: product.link_label || null,
      external_link: product.link_url || null,
      external_link_label: product.link_label || null,
    };

    return res.status(200).json({
      ...enriched,
      success: true,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      id,
      therapeutic_area_id,
      therapeuticArea,
      brand_name,
      brandName,
      slug,
      division,
      divisionSlug,
      category,
      short_description,
      shortDescription,
      full_description,
      fullDescription,
      packshot_url,
      productPrimaryPackshotImage,
      image,
      status,
      display_order,
      seo_title,
      seo_description,
      link_url,
      linkUrl,
      external_link,
      external_link_url,
      link_label,
      linkLabel,
      external_link_label,
      compositions,
      benefits,
      dosage,
      mechanisms,
      safetySections,
      images,
    } = req.body;

    // If an existing product ID was provided in the payload, delegate to updateProduct
    if (id) {
      const existingById = await query('SELECT id FROM products WHERE id = ? OR slug = ? LIMIT 1', [id, id]);
      if (existingById && existingById.length > 0) {
        req.params.id = existingById[0].id;
        return updateProduct(req, res, next);
      }
    }

    const brandNameVal = (brandName || brand_name || '').trim();
    if (!brandNameVal) {
      return res.status(400).json({ success: false, message: 'Brand name is required.' });
    }

    const productSlug = slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : brandNameVal.toLowerCase().replace(/\s+/g, '-');
    const chosenDivisionSlug = (divisionSlug || division || category || '').toLowerCase().trim();

    let areaId = therapeutic_area_id;
    if (!areaId && chosenDivisionSlug) {
      areaId = DIVISION_TO_AREA_ID[chosenDivisionSlug] || null;
    }
    if (!areaId && therapeuticArea) {
      const normTa = therapeuticArea.toLowerCase().replace(/['’]/g, '').trim();
      areaId = DIVISION_TO_AREA_ID[normTa] || null;
    }
    if (!areaId) areaId = 1;

    const canonicalInfo = AREA_ID_TO_CANONICAL[areaId] || { slug: chosenDivisionSlug || 'general-medicine', name: therapeuticArea || 'General Medicine' };
    const finalDivisionSlug = chosenDivisionSlug || canonicalInfo.slug;
    const finalTaLabel = therapeuticArea || canonicalInfo.name;
    const shortDescVal = shortDescription || short_description || '';
    const fullDescVal = fullDescription || full_description || '';
    const packshotVal = productPrimaryPackshotImage || packshot_url || image || null;
    const linkUrlVal = (link_url !== undefined ? link_url : (linkUrl !== undefined ? linkUrl : (external_link !== undefined ? external_link : external_link_url))) || null;
    const linkLabelVal = (link_label !== undefined ? link_label : (linkLabel !== undefined ? linkLabel : (external_link_label !== undefined ? external_link_label : null))) || null;

    let order = display_order;
    if (order === undefined) {
      const [maxOrder] = await query('SELECT MAX(display_order) as max_order FROM products');
      order = (maxOrder?.max_order || 0) + 1;
    }

    // Check if slug already exists to prevent duplicate entry errors
    let finalSlug = productSlug;
    const existingSlug = await query('SELECT id FROM products WHERE slug = ? LIMIT 1', [finalSlug]);
    if (existingSlug && existingSlug.length > 0) {
      // Auto-generate a suffixed slug (e.g., ${slug}-1, ${slug}-2)
      let counter = 1;
      while (true) {
        const candidateSlug = `${productSlug}-${counter}`;
        const check = await query('SELECT id FROM products WHERE slug = ? LIMIT 1', [candidateSlug]);
        if (!check || check.length === 0) {
          finalSlug = candidateSlug;
          break;
        }
        counter++;
      }
    }

    const result = await query(`
      INSERT INTO products (
        therapeutic_area_id, brand_name, slug, short_description, full_description, packshot_url,
        status, display_order, seo_title, seo_description, link_url, link_label
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      areaId,
      brandNameVal,
      finalSlug,
      shortDescVal,
      fullDescVal,
      packshotVal,
      status || 'published',
      order,
      seo_title || null,
      seo_description || null,
      linkUrlVal ? linkUrlVal.trim() : null,
      linkLabelVal ? linkLabelVal.trim() : null,
    ]);

    const productId = result.insertId;

    // Save multi-specialty area mappings in product_therapeutic_areas
    const rawAreaIds = Array.isArray(req.body.therapeutic_area_ids) && req.body.therapeutic_area_ids.length > 0
      ? req.body.therapeutic_area_ids
      : [areaId];
    const allAreaIds = [...new Set([areaId, ...rawAreaIds])].map(Number).filter(Boolean);
    for (const tid of allAreaIds) {
      await query(`
        INSERT INTO product_therapeutic_areas (product_id, therapeutic_area_id, display_order)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE display_order = VALUES(display_order)
      `, [productId, tid, order]);
    }

    // Save nested details
    await saveNestedProductDetails(productId, { compositions, benefits, dosage, mechanisms, safetySections, images });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: { id: productId, slug: finalSlug }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      therapeutic_area_id,
      therapeutic_area_ids,
      therapeuticArea,
      brand_name,
      brandName,
      slug,
      division,
      divisionSlug,
      category,
      short_description,
      shortDescription,
      full_description,
      fullDescription,
      status,
      display_order,
      packshot_url,
      productPrimaryPackshotImage,
      image,
      seo_title,
      seo_description,
      compositions,
      benefits,
      dosage,
      mechanisms,
      safetySections,
      images
    } = req.body;

    // Resolve target numeric ID if slug or identifier was passed
    const existingRows = await query('SELECT id, slug, therapeutic_area_id FROM products WHERE id = ? OR slug = ? LIMIT 1', [id, id]);
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found', message: 'Product not found.' });
    }
    const targetId = existingRows[0].id;

    const brandNameVal = brandName !== undefined ? brandName : brand_name;
    const shortDescVal = shortDescription !== undefined ? shortDescription : short_description;
    const fullDescVal = fullDescription !== undefined ? fullDescription : full_description;
    const packshotVal = productPrimaryPackshotImage !== undefined ? productPrimaryPackshotImage : (packshot_url !== undefined ? packshot_url : image);
    const chosenDivisionSlug = (divisionSlug || division || category || '').toLowerCase().trim();

    // Check slug uniqueness excluding the current product being updated
    const targetSlug = slug !== undefined
      ? slug.trim().toLowerCase().replace(/\s+/g, '-')
      : (brandNameVal ? brandNameVal.trim().toLowerCase().replace(/\s+/g, '-') : undefined);

    if (targetSlug) {
      const slugConflict = await query('SELECT id FROM products WHERE slug = ? AND id != ? LIMIT 1', [targetSlug, targetId]);
      if (slugConflict && slugConflict.length > 0) {
        return res.status(400).json({
          success: false,
          error: `The slug '${targetSlug}' is already in use by another product (ID: ${slugConflict[0].id}).`,
          message: `The slug '${targetSlug}' is already in use by another product.`
        });
      }
    }

    const updates = [];
    const params = [];

    let areaId = therapeutic_area_id;
    if (areaId === undefined && chosenDivisionSlug) {
      areaId = DIVISION_TO_AREA_ID[chosenDivisionSlug] || undefined;
    }

    if (areaId !== undefined) {
      updates.push('therapeutic_area_id = ?');
      params.push(areaId);
    }
    if (brandNameVal !== undefined) {
      updates.push('brand_name = ?');
      params.push(brandNameVal.trim());
    }
    if (targetSlug !== undefined) {
      updates.push('slug = ?');
      params.push(targetSlug);
    }
    if (shortDescVal !== undefined) {
      updates.push('short_description = ?');
      params.push(shortDescVal);
    }
    if (fullDescVal !== undefined) {
      updates.push('full_description = ?');
      params.push(fullDescVal);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      params.push(display_order);
    }
    if (packshotVal !== undefined) {
      updates.push('packshot_url = ?');
      params.push(packshotVal);
    }
    if (seo_title !== undefined) {
      updates.push('seo_title = ?');
      params.push(seo_title);
    }
    if (seo_description !== undefined) {
      updates.push('seo_description = ?');
      params.push(seo_description);
    }

    const linkUrlVal = link_url !== undefined ? link_url : (linkUrl !== undefined ? linkUrl : (external_link !== undefined ? external_link : external_link_url));
    const linkLabelVal = link_label !== undefined ? link_label : (linkLabel !== undefined ? linkLabel : (external_link_label !== undefined ? external_link_label : undefined));

    if (linkUrlVal !== undefined) {
      updates.push('link_url = ?');
      params.push(linkUrlVal ? linkUrlVal.trim() : null);
    }
    if (linkLabelVal !== undefined) {
      updates.push('link_label = ?');
      params.push(linkLabelVal ? linkLabelVal.trim() : null);
    }

    // Always update timestamp
    updates.push('updated_at = NOW()');

    if (updates.length > 0) {
      params.push(targetId);
      await query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    // Save multi-specialty area mappings in product_therapeutic_areas
    const targetPrimaryArea = areaId !== undefined ? areaId : existingRows[0].therapeutic_area_id;
    if (therapeutic_area_ids !== undefined || areaId !== undefined) {
      const rawAreaIds = Array.isArray(therapeutic_area_ids) && therapeutic_area_ids.length > 0
        ? therapeutic_area_ids
        : (targetPrimaryArea ? [targetPrimaryArea] : [1]);
      const allAreaIds = [...new Set([targetPrimaryArea, ...rawAreaIds])].map(Number).filter(Boolean);
      await query('DELETE FROM product_therapeutic_areas WHERE product_id = ?', [targetId]);
      for (const tid of allAreaIds) {
        await query(`
          INSERT INTO product_therapeutic_areas (product_id, therapeutic_area_id, display_order)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE display_order = VALUES(display_order)
        `, [targetId, tid, display_order || targetId]);
      }
    }

    // Update nested details targeting numeric targetId
    await saveNestedProductDetails(targetId, { compositions, benefits, dosage, mechanisms, safetySections, images });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: { id: targetId, slug: targetSlug || existingRows[0].slug }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM product_therapeutic_areas WHERE product_id = ?', [id]);
    await query('DELETE FROM product_compositions WHERE product_id = ?', [id]);
    await query('DELETE FROM product_benefits WHERE product_id = ?', [id]);
    await query('DELETE FROM product_dosage WHERE product_id = ?', [id]);
    await query('DELETE FROM product_mechanisms WHERE product_id = ?', [id]);
    await query('DELETE FROM product_safety_sections WHERE product_id = ?', [id]);
    await query('DELETE FROM product_images WHERE product_id = ?', [id]);
    await query('DELETE FROM products WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const reorderProducts = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array of IDs.' });
    }

    for (let index = 0; index < orderedIds.length; index++) {
      await query('UPDATE products SET display_order = ? WHERE id = ?', [index + 1, orderedIds[index]]);
    }

    return res.status(200).json({
      success: true,
      message: 'Products reordered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

async function saveNestedProductDetails(productId, { compositions, benefits, dosage, mechanisms, safetySections, images }) {
  // Compositions
  if (compositions !== undefined && Array.isArray(compositions)) {
    await query('DELETE FROM product_compositions WHERE product_id = ?', [productId]);
    for (let i = 0; i < compositions.length; i++) {
      const item = compositions[i];
      if (item.ingredient_name && item.ingredient_name.trim()) {
        await query(`
          INSERT INTO product_compositions (product_id, ingredient_name, ingredient_description, strength, display_order)
          VALUES (?, ?, ?, ?, ?)
        `, [productId, item.ingredient_name.trim(), item.ingredient_description || null, item.strength || '', i + 1]);
      }
    }
  }

  // Benefits
  if (benefits !== undefined && Array.isArray(benefits)) {
    await query('DELETE FROM product_benefits WHERE product_id = ?', [productId]);
    for (let i = 0; i < benefits.length; i++) {
      const item = benefits[i];
      if (item.title && item.title.trim()) {
        await query(`
          INSERT INTO product_benefits (product_id, title, description, display_order)
          VALUES (?, ?, ?, ?)
        `, [productId, item.title.trim(), item.description || '', i + 1]);
      }
    }
  }

  // Dosage
  if (dosage !== undefined) {
    await query('DELETE FROM product_dosage WHERE product_id = ?', [productId]);
    if (dosage && (dosage.heading || dosage.description)) {
      await query(`
        INSERT INTO product_dosage (product_id, heading, description)
        VALUES (?, ?, ?)
      `, [productId, dosage.heading || 'How it should be taken.', dosage.description || '']);
    }
  }

  // Mechanisms
  if (mechanisms !== undefined && Array.isArray(mechanisms)) {
    await query('DELETE FROM product_mechanisms WHERE product_id = ?', [productId]);
    for (let i = 0; i < mechanisms.length; i++) {
      const item = mechanisms[i];
      if (item.title && item.title.trim()) {
        await query(`
          INSERT INTO product_mechanisms (product_id, title, description, display_order)
          VALUES (?, ?, ?, ?)
        `, [productId, item.title.trim(), item.description || '', i + 1]);
      }
    }
  }

  // Safety Sections
  if (safetySections !== undefined && Array.isArray(safetySections)) {
    await query('DELETE FROM product_safety_sections WHERE product_id = ?', [productId]);
    for (let i = 0; i < safetySections.length; i++) {
      const item = safetySections[i];
      if (item.title && item.title.trim()) {
        await query(`
          INSERT INTO product_safety_sections (product_id, section_key, title, description, display_order)
          VALUES (?, ?, ?, ?, ?)
        `, [productId, item.section_key || `safety_${i + 1}`, item.title.trim(), item.description || '', i + 1]);
      }
    }
  }

  // Multiple Product Photos / Gallery Images
  if (images !== undefined && Array.isArray(images)) {
    await query('DELETE FROM product_images WHERE product_id = ?', [productId]);
    for (let i = 0; i < images.length; i++) {
      const item = images[i];
      const imgUrl = typeof item === 'string' ? item : item.image_url;
      if (imgUrl && imgUrl.trim()) {
        const isPrimary = (typeof item === 'object' && item.is_primary) ? 1 : (i === 0 ? 1 : 0);
        const altText = (typeof item === 'object' && item.alt_text) ? item.alt_text : null;
        await query(`
          INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
          VALUES (?, ?, ?, ?, ?)
        `, [productId, imgUrl.trim(), altText, isPrimary, i + 1]);
      }
    }

    // Synchronize primary photo back into products.packshot_url
    const primaryImages = await query(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC LIMIT 1',
      [productId]
    );
    if (primaryImages.length > 0 && primaryImages[0].image_url) {
      await query('UPDATE products SET packshot_url = ? WHERE id = ?', [primaryImages[0].image_url, productId]);
    }
  }
}

export const addProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image_url, alt_text, is_primary } = req.body;

    if (!image_url || !image_url.trim()) {
      return res.status(400).json({ success: false, message: 'image_url is required.' });
    }

    const [maxOrder] = await query(
      'SELECT MAX(display_order) as max_order FROM product_images WHERE product_id = ?',
      [id]
    );
    const order = (maxOrder?.max_order || 0) + 1;

    if (is_primary) {
      await query('UPDATE product_images SET is_primary = 0 WHERE product_id = ?', [id]);
    }

    const result = await query(
      `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [id, image_url.trim(), alt_text || null, is_primary ? 1 : 0, order]
    );

    if (is_primary) {
      await query('UPDATE products SET packshot_url = ? WHERE id = ?', [image_url.trim(), id]);
    }

    const [newImg] = await query('SELECT * FROM product_images WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Product image added successfully.',
      data: newImg,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;
    const [img] = await query('SELECT * FROM product_images WHERE id = ? AND product_id = ?', [imageId, id]);
    if (!img) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    await query('DELETE FROM product_images WHERE id = ? AND product_id = ?', [imageId, id]);

    // If deleted image was primary, select the next available image as primary
    if (img.is_primary) {
      const [nextImg] = await query(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC LIMIT 1',
        [id]
      );
      if (nextImg) {
        await query('UPDATE product_images SET is_primary = 1 WHERE id = ?', [nextImg.id]);
        await query('UPDATE products SET packshot_url = ? WHERE id = ?', [nextImg.image_url, id]);
      } else {
        await query('UPDATE products SET packshot_url = NULL WHERE id = ?', [id]);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Product image deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const setPrimaryProductImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;
    const [img] = await query('SELECT * FROM product_images WHERE id = ? AND product_id = ?', [imageId, id]);
    if (!img) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    await query('UPDATE product_images SET is_primary = 0 WHERE product_id = ?', [id]);
    await query('UPDATE product_images SET is_primary = 1 WHERE id = ?', [imageId]);
    await query('UPDATE products SET packshot_url = ? WHERE id = ?', [img.image_url, id]);

    return res.status(200).json({
      success: true,
      message: 'Primary product image updated successfully.',
      data: { packshot_url: img.image_url },
    });
  } catch (error) {
    next(error);
  }
};
