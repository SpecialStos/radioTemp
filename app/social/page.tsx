"use client"

import { useEffect } from "react"

export default function SocialPage() {
  useEffect(() => {
    // Redirect to Linktree in a new tab
    window.open("https://linktr.ee/disclosure.cy", "_blank")

    // You could also redirect the current page back to home after opening the new tab
    // This is optional - if you remove this, the user will stay on the social page
    // window.location.href = "/"
  }, [])

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold neon-text mb-6">Social</h1>

      <div className="prose prose-invert max-w-none">
        <p>Redirecting you to our social links...</p>
        <p className="mt-4">
          If you are not automatically redirected, please{" "}
          <a
            href="https://linktr.ee/disclosure.cy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            click here
          </a>{" "}
          to visit our Linktree.
        </p>
      </div>
    </div>
  )
}

