import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = "21BCE8150"; 
  }, []);

  const handleSubmit = async () => {
    try {
      // Parse the JSON input and validate if it has a "data" key
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error('JSON must contain a "data" key with an array value.');
      }
      setError('');
      
      // Make the POST request to the backend
      const response = await axios.post('https://bhfl-backend-a17eb11d47df.herokuapp.com/bfhl', parsedInput);
      setResponseData(response.data);
      setIsSubmitted(true);
    } catch (err) {
      // Handle errors, including invalid JSON format or missing "data" key
      setError('Invalid JSON format or structure: ' + err.message);
      setResponseData(null);
      setIsSubmitted(false);
    }
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;

    return (
      <div>
        {selectedOptions.includes('Numbers') && numbers.length > 0 && (
          <div>Numbers: {numbers.join(', ')}</div>
        )}
        {selectedOptions.includes('Alphabets') && alphabets.length > 0 && (
          <div>Alphabets: {alphabets.join(', ')}</div>
        )}
        {selectedOptions.includes('Highest lowercase alphabet') && highest_lowercase_alphabet.length > 0 && (
          <div>Highest lowercase alphabet: {highest_lowercase_alphabet.join(', ')}</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>BFHL Frontend</h1>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON data'
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isSubmitted && (
        <>
          <select multiple={true} onChange={(e) => setSelectedOptions([...e.target.selectedOptions].map(option => option.value))}>
            <option value='Alphabets'>Alphabets</option>
            <option value='Numbers'>Numbers</option>
            <option value='Highest lowercase alphabet'>Highest lowercase alphabet</option>
          </select>
          {renderResponse()}
        </>
      )}
    </div>
  );
};

export default App;
