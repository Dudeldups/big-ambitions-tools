"use client";

// type Props = {
//   onSubmit: () => void;
// };

const Searchbar = () => {
  // submit handler on change to update the table with the filter value
  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const filterValue = formData.get("filter") as string;
    console.log("Filter value:", filterValue);
  };

  return (
    <div>
      <form onChange={handleSubmit} className="p-4">
        <label htmlFor="filter">Filter results</label>
        <input
          type="text"
          id="filter"
          name="filter"
          className="block bg-gray-200 text-black"
        />
      </form>
    </div>
  );
};

export default Searchbar;
