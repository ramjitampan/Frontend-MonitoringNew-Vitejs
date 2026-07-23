import { useState, useEffect, useCallback, useRef } from "react"
import api from "../api"

export function useFetch(url, options = {}) {
  const { params = {}, immediate = true } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async (overrideParams) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(url, { params: overrideParams || params })
      if (mountedRef.current) {
        setData(res.data)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.response?.data?.message || err.message || "Terjadi kesalahan")
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [url, JSON.stringify(params)])

  useEffect(() => {
    mountedRef.current = true
    if (immediate) {
      fetchData()
    }
    return () => { mountedRef.current = false }
  }, [fetchData, immediate])

  return { data, loading, error, refetch: fetchData }
}
