import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { ArrowLeft, ShieldAlert, BookOpen } from 'lucide-react';
import { siteConfig } from '../config/site';
import { DoubleLineBorder } from '../art/DoubleLineBorder';
import { MadhubaniArtCredit } from '../art/ArtCreditNote';

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
  { id: 'contact', title: '17. Contact & Developer Information' },
];

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-6xl mx-auto z-10 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-rice-border">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-indigo-ink hover:text-sindoor transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </Link>
        <Logo size="sm" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Table of Contents (4 cols) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-8 hidden lg:block">
          <DoubleLineBorder
            variant="kachni"
            strokeColor="#1A3644"
            bandColor="#D99B26"
            className="p-5 bg-rice shadow-folk-card"
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-rice-border">
              <BookOpen className="w-4 h-4 text-indigo-ink" />
              <h3 className="text-xs font-heading font-bold text-indigo-ink uppercase tracking-wider">
                Table of Contents
              </h3>
            </div>
            <nav className="space-y-1 text-xs max-h-[75vh] overflow-y-auto pr-1">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block py-1.5 px-2 rounded-lg text-indigo-ink/75 hover:text-indigo-ink hover:bg-rice-panel font-medium transition-colors truncate"
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </DoubleLineBorder>
        </aside>

        {/* Legal Text Body (8 cols) */}
        <main className="lg:col-span-8">
          <DoubleLineBorder
            variant="bharni"
            strokeColor="#1A3644"
            bandColor="#D99B26"
            className="p-6 sm:p-10 bg-rice shadow-folk-card space-y-8 text-sm text-indigo-ink leading-relaxed"
          >
            {/* Academic Disclaimer Banner */}
            <div className="p-4 rounded-2xl bg-haldi/20 border border-haldi/50 text-indigo-ink text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-sindoor mt-0.5" />
              <div>
                <p className="font-heading font-bold text-indigo-ink">Academic Project Submission Notice</p>
                <p className="mt-1 leading-normal text-indigo-ink/80">
                  This document discloses the architecture and client-side processing policies of QRaft, engineered as an individual technical recruitment submission for GDG on Campus, SRM IST. All processing occurs locally on the user's device.
                </p>
              </div>
            </div>

          <div>
            <h1 className="text-3xl font-heading font-extrabold text-peacock-deep tracking-tight">
              Terms & Conditions & Privacy Policy
            </h1>
            <p className="text-xs text-ink/65 mt-1 font-mono">
              Last Updated: {siteConfig.lastUpdated} &bull; Version {siteConfig.version}
            </p>
          </div>

          {/* Section 1 */}
          <section id="acceptance" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">1. Acceptance of Terms</h2>
            <p className="text-ink/80">
              By accessing, browsing, generating QR codes with, or otherwise using <strong>{siteConfig.name}</strong> (&quot;the Service&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not accept these terms in full, you must not use or access the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section id="eligibility" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">2. Eligibility & Age Requirements</h2>
            <p className="text-ink/80">
              You must be at least thirteen (13) years of age, or the applicable legal age of digital consent in your jurisdiction, to use QRaft. If you are under the age of majority in your place of residence, you represent that your parent or legal guardian has reviewed and agreed to these terms on your behalf.
            </p>
          </section>

          {/* Section 3 */}
          <section id="service" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">3. Description of Service</h2>
            <p className="text-ink/80">
              QRaft is a privacy-first web application for designing 2D and 3D QR codes styled with traditional Madhubani vector motifs. All matrix calculations, contrast ratio checks, image blends, and jsQR decodes are executed entirely in client-side JavaScript.
            </p>
          </section>

          {/* Section 4 */}
          <section id="accounts" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">4. Client-Side Accounts & Security</h2>
            <p className="text-ink/80">
              User accounts in QRaft do not require an active backend server. Passwords are salted and hashed using PBKDF2 (SHA-256 with 100,000 iterations) directly inside your browser via the Web Cryptography API. Passwords and credentials never leave your browser memory.
            </p>
          </section>

          {/* Section 5 */}
          <section id="ugc" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">5. User Content & Intellectual Property</h2>
            <p className="text-ink/80">
              You retain all ownership of the text, URLs, and data payloads you encode into QR codes. QRaft claims no intellectual property rights over codes generated by users.
            </p>
          </section>

          {/* Section 6 */}
          <section id="acceptable-use" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">6. Acceptable Use & Prohibited Content</h2>
            <p className="text-ink/80">
              You agree not to encode malicious URLs, phishing portals, malware payloads, or illegal materials into QR codes generated using the Service.
            </p>
          </section>

          {/* Section 7 */}
          <section id="qr-disclaimer" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">7. QR Scannability Disclaimer</h2>
            <p className="text-ink/80">
              While QRaft includes automated WCAG contrast checks and simulated jsQR decoding, physical scan success depends on ambient lighting, print quality, camera optics, and scanner algorithms. Always test printed codes across physical devices before production deployment.
            </p>
          </section>

          {/* Section 8 */}
          <section id="open-source" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">8. Third-Party Libraries & Licenses</h2>
            <p className="text-ink/80">
              QRaft utilizes open-source libraries including React, Three.js, React Three Fiber, jsQR, Lucide React, and Tailwind CSS. All components are licensed under their respective MIT/Apache licenses.
            </p>
          </section>

          {/* Section 9 */}
          <section id="privacy" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">9. Privacy Policy (GDPR & DPDP Act)</h2>
            <p className="text-ink/80">
              Zero personal data is harvested or transmitted to external servers. QRaft operates in adherence to the India Digital Personal Data Protection (DPDP) Act principles of data minimization and storage limitation.
            </p>
          </section>

          {/* Section 10 */}
          <section id="storage" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">10. LocalStorage & Cookies Notice</h2>
            <p className="text-ink/80">
              QRaft does not use tracking cookies. Standard Web Storage (localStorage and sessionStorage) is used solely to persist your templates, history, and active session locally on your device.
            </p>
          </section>

          {/* Section 11 */}
          <section id="takedown" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">11. Takedown & Abuse Reporting</h2>
            <p className="text-ink/80">
              If you identify community templates that infringe on your intellectual property, please report the post using the in-app Flag button or email the project maintainer with the subject &quot;DMCA / Takedown Request&quot;.
            </p>
          </section>

          {/* Section 12 */}
          <section id="liability" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">12. Limitation of Liability</h2>
            <p className="text-ink/80">
              To the fullest extent permitted by applicable law, the author, developers, and SRM IST shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from your use of QRaft.
            </p>
          </section>

          {/* Section 13 */}
          <section id="indemnity" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">13. Indemnification</h2>
            <p className="text-ink/80">
              You agree to defend and hold harmless the project creator against any claims or liabilities arising from violation of these terms or misuse of generated QR codes.
            </p>
          </section>

          {/* Section 14 */}
          <section id="termination" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">14. Account Deletion & Data Wipe</h2>
            <p className="text-ink/80">
              You may purge your local data at any time. Clicking &quot;Delete Account & Local Storage&quot; in the Profile tab immediately wipes all locally stored items and user records.
            </p>
          </section>

          {/* Section 15 */}
          <section id="modifications" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">15. Modifications to Terms</h2>
            <p className="text-ink/80">
              We reserve the right to revise these terms as necessary. Continued use of QRaft after modifications indicates your acceptance of updated provisions.
            </p>
          </section>

          {/* Section 16 */}
          <section id="governing-law" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">16. Governing Law & Jurisdiction</h2>
            <p className="text-ink/80">
              These terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, and subject to the exclusive jurisdiction of the competent courts in <strong>{siteConfig.legal.jurisdiction}</strong>.
            </p>
          </section>

          {/* Section 17 */}
          <section id="contact" className="scroll-mt-8 space-y-2">
            <h2 className="text-base font-heading font-bold text-peacock-deep">17. Contact & Student Developer Information</h2>
            <p className="text-ink/80">
              This application was engineered by an applicant for the GDG on Campus, SRM Institute of Science and Technology Frontend Domain recruitment.
            </p>
            <div className="p-4 rounded-2xl bg-paper border border-paper-border text-xs space-y-1.5 font-mono text-ink">
              <p>Project: <strong>{siteConfig.name} &mdash; {siteConfig.tagline}</strong></p>
              <p>Institution: {siteConfig.author.college}</p>
              {siteConfig.author.name && <p>Developer: {siteConfig.author.name}</p>}
              {siteConfig.author.email && <p>Contact: {siteConfig.author.email}</p>}
              {siteConfig.author.repoUrl && <p>Repository: {siteConfig.author.repoUrl}</p>}
            </div>
          </section>

          <MadhubaniArtCredit className="pt-4 border-t border-rice-border" />
        </DoubleLineBorder>
        </main>
      </div>
    </div>
  );
};
