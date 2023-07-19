/**
 * Examples:
 * '/sill'
 * ''
 **/
export const appPath = process.env["PUBLIC_URL"];

/**
 * Without trailing slash.
 *
 *  Examples:
 * 'https://code.gouv.fr/sill'
 * 'https://code.gouv.fr'
 * 'http://localhost:3000'
 * 'http://localhost:3000/sill'
 **/
export const appUrl = `${window.location.origin}${appPath}`;

/**
 * Without trailing slash.
 *
 * Example 'https://code.gouv.fr/sill/api'
 **/
export const apiUrl =
    process.env.NODE_ENV === "development" ? "http://localhost:3084" : `${appUrl}/api`;