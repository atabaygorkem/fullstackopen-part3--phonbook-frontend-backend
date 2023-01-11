const PersonForm = ({ onSubmit, onChange, newName, newNumber }) => (
  <form onSubmit={onSubmit}>
    <div>
      Name: <input name="name" value={newName} onChange={onChange} />
    </div>
    <div>
      Number: <input name="number" value={newNumber} onChange={onChange} />
    </div>
    <div>
      <button type="submit">Add</button>
    </div>
  </form>
)

export default PersonForm
