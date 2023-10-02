interface SearchBarProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ onChange }: SearchBarProps) => {
  return (
    <div className="p-3 w-[350px] rounded-lg bg-slate-300 dark:bg-zinc-950">
      <input
        type="text"
        placeholder="Search dragons"
        onChange={onChange}
        className="bg-transparent outline-none"
      />
    </div>
  );
};

export default SearchBar;
