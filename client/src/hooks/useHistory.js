import { useState, useEffect, useCallback } from 'react'

function useHistory(selectedItem) {
  const [history, setHistory] = useState([])

  const fetchHistory = useCallback(async (id) => {
    const res = await fetch(`http://localhost:3001/api/items/${id}`)
    const json = await res.json()
    setHistory(json)
  }, [])

  useEffect(() => {
    if (selectedItem) {
      fetchHistory(selectedItem)
    }
  }, [selectedItem, fetchHistory])

  return { history, fetchHistory }
}

export default useHistory
