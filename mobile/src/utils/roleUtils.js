export const ROLES = {
  ADMIN: "ADMINISTRADOR",
  OPERARIO: "OPERARIO",
  CONSULTA: "CONSULTA",
};

export const isAdmin = (user) => user?.rol === ROLES.ADMIN;
export const isOperario = (user) => user?.rol === ROLES.OPERARIO;
export const isConsulta = (user) => user?.rol === ROLES.CONSULTA;

export const canViewInventory = (user) =>
  [ROLES.ADMIN, ROLES.OPERARIO, ROLES.CONSULTA].includes(user?.rol);

export const canViewAudit = (user) => user?.rol === ROLES.ADMIN;
export const canViewAlerts = (user) => user?.rol === ROLES.ADMIN;
export const canViewUsers = (user) => user?.rol === ROLES.ADMIN;