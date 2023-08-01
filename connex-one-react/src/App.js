import { useState, useEffect } from "react"
import './App.css';

function formatStopwatchTime(timeDifference) {
  const hours = Math.floor(timeDifference / 3600);
  const minutes = Math.floor((timeDifference % 3600) / 60);
  const seconds = timeDifference % 60;

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return formattedTime;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");
  const [metric, setMetric] = useState("");

  const timeAPICall = async () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "mysecrettoken");

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };

    try {
      const response = await fetch("http://localhost:3000/time", requestOptions)
      const time = await response.json()
      const { epoch } = time
      const timeDifferenceSeconds = Math.floor(Date.now()) - epoch;
      setTime(formatStopwatchTime(timeDifferenceSeconds))
    } catch (error) {
      console.log(error)
    }


  }

  const metricAPICall = async () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "mysecrettoken");

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    try {
      const response = await fetch("http://localhost:3000/metrics", requestOptions)
      const metric = await response.text()
      console.log(metric)
      setMetric(metric)
    } catch (error) {
      console.log(error)
    }


  }

  useEffect(() => {

    const init = async () => {
      setLoading(true)
      await timeAPICall()
      await metricAPICall()
      setLoading(false)
    }

    init()

    setInterval(() => { init() }, 30000)

  }, [])



  return (
    <div className="App">

      <div className="main">
        <h3>Time Delay: {time}</h3>
        {!loading ? <p>{metric}</p> : <p>Loading....</p>}
      </div>

    </div>
  );
}

export default App;
