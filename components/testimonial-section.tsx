export function TestimonialSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                JD
              </div>
              <div>
                <h4 className="font-semibold">John Doe</h4>
                <p className="text-sm text-gray-500">Migrated from US to UK</p>
              </div>
            </div>
            <p className="text-gray-600">
              "FinMigrate made my financial transition to the UK incredibly smooth. Their guidance on establishing
              credit and opening bank accounts saved me countless hours."
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                JS
              </div>
              <div>
                <h4 className="font-semibold">Jane Smith</h4>
                <p className="text-sm text-gray-500">Migrated from Canada to Australia</p>
              </div>
            </div>
            <p className="text-gray-600">
              "The investment portfolio transfer service was exceptional. They helped me navigate the complex tax
              implications and restructure my investments for the Australian market."
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                RJ
              </div>
              <div>
                <h4 className="font-semibold">Robert Johnson</h4>
                <p className="text-sm text-gray-500">Migrated from UK to Singapore</p>
              </div>
            </div>
            <p className="text-gray-600">
              "Their currency exchange rates saved me thousands when transferring my assets to Singapore. The
              personalized advice was invaluable during my transition."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
