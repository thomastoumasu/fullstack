const Header = ({text}) => <h1>{text}</h1>

const Part = ({part}) =>
  <p>{part.name} {part.exercises}</p>

const Content = ({parts}) => {
  return (
    <>
      <Part part={parts[0]} />
      <Part part={parts[1]} />
      <Part part={parts[2]} />
    </>
  )
}

const Total = ({exercises}) =>
  <p>Number of exercises {exercises[0] + exercises[1] + exercises[2]}</p>

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header text={course.name}/>
      <Content parts={course.parts} />
      <Total exercises={course.parts.map(element => element.exercises)} />
    </div>
  )
}

export default App

