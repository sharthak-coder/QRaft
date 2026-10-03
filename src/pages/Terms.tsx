import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { ArrowLeft, ShieldAlert, BookOpen } from 'lucide-react';

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'eligibility', title: '2. Eligibility & Age Requirements' },
  { id: 'service', title: '3. Description of Service' },
  { id: 'accounts', title: '4. Client-Side Accounts & Security' },
  { id: 'ugc', title: '5. User Content & Intellectual Property' },
  { id: 'acceptable-use', title: '6. Acceptable Use & Prohibited Content' },
  { id: 'qr-disclaimer', title: '7. QR Scannability Disclaimer' },
  { id: 'open-source', title: '8. Third-Party Libraries & Licenses' },
  { id: 'privacy', title: '9. Privacy Policy (GDPR & DPDP Act)' },
  { id: 'storage', title: '10. LocalStorage & Cookies Notice' },
  { id: 'takedown', title: '11. Takedown & Abuse Reporting' },
  { id: 'liability', title: '12. Limitation of Liability' },
  { id: 'indemnity', title: '13. Indemnification' },
  { id: 'termination', title: '14. Account Deletion & Termination' },
  { id: 'modifications', title: '15. Modifications to Terms' },
  { id: 'governing-law', title: '16. Governing Law & Jurisdiction' },
  { id: 'contact', title: '17. Contact & Student Developer Info' },
];

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-6xl mx-auto z-10 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-surface-border">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-google-blue-royal hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </Link>
        <Logo size="sm" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Table of Contents (4 cols) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-8 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-surface-border shadow-card hidden lg:block">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-surface-border">
            <BookOpen className="w-4 h-4 text-google-blue-royal" />
            <h3 className="text-xs font-bold text-surface-text uppercase tracking-wider">
              Table of Contents
            </h3>
          </div>
          <nav className="space-y-1 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="block py-1 px-2 rounded-lg text-surface-muted hover:text-google-blue-royal hover:bg-surface-soft transition-colors truncate"
              >
                {sec.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Legal Text Body (8 cols) */}
        <main className="lg:col-span-8 bg-white/95 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-surface-border shadow-lift space-y-8 text-sm text-surface-text leading-relaxed">
          {/* Student Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold">Academic Project Disclaimer</p>
              <p className="mt-1 leading-normal">
                This document is a comprehensive terms and privacy template created specifically for a student recruitment submission (GDG on Campus SRM IST - Technical Domain). It demonstrates compliance awareness and architecture transparency, but does not constitute formal legal counsel.
              </p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-surface-text tracking-tight">
              Terms & Conditions & Privacy Policy
            </h1>
            <p className="text-xs text-surface-muted mt-1">
              Last Updated: October 3, 2026 &bull; Effective Immediately &bull; Version 1.0.0
            </p>
          </div>

          {/* Section 1 */}
          <section id="acceptance" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">1. Acceptance of Terms</h2>
            <p className="text-surface-muted">
              By accessing, browsing, generating QR codes with, or otherwise using <strong>QRaft</strong> (&quot;the Service&quot;, &quot;we&quot;, &quot;us&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not accept these terms in full, you must not use or access the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section id="eligibility" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">2. Eligibility & Age Requirements</h2>
            <p className="text-surface-muted">
              You must be at least thirteen (13) years of age, or the applicable legal age of digital consent in your jurisdiction, to use QRaft. If you are under the age of majority in your place of residence, you represent that your parent or legal guardian has reviewed and agreed to these terms on your behalf.
            </p>
          </section>

          {/* Section 3 */}
          <section id="service" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">3. Description of Service</h2>
            <p className="text-surface-muted">
              QRaft provides client-side 2D and 3D QR code creation, visual styling, WCAG contrast verification, jsQR scannability simulation, and local template archiving. QRaft is hosted as a static web application and provides zero backend data ingestion.
            </p>
          </section>

          {/* Section 4 */}
          <section id="accounts" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">4. Client-Side Accounts & Security Disclosures</h2>
            <p className="text-surface-muted">
              <strong>Simulated Client-Side Authentication:</strong> All user accounts, sessions, and credentials operate strictly within your client web browser. Passwords are processed using the Web Crypto API PBKDF2 standard with SHA-256 and unique 16-byte cryptographic salts. However, because there is no remote server validating authentication state, this system provides educational demonstrations and local organization, not cryptographic multi-user server security.
            </p>
          </section>

          {/* Section 5 */}
          <section id="ugc" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">5. User Content & Intellectual Property</h2>
            <p className="text-surface-muted">
              You retain all ownership, intellectual property rights, and copyright to the payloads, text, URLs, and configurations you enter into QRaft. By publishing a template to the local community feed or copying a share link, you grant a worldwide, royalty-free, non-exclusive license to display the template within the application for remixing and educational purposes.
            </p>
          </section>

          {/* Section 6 */}
          <section id="acceptable-use" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">6. Acceptable Use & Prohibited Content</h2>
            <p className="text-surface-muted">
              You strictly agree that you will not use QRaft to generate QR codes that link to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-surface-muted">
              <li>Phishing websites, deceptive banking forms, or credential harvester pages;</li>
              <li>Malware, spyware, ransomware, or drive-by exploit payloads;</li>
              <li>Defamatory, obscene, harassing, or hate speech material;</li>
              <li>Unsolicited commercial spam or pyramid schemes;</li>
              <li>Content that violates trademarks, copyrights, or personal publicity rights.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="qr-disclaimer" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">7. QR Scannability Disclaimer</h2>
            <p className="text-surface-muted">
              While QRaft includes automated WCAG contrast checks and simulated jsQR decoding, we make no guarantee that rendered QR codes will scan under every physical lighting, printer dpi, camera sensor, or angle condition. <strong>Users must physically scan and verify printed or published codes</strong> before committing to commercial signage or mass distribution. QRaft assumes zero liability for business losses, failed campaigns, or misdirected traffic.
            </p>
          </section>

          {/* Section 8 */}
          <section id="open-source" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">8. Third-Party Libraries & Licenses</h2>
            <p className="text-surface-muted">
              QRaft is built upon exceptional open-source software libraries, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-surface-muted">
              <li><strong>React 18 & Vite:</strong> MIT License</li>
              <li><strong>Three.js & @react-three/fiber:</strong> MIT License</li>
              <li><strong>qrcode:</strong> MIT License</li>
              <li><strong>jsQR:</strong> Apache 2.0 License</li>
              <li><strong>Tailwind CSS & Framer Motion:</strong> MIT License</li>
              <li><strong>Lucide Icons:</strong> ISC License</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section id="privacy" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">9. Privacy Policy (GDPR & Indian DPDP Act 2023 Compliance)</h2>
            <p className="text-surface-muted">
              <strong>Zero Data Transmission:</strong> QRaft does not operate tracking telemetry, analytics beacons, or server databases. All QR payload data, Wi-Fi credentials, and contact details are processed strictly in RAM and stored locally on your device.
            </p>
            <p className="text-surface-muted">
              Under the Indian Digital Personal Data Protection (DPDP) Act 2023 and the European Union General Data Protection Regulation (GDPR), you possess full control over your digital personal data. You can exercise your right to erasure at any instant by clicking &quot;Delete Account & Local Storage&quot; in the Profile tab, or clearing your browser cookies and site data.
            </p>
          </section>

          {/* Section 10 */}
          <section id="storage" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">10. LocalStorage & Cookies Notice</h2>
            <p className="text-surface-muted">
              QRaft does not set tracking cookies. We utilize browser <code>localStorage</code> solely for functional application state under versioned keys (<code>qraft:users:v1</code>, <code>qraft:session:v1</code>, <code>qraft:templates:v1</code>, <code>qraft:recent:v1</code>).
            </p>
          </section>

          {/* Section 11 */}
          <section id="takedown" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">11. Takedown & Abuse Reporting</h2>
            <p className="text-surface-muted">
              If you identify community templates that infringe on your intellectual property, please report the post using the in-app &quot;Flag&quot; button, or email the project maintainer at <code>[ADD YOUR DETAILS: student@srmist.edu.in]</code> with the subject &quot;DMCA / Takedown Request&quot;.
            </p>
          </section>

          {/* Section 12 */}
          <section id="liability" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">12. Limitation of Liability</h2>
            <p className="text-surface-muted">
              To the fullest extent permitted by applicable law, the author, developers, and SRM IST shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from your use or inability to use QRaft.
            </p>
          </section>

          {/* Section 13 */}
          <section id="indemnity" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">13. Indemnification</h2>
            <p className="text-surface-muted">
              You agree to defend, indemnify, and hold harmless the project creator against any claims, damages, liabilities, and expenses arising from your violation of these terms or misuse of generated QR codes.
            </p>
          </section>

          {/* Section 14 */}
          <section id="termination" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">14. Account Deletion & Termination</h2>
            <p className="text-surface-muted">
              You may discontinue using QRaft at any time. Clicking &quot;Delete Account & Local Storage&quot; in the Profile tab immediately wipes all locally cached users, templates, and recent history.
            </p>
          </section>

          {/* Section 15 */}
          <section id="modifications" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">15. Modifications to Terms</h2>
            <p className="text-surface-muted">
              We reserve the right to revise these terms as necessary. Continued use of QRaft after modifications indicates your acceptance of updated provisions.
            </p>
          </section>

          {/* Section 16 */}
          <section id="governing-law" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">16. Governing Law & Jurisdiction</h2>
            <p className="text-surface-muted">
              These terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, and subject to the exclusive jurisdiction of the competent courts in <code>[ADD YOUR DETAILS: Chennai, Tamil Nadu, India]</code>.
            </p>
          </section>

          {/* Section 17 */}
          <section id="contact" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-bold text-surface-text">17. Contact & Student Developer Info</h2>
            <p className="text-surface-muted">
              This application was engineered by an applicant for the GDG on Campus, SRM Institute of Science and Technology Frontend Domain recruitment (Technical Submission: &quot;QR Code Generator & Designer&quot;).
            </p>
            <div className="p-4 rounded-2xl bg-surface-soft border border-surface-border text-xs space-y-1 font-mono">
              <p>Developer: <code>[ADD YOUR DETAILS: Student Developer Name]</code></p>
              <p>Email: <code>[ADD YOUR DETAILS: student@srmist.edu.in]</code></p>
              <p>Institution: SRM Institute of Science and Technology, Kattankulathur</p>
              <p>Repository: <code>qraft-qr-designer</code></p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
