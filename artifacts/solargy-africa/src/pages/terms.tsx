export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 2025</p>

      <div className="space-y-8 text-sm text-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By using SolargyAfrica, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. Vendor Listings</h2>
          <p className="text-muted-foreground">
            All listings are subject to review and verification. We reserve the right to remove any listing that violates our standards.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. User Reviews</h2>
          <p className="text-muted-foreground">
            Reviews must be honest and based on real experience. Fake or abusive reviews will be removed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. No Guarantees</h2>
          <p className="text-muted-foreground">
            SolargyAfrica is a directory platform. We do not guarantee the quality of any vendor's work and are not liable for transactions between users and vendors.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We may update these terms at any time. Continued use of the site constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">6. Contact</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:info@solargyafrica.com" className="text-primary hover:underline">
              info@solargyafrica.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
