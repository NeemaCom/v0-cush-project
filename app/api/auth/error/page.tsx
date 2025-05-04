export default function AuthErrorPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Authentication Error</h1>
      <p>An authentication error occurred. Please try again or contact support.</p>
      <p>
        <a href="/login" style={{ color: "blue", textDecoration: "underline" }}>
          Return to login
        </a>
      </p>
    </div>
  )
}
