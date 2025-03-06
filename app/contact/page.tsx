export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold neon-text mb-6">Contact</h1>

      <div className="max-w-2xl mx-auto">
        <p className="text-muted-foreground mb-8">
          Have questions, suggestions, or want to collaborate? Get in touch with us using one of the methods below.
        </p>

        <div className="bg-card p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Email</h2>
          <p className="mb-2">For all inquiries, please contact us at:</p>
          <a href="mailto:mgmt@disclosure.cy" className="text-primary hover:underline">
            mgmt@disclosure.cy
          </a>
        </div>

        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Instagram</h2>
          <p className="mb-2">You can also reach us through our Instagram:</p>
          <a
            href="https://instagram.com/disclosure.cy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @disclosure.cy
          </a>
        </div>
      </div>
    </div>
  )
}

