import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './App.css';

const Pagination = props => {
  const [pages] = useState(Math.ceil(props.data.length / 10))
  const [currentPage, setCurrentPage] = useState(1);

  const goToNextPage = () => setCurrentPage(page => page + 1);

  const goToPreviousPage = () => setCurrentPage(page => page - 1)

  const changePage = event => {
    const pageNumber = Number(event.target.innerText);
    setCurrentPage(pageNumber);
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * 10 - 10;
    const endIndex = startIndex + 10;
    return props.data.slice(startIndex, endIndex);
  };

  const getPaginationGroup = () => {
    if (currentPage <= 3) {
      return new Array(5).fill().map((_, index) => index + 1)
    } else if (currentPage >= Math.ceil(props.data.length / 10) - 2) {
      return new Array(5).fill(Math.ceil(props.data.length / 10)).map((element, index) => element - (4 - index))
    } else {
      return new Array(5).fill(currentPage - 2).map((element, index) => element + index)
    }
  };

  return (
    <div>
      <div className="header-box">
        <div className="box">
          {/* `Games : ${props.data.length}` */}
        </div>
      </div>

      {getPaginatedData().map((data, index) => (
        <div key={index} className='data-container'>
          <div className='column'>
            {(currentPage - 1) * 10 + index + 1}
          </div>
          <div className='column'>
            {data.first_team}
          </div>
          <div className='column'>
            {data.first_result}
          </div>
          <div className='column'>
            {data.second_result}
          </div>
          <div className='column'>
            {data.second_team}
          </div>
        </div>
      ))}

      <div className='pagination'>
        
        {/* previous button */}
        <button
          onClick={goToPreviousPage}
          className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
        >
          prev
        </button>

        {/* show page numbers */}
        {getPaginationGroup().map((item, index) => (
          <button
            key={index}
            onClick={changePage}
            className={`paginationItem ${currentPage === item ? 'active' : null}`}
          >
            <span id={item}>{item}</span>
          </button>
        ))}

        {/* next button */}
        <button
          onClick={goToNextPage}
          className={`prev ${currentPage === pages ? 'disabled' : ''}`}
        >
          next
        </button>
      </div>
    </div>
  )
}

const App = () => {
  const [game, setGame] = useState([]);
  const [year, setYear] = useState(2022);
  const [split, setSplit] = useState('Summer');
  const [url, setUrl] = useState(`https://lol.fandom.com/wiki/LCS/2022_Season/Summer_Season`);

  const yearOptions = [
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
    { value: "2019", label: "2019" },
    { value: "2018", label: "2018" },
    { value: "2017", label: "2017" },
    { value: "2016", label: "2016" },
    { value: "2015", label: "2015" },
    { value: "2014", label: "2014" },
    { value: "2013", label: "2013" },
  ]
  const splitOptions = [
    { value: "Spring", label: "Spring" },
    { value: "Summer", label: "Summer" },
  ]

  useEffect(() => {
    fetch(`https://planet-scale-vercel.vercel.app/${year}/${split}`)
      .then(res => res.json())
      .then(body => {
        setGame(body)
      })
      .catch(err => console.log(err));
  }, [year, split])

  const handleYear = event => {
    setYear(event.value);
    var lcs,
      link;
    event.value >= 2019 ? lcs = "LCS" : lcs = "NA_LCS";
    event.value === 2013
      ? link = `https://lol.fandom.com/wiki/${lcs}/Season_3/${split}_Season`
      : link = `https://lol.fandom.com/wiki/${lcs}/${event.value}_Season/${split}_Season`;
    setUrl(link);
  }

  const handleSplit = event => {
    setSplit(event.value);
    var lcs,
      link;
    year >= 2019 ? lcs = "LCS" : lcs = "NA_LCS";
    year === 2013
      ? link = `https://lol.fandom.com/wiki/${lcs}/Season_3/${event.value}_Season`
      : link = `https://lol.fandom.com/wiki/${lcs}/${year}_Season/${event.value}_Season`;
    setUrl(link);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='select-boxes'>
          <Select
            defaultValue={yearOptions[0]}
            onChange={handleYear}
            name='split'
            options={yearOptions}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <Select
            defaultValue={splitOptions[1]}
            onChange={handleSplit}
            name='split'
            options={splitOptions}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <a href={url} target="_blank" rel='noreferrer'>{`${year} ${split} Split`}</a>

        <p>{`Games: ${game.length}`}</p>

        <div className='header-container'>
          <div className='column'>
            Game #
          </div>
          <div className='column'>
            Blue
          </div>
          <div className='column-res'>
            Result
          </div>
          <div className='column'>
            Red
          </div>
        </div>
        <Pagination
          data={game}
        />
      </header>
    </div>
  );
}

export default App;
