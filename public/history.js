document.addEventListener('DOMContentLoaded', async () => {
  const ul = document.getElementById('history-list');
  try {
    const resp = await fetch('/history');
    if (!resp.ok) throw new Error('Erro ao obter histórico');
    const history = await resp.json();
    if (history.length === 0) {
      ul.innerHTML = '<li>Não há pesquisas no histórico.</li>';
    } else {
      ul.innerHTML = history
        .map(h => {
          const dt = new Date(h.date);
          return `<li>
            <strong>${h.term}</strong>
            <em> — ${dt.toLocaleString()}</em>
          </li>`;
        })
        .join('');
    }
  } catch (e) {
    console.error(e);
    ul.innerHTML = '<li>Não foi possível carregar o histórico.</li>';
  }
});

