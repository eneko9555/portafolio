import axios from 'axios'
import { useState, useEffect } from 'react'

const useProjects = () => {
  const [limit, setLimit] = useState()

  async function getProjects () {
    try {
      const { data } = await axios(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`
      )
      setLimit(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProjects()
  }, [])

  return [limit, setLimit, getProjects]
}

export default useProjects
