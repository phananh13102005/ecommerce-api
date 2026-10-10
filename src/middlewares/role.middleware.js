export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required"
      });
    }

    const userRole = req.user.role.rolename;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to perform this action"
      });
    }

    next();
  };
}