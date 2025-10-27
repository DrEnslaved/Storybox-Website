'use client'

import { useEffect, useState } from 'react'

export default function MedusaAdminPage() {
  const [adminUrl, setAdminUrl] = useState('')
  
  useEffect(() => {
    // Since we can't proxy Vite HMR, we'll provide instructions
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    setAdminUrl(backendUrl)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Medusa Admin Access</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">🔐 Admin Login Details</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> <code className="bg-blue-100 px-2 py-1 rounded">admin@storybox.bg</code></p>
            <p><strong>Password:</strong> <code className="bg-blue-100 px-2 py-1 rounded">StoryBox2025_lcNccnQnCssbHF9d</code></p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">ℹ️ How to Access</h2>
          <p className="text-gray-700 mb-4">
            The Medusa Admin runs on a separate development server with hot-reload (Vite), which cannot be proxied through Next.js.
          </p>
          <p className="text-gray-700">
            To access the admin panel, you have two options:
          </p>
          <ol className="list-decimal list-inside space-y-2 mt-4 text-gray-700">
            <li>
              <strong>Port Forwarding:</strong> Set up SSH port forwarding from your local machine:
              <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
                ssh -L 9000:localhost:9000 user@postgres-cart-flow.preview.emergentagent.com
              </pre>
              Then access: <a href="http://localhost:9000/app" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">http://localhost:9000/app</a>
            </li>
            <li className="mt-4">
              <strong>Direct API Management:</strong> Use the REST API endpoints to manage products, orders, etc.
              <div className="mt-2 text-sm text-gray-600">
                API Documentation: <a href="https://docs.medusajs.com/api/admin" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://docs.medusajs.com/api/admin</a>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4">🚀 Quick Product Creation via Script</h2>
          <p className="text-gray-700 mb-4">I can create a sample product for you right now if you'd like!</p>
          <p className="text-sm text-gray-600">
            Just let me know and I'll create a Bulgarian embroidery shirt product with variants and pricing.
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> For easier access, I recommend using SSH port forwarding. Once connected, the admin UI will be fully functional at localhost:9000/app
          </p>
        </div>
      </div>
    </div>
  )
}
