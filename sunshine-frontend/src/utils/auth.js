import env from "../config/env";

/** True when the Firebase user is an admin via ADMIN_EMAILS or the `admin` custom claim. */
export const isAdminUser = async (user) => {
  if (!user) return false;
  if (user.email && env.adminEmails.includes(user.email.toLowerCase())) return true;
  const { claims } = await user.getIdTokenResult();
  return claims.admin === true;
};
