import { apiClient } from './ApiClient'

// Helper to extract error message from any error type
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object') {
    const errorObj = error as any
    if (errorObj.message) return String(errorObj.message)
    if (errorObj.errors && Array.isArray(errorObj.errors)) {
      return errorObj.errors.join(', ')
    }
    if (errorObj.error) return String(errorObj.error)
    try {
      return JSON.stringify(error)
    } catch {
      return 'Unknown error'
    }
  }

  return 'Unknown error'
}

export type PresignedUrlItem = {
  key: string
  uploadURL: string
}

export type PresignedUrlResponse = PresignedUrlItem[]

export type UploadImageResponse = {
  errors: string[]
  messages: string[]
  result: {
    creator: string
    filename: string
    id: string
    requireSignedURLs: boolean
    uploaded: string
    variants: string[]
  } | null
  success: boolean
}

/**
 * Upload a single file to storage using presigned URL
 * @param uploadURL - The presigned URL to upload to
 * @param imageUri - Local file URI
 * @param options - File metadata
 * @returns The URL of the uploaded file (variants[0])
 */
async function uploadFileToStorage(
  uploadURL: string,
  imageUri: string,
  options?: { fileName?: string; type?: string },
): Promise<string> {
  console.log('[uploadFileToStorage] Starting:', {
    fileName: options?.fileName,
    type: options?.type,
  })

  const formData = new FormData()

  formData.append('file', {
    uri: imageUri,
    name: options?.fileName ?? 'photo.jpg',
    type: options?.type ?? 'image/jpeg',
  } as unknown as Blob)

  try {
    console.log('[uploadFileToStorage] Fetching to presigned URL')

    const response = await fetch(uploadURL, {
      method: 'POST',
      body: formData,
    })

    console.log('[uploadFileToStorage] Response status:', response.status)

    let data: UploadImageResponse

    try {
      data = await response.json()

      console.log('[uploadFileToStorage] Response data:', {
        success: data.success,
        hasResult: !!data.result,
        hasVariants: !!data.result?.variants,
        firstVariant: data.result?.variants?.[0],
      })
    } catch (parseError) {
      console.error('[uploadFileToStorage] Parse error:', parseError)
      throw new Error(
        `Failed to parse upload response: ${response.status} ${response.statusText}`,
      )
    }

    if (!response.ok || !data.success || !data.result?.variants?.[0]) {
      const errorMsg = data.errors?.[0] ?? data.messages?.[0] ?? 'Upload failed'

      console.error('[uploadFileToStorage] Upload failed:', {
        ok: response.ok,
        success: data.success,
        errors: data.errors,
        messages: data.messages,
      })

      throw new Error(errorMsg)
    }

    console.log('[uploadFileToStorage] Success!')

    return data.result.variants[0]
  } catch (error) {
    console.error('[uploadFileToStorage] Caught error:', {
      error,
      type: typeof error,
      isError: error instanceof Error,
      stringified: JSON.stringify(error, null, 2),
    })

    // Re-throw with more context
    const errorMsg = getErrorMessage(error)
    throw new Error(`Upload failed: ${errorMsg}`)
  }
}

/**
 * Upload multiple images in parallel (e.g., for feedback attachments)
 * 1. Gets N presigned URLs based on number of files
 * 2. Uploads all files in parallel with Promise.all
 * @param files - Array of file objects with uri and metadata
 * @returns Array of uploaded file URLs
 */
export async function uploadMultipleImagesToPresignedUrl(
  files: Array<{
    uri: string
    fileName?: string
    type?: string
  }>,
): Promise<string[]> {
  if (files.length === 0) {
    return []
  }

  console.log('[uploadMultiple] Starting upload for', files.length, 'files')

  // Get presigned URLs for all files
  const presignedUrls = await apiClient.get<PresignedUrlResponse>(
    `images/presigned-url?files=${files.length}`,
  )

  console.log('[uploadMultiple] Got presigned URLs:', presignedUrls.length)

  if (!presignedUrls || presignedUrls.length !== files.length) {
    throw new Error(
      `Expected ${files.length} presigned URLs, got ${presignedUrls?.length ?? 0}`,
    )
  }

  // Upload all files in parallel
  const uploadPromises = files.map(async (file, index) => {
    const presignedUrl = presignedUrls[index]
    if (!presignedUrl?.uploadURL) {
      throw new Error(`Missing presigned URL for file ${index}`)
    }

    console.log('[uploadMultiple] Uploading file', index, ':', file.fileName)

    try {
      const result = await uploadFileToStorage(
        presignedUrl.uploadURL,
        file.uri,
        {
          fileName: file.fileName,
          type: file.type,
        },
      )
      console.log('[uploadMultiple] File', index, 'uploaded successfully')

      return result
    } catch (error) {
      const fileName = file.fileName || file.uri.split('/').pop() || 'unknown'
      const errorMsg = getErrorMessage(error)
      console.error('[uploadMultiple] File', index, 'failed:', errorMsg)
      throw new Error(`Failed to upload "${fileName}": ${errorMsg}`)
    }
  })

  const results = await Promise.all(uploadPromises)
  console.log('[uploadMultiple] All files uploaded successfully')

  return results
}

/**
 * Upload a single image (e.g., for avatar)
 * Uses uploadMultipleImagesToPresignedUrl with 1 file
 * @returns avatar URL
 */
export async function uploadImageToPresignedUrl(
  imageUri: string,
  options?: { fileName?: string; type?: string },
): Promise<string> {
  const urls = await uploadMultipleImagesToPresignedUrl([
    {
      uri: imageUri,
      fileName: options?.fileName,
      type: options?.type,
    },
  ])

  return urls[0]
}

export const imageApi = {
  getPresignedUrl: async (files = 1): Promise<PresignedUrlResponse> => {
    return apiClient.get<PresignedUrlResponse>(
      `images/presigned-url?files=${files}`,
    )
  },
  uploadImageToPresignedUrl,
  uploadMultipleImagesToPresignedUrl,
}
