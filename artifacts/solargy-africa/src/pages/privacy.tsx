export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 2025</p>

      <div className="space-y-8 text-sm text-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide when submitting a vendor listing or leaving a review, including your business name, phone number, location, and description.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            To display your listing in our directory, verify your business, and improve our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. Data Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell your data. Vendor contact details (phone, WhatsApp) are publicly visible as part of the directory listing you submitted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. Cookies</h2>
          <p className="text-muted-foreground">
            We use cookies to remember your saved vendors and improve your experience.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Contact Us</h2>
          <p className="text-muted-foreground">
            For privacy concerns, contact us at{" "}
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
