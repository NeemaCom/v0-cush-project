import { createAdminUser } from "./create-admin-user"
import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function promptUser() {
  const email = await new Promise<string>((resolve) => {
    rl.question("Enter admin email: ", resolve)
  })

  const password = await new Promise<string>((resolve) => {
    rl.question("Enter admin password (min 8 characters): ", resolve)
  })

  const firstName = await new Promise<string>((resolve) => {
    rl.question("Enter admin first name: ", resolve)
  })

  const lastName = await new Promise<string>((resolve) => {
    rl.question("Enter admin last name: ", resolve)
  })

  const country = await new Promise<string>((resolve) => {
    rl.question("Enter admin country (default: Global): ", (answer) => resolve(answer || "Global"))
  })

  const phoneNumber = await new Promise<string>((resolve) => {
    rl.question("Enter admin phone number (default: +1234567890): ", (answer) => resolve(answer || "+1234567890"))
  })

  return { email, password, firstName, lastName, country, phoneNumber }
}

async function main() {
  try {
    console.log("=== Admin User Creation Utility ===")

    const userData = await promptUser()

    if (userData.password.length < 8) {
      console.error("Password must be at least 8 characters")
      rl.close()
      return
    }

    console.log("\nCreating admin user...")

    const result = await createAdminUser(
      userData.email,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.country,
      userData.phoneNumber,
    )

    if (result.success) {
      console.log("\n✅ Success:", result.message)
      console.log("\nAdmin user details:")
      console.log("- ID:", result.user?.id)
      console.log("- Email:", result.user?.email)
      console.log("- Name:", `${result.user?.firstName} ${result.user?.lastName}`)
      console.log("- Role:", result.user?.role)
      console.log("\nYou can now log in with these credentials at /login")
    } else {
      console.error("\n❌ Error:", result.message)
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error)
  } finally {
    rl.close()
  }
}

// Run the script
main()
