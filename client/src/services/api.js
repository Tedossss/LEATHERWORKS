import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export const getPortfolio = () => api.get('/api/portfolio')
export const submitQuote = (data) => api.post('/api/contact', data)

export default api