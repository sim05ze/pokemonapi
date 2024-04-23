import { atom, useAtom } from "jotai";
import axios from "axios";
import { useState, useEffect, startTransition } from "react";
import Select from "react-select";
import "./App.css";
import { API_URL } from "./api/api";

const numberAtom = atom(1);

// аттом для получения всех покемонов
const allPokemonDataAtom = atom(async () => {
  try {
    const response = await axios.get(`${API_URL}/pokemon?limit=1000`);
    return response.data.results.map((pokemon, index) => ({
      value: index + 1,
      label: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    }));
  } catch (error) {
    console.error(error.message);
    return [];
  }
});

// атом для получения одного покемона
const pokemonDataAtom = atom(async (get) => {
  const number = get(numberAtom);
  const URL = `${API_URL}/pokemon/${number}`;
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
});

function App() {
  const [number, setNumber] = useAtom(numberAtom);
  const [allPokemonData] = useAtom(allPokemonDataAtom);
  const [data] = useAtom(pokemonDataAtom);

  const handleSelectChange = async (selectOption) => {
    startTransition(() => {
      setNumber(selectOption.value);
    });
  };

  return (
    <div className="wrapper">
      <h1>Pokemon</h1>
      <Select options={allPokemonData} onChange={handleSelectChange} className="select" />
      {data && (
        <div className="pokemon-card">
          <h2 className="pokemon-name">Name: {data?.name}</h2>
          <h3 className="pokemon-weight">Weight: {data?.weight}</h3>
          <img
            className="pokemon-image"
            src={
              data ? (
                data?.sprites?.other?.dream_world?.front_default
              ) : (
                <p>Loading...</p>
              )
            }
          />
          <div className="pokemon-abilities">
            <p>My abilities are:</p>
            {data
              ? data?.abilities.map((value, key) => {
                  return <div key={key}>{value.ability.name}</div>;
                })
              : ""}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
