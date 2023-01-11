const Persons = ({ persons, search, onDelete }) => (
  <>
    {persons
      .filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((person) => (
        <p key={person.id}>
          {person.name}: {person.number}
          <button onClick={(event) => onDelete(person.id)}>delete</button>
        </p>
      ))}
  </>
)

export default Persons
