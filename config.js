/**
 * CANTENEX — Production API Configuration Hook
 * Set window.CANTENEX_API_URL to point to your live deployed backend API.
 * Example:
 * window.CANTENEX_API_URL = "https://cantenex-api.onrender.com";
 *
 * If left empty (""), the frontend will automatically use:
 * - Current origin (if hosted on the same domain or proxied)
 * - "http://localhost:8000" during local development
 */
window.CANTENEX_API_URL = window.CANTENEX_API_URL || "";
