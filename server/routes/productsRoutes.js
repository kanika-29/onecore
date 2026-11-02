import { Router } from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
  addProductImage,
  deleteProductImage,
  setPrimaryProductImage
} from '../controllers/productsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireEditorOrAbove, requireAdminOrAbove } from '../middleware/roleMiddleware.js';

import multer from 'multer';
import { generateCatalogTemplate, processCatalogImport } from '../services/catalogImportService.js';

const catalogUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB for large image ZIPs
}).fields([
  { name: 'catalog', maxCount: 1 },
  { name: 'excel', maxCount: 1 },
  { name: 'images', maxCount: 1 },
  { name: 'zip', maxCount: 1 },
]);

const router = Router();

// Download Pre-Formatted Catalog Template (9 Division Sheets + Multi-Specialty Guide)
router.get('/download-template', (req, res, next) => {
  try {
    const buffer = generateCatalogTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Onecore_Product_Catalog_Template.xlsx"');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

// Bulk Import Products Excel & ZIP of Packshots
router.post('/import-catalog', authenticateToken, requireAdminOrAbove, catalogUpload, async (req, res, next) => {
  try {
    const excelFile = req.files?.catalog?.[0] || req.files?.excel?.[0];
    const zipFile = req.files?.images?.[0] || req.files?.zip?.[0];

    if (!excelFile) {
      return res.status(400).json({ success: false, message: 'Please select an Excel catalog spreadsheet (.xlsx or .xls).' });
    }

    const mode = req.body?.mode || 'merge'; // 'merge' or 'replace'
    const result = await processCatalogImport({
      excelBuffer: excelFile.buffer,
      zipBuffer: zipFile ? zipFile.buffer : null,
      mode,
    });

    res.json({
      success: true,
      message: `Successfully processed ${result.totalUniqueProducts} unique formulations across ${result.totalDivisionListings} division listings!`,
      data: result,
    });
  } catch (err) {
    console.error('Error during catalog import:', err);
    res.status(500).json({ success: false, message: err.message || 'Catalog import failed.' });
  }
});

// Master Catalog Sync
router.post('/sync-catalog', authenticateToken, requireAdminOrAbove, async (req, res, next) => {
  try {
    const { syncCatalogToDatabase } = await import('../scripts/syncProducts.js');
    const result = await syncCatalogToDatabase();
    res.json({ success: true, message: `Successfully synchronized ${result.count} products into MySQL!`, count: result.count });
  } catch (error) {
    next(error);
  }
});

// Purge all products at once
router.delete('/delete-all', authenticateToken, requireAdminOrAbove, async (req, res, next) => {
  try {
    const { deleteAllProductsFromDatabase } = await import('../scripts/syncProducts.js');
    await deleteAllProductsFromDatabase();
    res.json({ success: true, message: 'All products successfully purged from the database.' });
  } catch (error) {
    next(error);
  }
});

router.get('/', getProducts);
router.get('/:identifier', getProductByIdOrSlug);
router.post('/', authenticateToken, requireEditorOrAbove, createProduct);
router.put('/:id', authenticateToken, requireEditorOrAbove, updateProduct);
router.delete('/:id', authenticateToken, requireAdminOrAbove, deleteProduct);
router.post('/reorder', authenticateToken, requireEditorOrAbove, reorderProducts);

// Product Image Gallery Endpoints
router.post('/:id/images', authenticateToken, requireEditorOrAbove, addProductImage);
router.delete('/:id/images/:imageId', authenticateToken, requireEditorOrAbove, deleteProductImage);
router.put('/:id/images/:imageId/primary', authenticateToken, requireEditorOrAbove, setPrimaryProductImage);

export default router;
