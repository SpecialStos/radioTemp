export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center prose prose-invert">
        <p className="text-lg">
          disclosure is a format powered by Mason Bar Limassol with resident DJs Chris Bodnar & AXEL serving as the
          primary operators of this musical initiative.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4 neon-text">The Groove Affair</h2>

        <p className="text-lg">
          We promote groovy music that bridges the space between house and techno, featuring carefully selected local
          artists and distinguished international guests on a weekly basis.
        </p>

        <p className="text-lg">
          Our events take place every Thursday at Mason Bar, with additional brand collaboration events scheduled on
          select Fridays and Saturdays.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Mason Bar</h3>
            <a
              href="https://instagram.com/mason.limassol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              @mason.limassol
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Chris Bodnar</h3>
            <a
              href="https://instagram.com/officialchrisbodnar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              @officialchrisbodnar
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">AXEL</h3>
            <a
              href="https://instagram.com/axel.cyp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              @axel.cyp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

