import { Router } from 'express'
import supabase from '../supabase.js'
import { upload, uploadToPortfolioBucket, getPortfolioPathFromPublicUrl } from './upload.js'

const router = Router()

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post(
  '/',
  upload.fields([
    { name: 'before', maxCount: 1 },
    { name: 'after', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description = null, category = null } = req.body || {}
      const beforeFile = req.files?.before?.[0]
      const afterFile = req.files?.after?.[0]

      if (!title) return res.status(400).json({ error: 'title is required' })
      if (!beforeFile) return res.status(400).json({ error: 'before file is required' })
      if (!afterFile) return res.status(400).json({ error: 'after file is required' })

      const workId = crypto.randomUUID()

      const beforeUpload = await uploadToPortfolioBucket(beforeFile, {
        prefix: `works/${workId}/before-`,
      })

      let afterUpload
      try {
        afterUpload = await uploadToPortfolioBucket(afterFile, {
          prefix: `works/${workId}/after-`,
        })
      } catch (e) {
        await supabase.storage.from('portfolio').remove([beforeUpload.path])
        throw e
      }

      const { data, error } = await supabase
        .from('portfolio')
        .insert([
          {
            title,
            description,
            category,
            before_url: beforeUpload.publicUrl,
            after_url: afterUpload.publicUrl,
          },
        ])
        .select('*')
        .single()

      if (error) {
        await supabase.storage.from('portfolio').remove([beforeUpload.path, afterUpload.path])
        return res.status(500).json({ error: error.message })
      }

      res.status(201).json(data)
    } catch (e) {
      res.status(500).json({ error: e?.message || 'Upload failed' })
    }
  }
)

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const { data: item, error: fetchError } = await supabase
    .from('portfolio')
    .select('id,before_url,after_url')
    .eq('id', id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') return res.status(404).json({ error: 'Not found' })
    return res.status(500).json({ error: fetchError.message })
  }

  const paths = [
    getPortfolioPathFromPublicUrl(item.before_url),
    getPortfolioPathFromPublicUrl(item.after_url),
  ].filter(Boolean)

  if (paths.length) {
    const { error: storageError } = await supabase.storage.from('portfolio').remove(paths)
    if (storageError) return res.status(500).json({ error: storageError.message })
  }

  const { error: deleteError } = await supabase.from('portfolio').delete().eq('id', id)
  if (deleteError) return res.status(500).json({ error: deleteError.message })

  res.json({ ok: true, id })
})

export default router
