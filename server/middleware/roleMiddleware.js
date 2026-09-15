export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role_name)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Action requires one of: ${allowedRoles.join(', ')}.`,
      });
    }

    next();
  };
};

export const requireSuperAdmin = requireRole(['Super Admin']);
export const requireAdminOrSuper = requireRole(['Super Admin', 'Admin']);
export const requireAdminOrAbove = requireAdminOrSuper;
export const requireEditorOrAbove = requireRole(['Super Admin', 'Admin', 'Editor']);

