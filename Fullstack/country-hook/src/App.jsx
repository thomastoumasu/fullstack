import { useEffect, useState } from 'react'
import axios from 'axios'
import countryService from './services/countries'

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.isFound) {
    return (
      <p>not found...</p>
    )
  }

  return (
    <p>{country.data.name}</p>
  )
}

const useField = (type) => {
  const [value, setValue] = useState('')
  const onChange = e => setValue(e.target.value) 
  return { type, value, onChange }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect( () => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        console.log('--App: fetch successful: ', response.data)
        setCountry({
          isFound: true,
          data: {
            name: response.data.name.official
          }
        })
      })
      .catch(error => {
        console.log('--App: fetch unsuccesful, error: ', error.response.data.error)
        setCountry({
          isFound: false
        })
      })
  }, [name])

  return country
}

const App = () => {
  const nameInput = useField('text')
  // const [name, setName] = useState(null)
  // const country = useCountry(name)

  // const fetch = (e) => {
  //   e.preventDefault()
  //   setName(nameInput.value)
  // }

  const [country, setCountry] = useState(null)
  const fetch = (e) => {
    e.preventDefault()
    console.log('--App: fetching from ', `https://studies.cs.helsinki.fi/restcountries/api/name/${nameInput.value}`)
    return axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${nameInput.value}`)
      .then(response => {
        console.log('--App: fetch successful: ', response.data)
        setCountry({ 
          isFound: true,
          data: {
            name: response.data.name.official
          }
        })
      })
      .catch(error => {
        console.log('--App: fetch unsuccesful, error: ', error.response.data.error)
        setCountry({
          isFound: false
        })
      })
    }

  return (
    <>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>
      <Country country={country} />
    </>
  )
}

export default App