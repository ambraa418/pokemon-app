document.addEventListener('DOMContentLoaded', () => {
    // Rimuovi la lista preferiti quando la pagina si carica
    localStorage.removeItem('favorites');
    console.log('Favorites cleared at app start.');

// Funzione per cercare un Pokémon
async function fetchPokemon() {
    const pokemonNameOrId = document.getElementById('pokemonInput').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`;
    const container = document.getElementById('pokemonContainer');
    container.innerHTML = ''; // Pulisci il contenitore

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Pokémon not found');
        }

        const pokemonData = await response.json();

        // Mostra i dati del Pokémon
        container.innerHTML = `
            <div class="pokemon-card">
                <h2>${pokemonData.name.toUpperCase()}</h2>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <p><strong>Type:</strong> ${pokemonData.types.map(t => t.type.name).join(', ')}</p>
                <p><strong>Abilities:</strong> ${pokemonData.abilities.map(a => a.ability.name).join(', ')}</p>
                <p><strong>Stats:</strong></p>
                <ul>
                    ${pokemonData.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join('')}
                </ul>
                <button id="saveFavorite">Save to Favorites</button>
            </div>
        `;

        // Salva nei preferiti
        document.getElementById('saveFavorite').addEventListener('click', () => {
            saveFavorite(pokemonData.name);
            alert(`${pokemonData.name.toUpperCase()} added to favorites!`);
        });
    } catch (error) {
        container.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Funzione per salvare Pokémon nei preferiti
function saveFavorite(pokemonName) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(pokemonName)) {
        favorites.push(pokemonName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

// Funzione per mostrare i preferiti
function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const container = document.getElementById('pokemonContainer');
    container.innerHTML = '<h2>Your Favorites</h2>';

    if (favorites.length === 0) {
        container.innerHTML += '<p>No favorites yet!</p>';
    } else {
        container.innerHTML += favorites
            .map(fav => `<p>${fav.toUpperCase()}</p>`)
            .join('');
    }
}

// Gioco: Guess the Pokémon
let score = 0;
let isAnswered = false; // Variabile per sapere se la risposta è già stata data

async function guessThePokemon() {
    if (isAnswered) return; // Blocca il gioco se la risposta è già stata data

    const randomId = Math.floor(Math.random() * 151) + 1; // Pokémon della prima generazione
    const url = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
    const container = document.getElementById('pokemonContainer');
    container.innerHTML = ''; // Pulisci il contenitore

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch Pokémon');
        }

        const pokemonData = await response.json();

        container.innerHTML = `
            <div class="pokemon-card">
                <h2>Who's That Pokémon?</h2>
                <img src="${pokemonData.sprites.front_default}" alt="Mystery Pokémon">
                <input type="text" id="guessInput" placeholder="Your guess">
                <button id="submitGuess">Submit Guess</button>
                <p id="feedback"></p>
            </div>
        `;

        document.getElementById('submitGuess').addEventListener('click', () => {
            const userGuess = document.getElementById('guessInput').value.toLowerCase();
            const feedback = document.getElementById('feedback');

            if (userGuess === pokemonData.name) {
                score++;
                feedback.textContent = `Correct! Your score: ${score}`;
                feedback.style.color = 'green';
                setTimeout(guessThePokemon, 2000)
            } else {
                feedback.textContent = `Wrong! The correct answer was ${pokemonData.name}. Your score: ${score}`;
                feedback.style.color = 'red';
                setTimeout(guessThePokemon, 2000)
            }
            
           
        });
    } catch (error) {
        container.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}


// Funzione per confrontare due Pokémon
async function comparePokemon() {
    const pokemon1 = document.getElementById('pokemonInput1').value.toLowerCase();
    const pokemon2 = document.getElementById('pokemonInput2').value.toLowerCase();
    const container = document.getElementById('pokemonContainer');
    container.innerHTML = ''; // Pulisci il contenitore

    try {
        // Effettua le richieste per entrambi i Pokémon
        const responses = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon1}`),
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon2}`)
        ]);

        if (!responses[0].ok || !responses[1].ok) {
            throw new Error('One or both Pokémon not found');
        }

        const [data1, data2] = await Promise.all(responses.map(res => res.json()));

        // Mostra i dati confrontati
        container.innerHTML = `
            <h2>Comparison</h2>
            <div style="display: flex; justify-content: space-around;">
                <div>
                    <h3>${data1.name.toUpperCase()}</h3>
                    <img src="${data1.sprites.front_default}" alt="${data1.name}">
                    <p><strong>Stats:</strong></p>
                    <ul>
                        ${data1.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h3>${data2.name.toUpperCase()}</h3>
                    <img src="${data2.sprites.front_default}" alt="${data2.name}">
                    <p><strong>Stats:</strong></p>
                    <ul>
                        ${data2.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Event Listeners
document.getElementById('searchBtn').addEventListener('click', fetchPokemon);
document.getElementById('listBtn').addEventListener('click', showFavorites);
document.getElementById('guessBtn').addEventListener('click', guessThePokemon);
document.getElementById('compareBtn').addEventListener('click', comparePokemon);
})
