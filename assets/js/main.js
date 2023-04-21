const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById('modal')

const poke = new Object()


const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="handlePokemon(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

async function handlePokemon (pokemonId) {

    const ApiPokemon = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
    const ApiDetail = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`
    
    await fetch(ApiPokemon)
        .then((res)=> {
            return res.json()
        })
        .then((pokemon)=> {
            return detailPokemon.getDetailPokemon(
                pokemon.height, 
                pokemon.weight, 
                pokemon.types[0].type.name, 
                pokemon.forms[0].name,
                pokemon.sprites.other.dream_world.front_default
            )
        })
    await fetch(ApiDetail)
        .then((res)=> {
            return res.json()
        })
        .then((pokemon)=> {
            return detailPokemon.getinformationPokemon(pokemon.growth_rate.name, pokemon.habitat.name)
        })
        
    
    loadModal(poke)

    modal.classList.toggle('hidden')
    modal.classList.toggle('open')

}
const detailPokemon = {
    getDetailPokemon (altura, peso, tipo, nome, img ){
        poke.altura = altura
        poke.peso = peso
        poke.tipo = tipo
        poke.nome = nome
        poke.img = img
    },
    getinformationPokemon (txEvolucao, habitat) {
        poke.txEvolucao = txEvolucao
        poke.habitat = habitat
    }
}
function closeModal() {
    modal.classList.toggle('open')
    modal.classList.toggle('hidden')
}


function loadModal (poke) {

    console.log(poke)
    modal.innerHTML = ` <div class="card">
    <div class="img ${poke.tipo}">
        <p id="close" onclick="closeModal()">fechar</p>
        <p>${poke.nome}</p>
        <img src="${poke.img}" alt="">
    </div>
    <div class="detail-card">
        <p>Especificações</p>
        <div class="items-card">
            <div class="item-card">
                <h3>Altura</h3>
                <p>${poke.altura}</p>
            </div>
            <div class="item-card">
                <h3>Peso</h3>
                <p>${poke.peso}</p>
            </div>
            <div class="item-card">
                <h3>Tx. de evolução</h3>
                <p>${poke.txEvolucao}</p>
            </div>
            <div class="item-card">
                <h3>Habitat</h3>
                <p>${poke.habitat}</p>
            </div>
        </div>
    </div>
</div>
    `

}


