/**
 * QRaft Site Configuration - Single Source of Truth
 * 
 * Fill in your details below before final deployment.
 * Any social/contact link left empty will not be rendered in the UI.
 */
export const siteConfig = {
  name: 'QRaft',
  tagline: 'Authentic Madhubani QR Studio & 3D Designer',
  version: '1.0.0',
  lastUpdated: 'October 3, 2026',

  // Author & Academic Affiliation (Leave empty or fill with your genuine information)
  author: {
    name: '', // e.g. "Your Name"
    college: 'SRM Institute of Science and Technology',
    email: '', // e.g. "student@srmist.edu.in"
    githubUsername: '', // e.g. "yourusername"
    githubUrl: '', // e.g. "https://github.com/yourusername"
    repoUrl: '', // e.g. "https://github.com/yourusername/qraft-qr-designer"
    deployedUrl: '', // e.g. "https://qraft-qr-designer.vercel.app"
    linkedinUrl: '',
    instagramUrl: '',
  },

  // Jurisdiction for Legal Disclosures
  legal: {
    jurisdiction: 'Chennai, Tamil Nadu, India',
    effectiveDate: 'October 3, 2026',
  },
} as const;

/**
 * Checks whether author fields have been populated.
 * Returns warnings for any remaining placeholders.
 */
export function validateSiteConfig(): string[] {
  const warnings: string[] = [];
  if (!siteConfig.author.name.trim()) {
    warnings.push('siteConfig.author.name is empty (fill in src/config/site.ts)');
  }
  if (!siteConfig.author.email.trim()) {
    warnings.push('siteConfig.author.email is empty (fill in src/config/site.ts)');
  }
  if (!siteConfig.author.githubUrl.trim()) {
    warnings.push('siteConfig.author.githubUrl is empty (fill in src/config/site.ts)');
  }
  return warnings;
}
