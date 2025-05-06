"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Logo from "@/components/logo"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setVerificationState("error")
        setErrorMessage("No verification token provided")
        return
      }

      try {
        const response = await fetch(`/api/auth/verify?token=${token}`)
        const data = await response.json()

        if (data.success) {
          setVerificationState("success")
        } else {
          setVerificationState("error")
          setErrorMessage(data.error || "Verification failed")
        }
      } catch (error) {
        console.error("Error verifying email:", error)
        setVerificationState("error")
        setErrorMessage("An unexpected error occurred")
      }
    }

    verifyToken()
  }, [token])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <Logo />
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Email Verification</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center space-y-4">
            {verificationState === "loading" && (
              <div className="flex flex-col items-center space-y-4 py-8">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-lg text-center">Verifying your email address...</p>
              </div>
            )}

            {verificationState === "success" && (
              <div className="flex flex-col items-center space-y-4 py-8">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-lg text-center">Your email has been successfully verified!</p>
                <p className="text-center text-gray-500">You can now access all features of the Cush platform.</p>
              </div>
            )}

            {verificationState === "error" && (
              <div className="flex flex-col items-center space-y-4 py-8">
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-lg text-center">Verification failed</p>
                <p className="text-center text-gray-500">{errorMessage}</p>
                <div className="mt-4">
                  <Button variant="outline" onClick={() => router.push("/resend-verification")}>
                    Resend Verification Email
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            {verificationState === "success" && <Button onClick={() => router.push("/login")}>Go to Login</Button>}

            {verificationState === "error" && (
              <Button variant="ghost" onClick={() => router.push("/")}>
                Return to Home
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
