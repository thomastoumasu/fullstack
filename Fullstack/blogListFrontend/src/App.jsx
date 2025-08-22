import { useEffect, useState } from 'react'
import './App.css'
import blogService from './services/blogs' 
import loginService from './services/login' 
import logger from './utils/logger'
import Notification from './components/Notification'

const Blog = ({blog}) => 
  <div> {blog.title} {blog.author} </div>

const App = () => {
  const [blogs, setBlogs] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({message: null, isAlert: false})
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const notify = (message, isAlert) => {
    setNotification({ message: message, isAlert: isAlert }) // this will trigger rendering of Notification()
    setTimeout(() => {
      setNotification({ message: null, isAlert: false })
    }, 2000)
  }

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        logger.info('-app: initialBlogs: ', initialBlogs)
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    console.log('--app: effect, loggedUserJSON: ', loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(JSON.parse(loggedUserJSON))
      console.log('--app: effect, user: ', user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      console.log('--App: logged in user: ', user)
    } catch (exception) {
      notify('Wrong credentials', true)
    }
  }

  const logOut = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        notify(`new blog: ${returnedBlog.title} has been added`, false)
        setTitle('')
        setAuthor('')
        setUrl('')
      })
      .catch(error => {
        logger.info(error)
        notify(error.response.statusText, true)
      })
  }

  const createBlogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )

  if (!user) {
    return (
      <>
        <Notification notification={notification} />
        <h2>log in to application</h2>
        {loginForm()}
      </>
    )
  }
  return (
    <>
      <Notification notification={notification} />
      {blogs
        ? <div>
          <h2>blogs</h2>
          <p> 
            {user.username} logged in 
            <button onClick={logOut}>
              log out
            </button> 
          </p>
          {createBlogForm()}
          {blogs.map(b =>
            <Blog key={b.id} blog={b} />
          )}
        </div>
        : null
      }
    </>
  )
}

export default App
