import crypto from "crypto";

const SESSION_TTL_MS = 2 * 60 * 1000;
const sessions = new Map();

const cleanupExpiredSessions = () => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(token);
    }
  }
};

export const createPdfExportSession = ({resumeData, template}) => {
  cleanupExpiredSessions();

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    resumeData,
    template,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  return token;
};

export const getPdfExportSession = (token) => {
  cleanupExpiredSessions();
  return sessions.get(token) || null;
};

export const deletePdfExportSession = (token) => {
  sessions.delete(token);
};
