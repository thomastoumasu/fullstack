import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import type { DiaryEntry, NonSensitiveDiaryEntry, Weather, Visibility, NewDiaryEntry } from "./types";

interface EntryProps {
  entry: DiaryEntry;
}

const Entry = (props: EntryProps) => (
  <div>
    <div>
      <strong>{props.entry.date}</strong>
    </div>
    <div>weather: {props.entry.weather}</div>
    <div>visibility: {props.entry.visibility}</div>
    <div>
      <i>comment: {props.entry.comment}</i>
    </div>
    <br></br>
  </div>
);

interface SimpleEntryProps {
  entry: NonSensitiveDiaryEntry;
}

const SimpleEntry = (props: SimpleEntryProps) => (
  <div>
    <div>
      <strong>{props.entry.date}</strong>
    </div>
    <div>weather: {props.entry.weather}</div>
    <div>visibility: {props.entry.visibility}</div>
    <br></br>
  </div>
);

function App() {
  const [diaryEntries, setDiaryEntries] = useState<
    DiaryEntry[] | NonSensitiveDiaryEntry[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newWeather, setNewWeather] = useState<Weather>('sunny');
  const [newVisibility, setNewVisibility] = useState<Visibility>('good');
  const [newComment, setNewComment] = useState("");

  const entryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const entryToAdd = {
      date: newDate,
      weather: newWeather,
      visibility: newVisibility,
      comment: newComment
    };
    axios
      .post<NewDiaryEntry>("http://localhost:3003/api/diary/", entryToAdd)
      .then((response) => {
        console.log(response.data);
        setDiaryEntries(diaryEntries.concat(response.data as DiaryEntry));
      });
    setNewDate("");
    setNewWeather("sunny");
    setNewVisibility("good");
    setNewComment("");
  };

  const toggleComments = () => setShowComments(!showComments);

  useEffect(() => {
    const url = showComments
      ? "http://localhost:3003/api/diary/all"
      : "http://localhost:3003/api/diary/";
    axios.get<DiaryEntry[] | NonSensitiveDiaryEntry[]>(url).then((response) => {
      console.log(response.data);
      setDiaryEntries(response.data);
    });
  }, [showComments]);

  return (
    <>
      <h2>New Entry</h2>
      <form onSubmit={entryCreation}>
        <div>
          <input
            value={newDate}
            onChange={(event) => setNewDate(event.target.value)}
          />
        </div>
        <div>
          <input
            value={newWeather}
            onChange={(event) => setNewWeather(event.target.value as Weather)}
          />
        </div>
        <div>
          <input
            value={newVisibility}
            onChange={(event) =>
              setNewVisibility(event.target.value as Visibility)
            }
          />
        </div>
        <div>
          <input
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
      <h2>Diary entries</h2>
      <button onClick={toggleComments}>
        {showComments ? "hide comments" : "show comments"}
      </button>
      <div>
        {diaryEntries.map((entry) => {
          if (showComments) {
            return <Entry key={entry.id} entry={entry} />;
          } else {
            return <SimpleEntry key={entry.id} entry={entry} />;
          }
        })}
      </div>
    </>
  );
}

export default App;
