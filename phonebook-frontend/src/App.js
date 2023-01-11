import { useState, useEffect } from "react"
import phoneService from "./services/phonebook.js"
import Filter from "./components/phonebook/Filter.js"
import PersonForm from "./components/phonebook/PersonForm.js"
import Persons from "./components/phonebook/Persons.js"
import Notification from "./components/phonebook/Notification.js"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [notification, setNotification] = useState({
    message: null,
    style: null,
  })

  //Initial set of persons
  useEffect(() => {
    phoneService.getAll().then((phones) => {
      setPersons(phones)
    })
  }, [])

  //Add new phone
  function handleSubmit(e) {
    e.preventDefault()

    const newPhone = {
      name: newName,
      number: newNumber,
    }

    //Check if person is already exist
    if (
      persons
        .map((person) => person.name.toLowerCase())
        .includes(newName.toLowerCase())
    ) {
      const choice =
        window.confirm(`${newName} is already added to phonebook, replace the old number 
      with a new one?`)

      if (choice) {
        const foundPerson = persons.find(
          (p) => p.name.toLowerCase() === newName.toLowerCase()
        )
        // console.log(foundPerson.name, newName); return;
        phoneService
          .update(foundPerson.id, newPhone)
          .then((updatedPerson) => {
            setPersons(
              persons.map((p) => (p.id !== foundPerson.id ? p : updatedPerson))
            )
            setNewName("")
            setNewNumber("")
            //set notification
            setNotification({
              message: `${updatedPerson.name} is updated`,
              style: "success",
            })
            setTimeout(() => {
              setNotification({ message: null, style: null })
            }, 5000)
            //end of notification
          })
          .catch((err) => {
            //if some errors occur on server
            //set notification
            setNotification({
              message: `${err.response.data.error}`,
              style: "error",
            })
            setTimeout(() => {
              setNotification({ message: null, style: null })
            }, 5000)
            //end of notification
          })
      } else return
    } else {
      //Else if person entry is new then create
      phoneService
        .create(newPhone)
        .then((returnedPhone) => {
          setPersons([...persons, returnedPhone])
          setNewName("")
          setNewNumber("")
          //set notification
          setNotification({
            message: `Added ${returnedPhone.name}`,
            style: "success",
          })
          setTimeout(() => {
            setNotification({ message: null, style: null })
          }, 5000)
          //end of notification
        })
        .catch((err) => {
          //if some errors occur on server
          //set notification
          setNotification({
            message: `${err.response.data.error}`,
            style: "error",
          })
          setTimeout(() => {
            setNotification({ message: null, style: null })
          }, 5000)
          //end of notification
        })
      // setPersons([...persons, {name: newName, number: newNumber}]);
    }
  }

  function onChange(e) {
    if (e.target.name === "name") {
      setNewName(e.target.value)
    } else if (e.target.name === "number") {
      setNewNumber(e.target.value)
    }
  }

  function onDelete(id) {
    //Prompt if user really sure to delete phone
    const delUser = persons.find((p) => p.id === id)
    if (!window.confirm(`Delete ${delUser.name}?`)) return

    //If sure continue to delete process
    phoneService
      .deletePhone(id)
      .then((response) => {
        //Response returning empty object
        setPersons(persons.filter((p) => id !== p.id))
        //set notification
        setNotification({
          message: `${delUser.name} is removed`,
          style: "error",
        })
        setTimeout(() => {
          setNotification({ message: null, style: null })
        }, 5000)
        //end of notification
      })
      .catch((error) => {
        setPersons(persons.filter((p) => id !== p.id))
        //set notification
        setNotification({
          message: `${delUser.name} was already removed from server`,
          style: "error",
        })
        setTimeout(() => {
          setNotification({ message: null, style: null })
        }, 5000)
        //end of notification
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <h1>Search</h1>
      <Filter search={search} onChange={(e) => setSearch(e.target.value)} />
      <h1>Add new</h1>
      <PersonForm
        onSubmit={handleSubmit}
        onChange={onChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} onDelete={onDelete} />
    </div>
  )
}

export default App
