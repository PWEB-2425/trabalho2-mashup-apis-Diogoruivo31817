// public/pesquisa.js
document.getElementById('formPesquisa').onsubmit = async e => {
  e.preventDefault();
  const city = document.getElementById('cidade').value;
  const resp = await fetch(`/api/search?q=${encodeURIComponent(city)}`);
  const data = await resp.json();

  if (resp.ok) {
    document.getElementById('info-weather').innerHTML = `
      <h2>Clima em ${data.weather.city}</h2>
      <p>🌡️ Temperatura: ${data.weather.temp} °C — ${data.weather.desc}</p>
      <p>🤗 Sensação Térmica: ${data.weather.feels_like} °C</p>
      <p>💧 Humidade: ${data.weather.humidity}%</p>
      <p>💨 Vento: ${data.weather.windSpeed} m/s</p>
    `;

    document.getElementById('info-country').innerHTML = `
      <h2>País: ${data.country.name}</h2>
      <p><strong>Capital:</strong> ${data.country.capital}</p>
      <p><strong>População:</strong> ${data.country.population.toLocaleString()}</p>
      <p><strong>Região:</strong> ${data.country.region}</p>
      <p><strong>Línguas:</strong> ${data.country.languages}</p>
      <p><strong>Moedas:</strong> ${data.country.currencies}</p>
      <a href="${data.country.flag}" target="_blank" rel="noopener">
        <img src="${data.country.flag}" width="100" alt="Bandeira de ${data.country.name}">
      </a>
    `;
  } else {
    document.getElementById('resultado').innerText = data.error;
  }
};


