import { useState } from "react";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

const BarraBuscar = ({ onSearch }: SearchProps) => {
  const [textInput, setTextInput] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(textInput);
  };

  return (
    <form className="dsc-search-bar" onSubmit={handleSubmit}>
      <button className="pesquisa-submit"  type="submit">🔎︎</button>
      <input
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Nome do produto"
      />
      <button className="reset" type="reset" onClick={() => setTextInput("")}>🗙</button>
    </form>
  );
};

export { BarraBuscar };
