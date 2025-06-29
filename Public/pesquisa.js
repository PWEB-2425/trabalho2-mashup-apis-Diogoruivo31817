document.getElementById('formPesquisa').onsubmit = async e => {
  e.preventDefault();
  const city = document.getElementById('cidade').value;
  const resp = await fetch(`/api/search?q=${encodeURIComponent(city)}`);
  const data = await resp.json();
  if (resp.ok) {
    document.getElementById('info-weather').innerHTML = `
      <h2>Clima em ${data.weather.city}</h2>
      <p>🌡️ ${data.weather.temp} °C — ${data.weather.desc}</p>
    `;
    document.getElementById('info-country').innerHTML = `
      <h2>País: ${data.country.name}</h2>
      <p><strong>Capital:</strong> ${data.country.capital}</p>
      <p><strong>População:</strong> ${data.country.population.toLocaleString()}</p>
      <img src="${data.country.flag}" width="100" alt="Bandeira de ${data.country.name}">
    `;
  } else {
    document.getElementById('resultado').innerText = data.error;
  }
};

