import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redis } from "@/lib/redis"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    // Count users
    const userKeys = await redis.keys("user:*")
    const userCount = userKeys.filter(
      (key) => !key.includes("email:") && !key.includes(":documents") && !key.includes(":notifications"),
    ).length

    // Count documents
    const documentKeys = await redis.keys("document:*")
    const documentCount = documentKeys.length

    // Count pending documents
    let pendingDocumentCount = 0
    for (const key of documentKeys) {
      const document = await redis.get(key)
      if (document) {
        const parsedDocument = JSON.parse(document as string)
        if (parsedDocument.status === "pending") {
          pendingDocumentCount++
        }
      }
    }

    // Count loan applications
    const loanKeys = await redis.keys("application:loan:*")
    const loanCount = loanKeys.length

    // Count pending loan applications
    let pendingLoanCount = 0
    for (const key of loanKeys) {
      const loan = await redis.get(key)
      if (loan) {
        const parsedLoan = JSON.parse(loan as string)
        if (parsedLoan.status === "pending") {
          pendingLoanCount++
        }
      }
    }

    // Count police certificate applications
    const certificateKeys = await redis.keys("application:police-certificate:*")
    const certificateCount = certificateKeys.length

    // Count pending police certificate applications
    let pendingCertificateCount = 0
    for (const key of certificateKeys) {
      const certificate = await redis.get(key)
      if (certificate) {
        const parsedCertificate = JSON.parse(certificate as string)
        if (parsedCertificate.status === "pending" || parsedCertificate.status === "pending_payment") {
          pendingCertificateCount++
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        users: userCount,
        documents: {
          total: documentCount,
          pending: pendingDocumentCount,
        },
        applications: {
          loans: {
            total: loanCount,
            pending: pendingLoanCount,
          },
          policeCertificates: {
            total: certificateCount,
            pending: pendingCertificateCount,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch admin stats" }, { status: 500 })
  }
}
