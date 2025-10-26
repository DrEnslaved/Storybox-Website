import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import { requireAdmin } from '@/lib/admin-auth'

// Create upload directory if it doesn't exist
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'products')

export async function POST(request) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB' }, { status: 400 })
    }

    // Create upload directory
    await mkdir(UPLOAD_DIR, { recursive: true })

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process and save original image
    const originalPath = join(UPLOAD_DIR, uniqueFilename)
    await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF
      .withMetadata()
      .toFile(originalPath)

    // Generate thumbnails
    const thumbnailSizes = [
      { name: 'thumb', width: 150, height: 150 },
      { name: 'medium', width: 500, height: 500 },
      { name: 'large', width: 1200, height: 1200 }
    ]

    const thumbnails = {}
    for (const size of thumbnailSizes) {
      const thumbFilename = `${uniqueFilename.replace(`.${fileExtension}`, '')}_${size.name}.${fileExtension}`
      const thumbPath = join(UPLOAD_DIR, thumbFilename)
      
      await sharp(buffer)
        .rotate()
        .resize(size.width, size.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFile(thumbPath)
      
      thumbnails[size.name] = `/uploads/products/${thumbFilename}`
    }

    // Return file URLs
    return NextResponse.json({
      success: true,
      url: `/uploads/products/${uniqueFilename}`,
      thumbnails
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
