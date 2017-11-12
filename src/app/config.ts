export const api = {
  baseUrl: 'https://dev.ditup.org/api'
};

/**
 * How long before authentication expiration should we log in?
 * Motivation: If we boot the app too short before expiration, authentication will start failing soon.
 */
export const loginBeforeAuthExp = 12 * 3600;
