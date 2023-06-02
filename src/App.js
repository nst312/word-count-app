import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [currentResult, setCurrentResult] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = () => {
    axios.get('http://localhost:3001/api/insights')
      .then(response => {
        setSearchHistory(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleWordCount = () => {
    setIsLoading(true); // Start loading

    const endpoint = 'http://localhost:3001/api/analyze';
    const data = {
      url: url,
    };

    axios.post(endpoint, data)
      .then(response => {
        setCurrentResult(response.data);
        fetchSearchHistory();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRemoveEntry = (id) => {
    const endpoint = `http://localhost:3001/api/insights/${id}`;

    axios.delete(endpoint)
      .then(() => {
        fetchSearchHistory();
      })
      .catch(error => {
        console.error(error);
      });
  };


  const handleFavEntry = (id) => {
    const endpoint = `http://localhost:3001/api/insights/${id}`;

    axios.put(endpoint)
      .then(() => {
        fetchSearchHistory();
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="app" >
      <div >
        <h1>Webpage Scraper</h1>
        <div className="input-container">
          <TextField
            label="Enter Website URL"
            variant="outlined"
            value={url}
            onChange={handleUrlChange}
          />
          <Button variant="contained" onClick={handleWordCount}>Get insights</Button>
        </div>

        {isLoading ? (
          <div>
            <h2>Loading...</h2>
          </div>
        ) : (
           (
            <div>
               <h2>Search History</h2>
            </div>
          )
          
        )}

       
      </div>
      <div className="table-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '15%' }}>Domain Name</TableCell>
                <TableCell style={{ width: '5%' }} align="center">Word Count</TableCell>
                <TableCell style={{ width: '5%' }} align="center">Favourite</TableCell>
                <TableCell style={{ width: '35%' }} align="center">Web Links</TableCell>
                <TableCell style={{ width: '30%' }} align="center">Media Links</TableCell>
                <TableCell style={{ width: '10%' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchHistory?.result?.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell style={{ wordWrap: 'break-word', maxWidth: '15%' }}>{entry.domain}</TableCell>
                  <TableCell style={{ wordWrap: 'break-word', maxWidth: '5%' }} align="center">{entry.wordCount}</TableCell>
                  <TableCell style={{ wordWrap: 'break-word', maxWidth: '5%' }} align="center">{entry.favourite ? 'true' : 'false'}</TableCell>
                  <TableCell style={{ wordWrap: 'break-word', maxWidth: '35%' }} align="start">
                    {entry.links.map((link, i) => (
                      <div style={{ wordWrap: 'break-word', overflow: 'auto' }} key={i}>{link} </div>
                    ))}
                  </TableCell>
                  <TableCell style={{ maxWidth: '30%' }} align="start">
                    {entry.media.map((link, i) => (
                      <div style={{ wordWrap: 'break-word', overflow: 'auto' }} key={i}>{link}</div>
                    ))}
                  </TableCell>
                  <TableCell style={{ maxWidth: '10%' }} align="center">
                    <Button variant="contained" onClick={() => handleRemoveEntry(entry._id)}>Remove</Button>
                    <Button variant="contained" onClick={() => handleFavEntry(entry._id)}>Add_To_Fav</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default App;
