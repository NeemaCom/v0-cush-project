// This is a simplified version of the AstroPay integration

type AstroPayCardOptions = {
  userId: string
  amount: number
  currency: string
  cardType: "virtual" | "physical"
}

type AstroPayTransferOptions = {
  userId: string
  amount: number
  currency: string
  recipientId: string
}

export class AstroPayService {
  private apiKey: string
  private merchantId: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.ASTROPAY_API_KEY || ""
    this.merchantId = process.env.ASTROPAY_MERCHANT_ID || ""
    this.apiUrl = process.env.ASTROPAY_API_URL || "https://api.astropay.com/v1"
  }

  private async makeRequest(endpoint: string, method: string, data?: any) {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "X-Merchant-ID": this.merchantId,
        },
        body: data ? JSON.stringify(data) : undefined,
      })

      if (!response.ok) {
        throw new Error(`AstroPay API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("AstroPay API request failed:", error)
      throw error
    }
  }

  async createVirtualCard(options: AstroPayCardOptions) {
    return this.makeRequest("/cards/virtual", "POST", {
      user_id: options.userId,
      amount: options.amount,
      currency: options.currency,
    })
  }

  async getCardDetails(cardId: string) {
    return this.makeRequest(`/cards/${cardId}`, "GET")
  }

  async fundCard(cardId: string, amount: number, currency: string) {
    return this.makeRequest(`/cards/${cardId}/fund`, "POST", {
      amount,
      currency,
    })
  }

  async transferMoney(options: AstroPayTransferOptions) {
    return this.makeRequest("/transfers", "POST", {
      user_id: options.userId,
      amount: options.amount,
      currency: options.currency,
      recipient_id: options.recipientId,
    })
  }

  async getUserTransactions(userId: string) {
    return this.makeRequest(`/users/${userId}/transactions`, "GET")
  }

  async getUserCards(userId: string) {
    return this.makeRequest(`/users/${userId}/cards`, "GET")
  }
}

export const astroPayService = new AstroPayService()
