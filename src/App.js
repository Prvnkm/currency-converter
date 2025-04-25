import React, { useState, useEffect } from 'react';
import './App.css';

const mockCurrencies = ['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY']; 

function App() {
  const [currencies, setCurrencies] = useState(mockCurrencies);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState('');

  // Fetch available currencies
  useEffect(() => {
    fetch('https://api.exchangerate.host/symbols')
      .then((res) => res.json())
      .then((data) => {
        if (data.symbols) {
          setCurrencies(Object.keys(data.symbols)); 
        } else {
          console.warn('Using mock currency list');
        }
      })
      .catch(() => {
        console.warn('Failed to load symbols, using mock data');
      });
  }, []);

  
  useEffect(() => {
    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount)) {
      setError('Enter a valid number.');
      setConvertedAmount(null);
      return;
    }

    const url = `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${numericAmount}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.result && typeof data.result === 'number') {
          setConvertedAmount(data.result.toFixed(2));
          setError('');
        } else {
          setError('Conversion failed. Try again.');
          setConvertedAmount(null);
        }
      })
      .catch(() => {
        setError('API error. Please check your internet connection.');
        setConvertedAmount(null);
      });
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="App">
      <h1>Currency Converter 💱</h1>

      <div className="converter">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        <span>to</span>

        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      {convertedAmount && !error && (
        <h2>
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </h2>
      )}
    </div>
  );
}

export default App;
