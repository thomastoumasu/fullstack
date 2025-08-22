import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'
import noteService from './services/notes'
import loginService from './services/login'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    console.log('--app: effect, loggedUserJSON: ', loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(JSON.parse(loggedUserJSON))
      console.log('--app: effect, user: ', user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
        .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote)
        .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ 
        username, password
      })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
      console.log('--App: logged in user: ', user)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      console.log('wrong credentials exception: ', exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const noteForm = () => {
    return (
      <Togglable buttonLabel='create'>
        <NoteForm createNote={addNote} />
      </Togglable>
    )
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel='log in'>
        <LoginForm  login={login} />
      </Togglable>
    )
  }

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      }

      <h2>Notes</h2>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <Footer />
      {/* <p> debug {user} </p> */}
    </div>
  )
}


export default App