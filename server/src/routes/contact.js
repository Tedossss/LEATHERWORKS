import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ error: 'Not found' })
    return res.status(500).json({ error: error.message })
  }

  res.json(data)
})

router.put('/', async (req, res) => {
  const { phone = null, email = null, address = null, hours = null } = req.body || {}

  const { data, error } = await supabase
    .from('contacts')
    .update({ phone, email, address, hours })
    .eq('id', 1)
    .select('*')
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router
