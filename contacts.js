const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const filePath = path.resolve("db", "contacts.json");

const addNewContacts = async (data) => {
  try {
    const string = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, string);
  } catch (error) {
    console.log("ERROR", error.message);
  }
};

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(filePath);
    const parseContacts = JSON.parse(contacts);
    console.table(parseContacts);
    return parseContacts;
  } catch (error) {
    console.log("ERROR", error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((item) => item.id === +contactId);
    if (!contact) {
      throw new Error(`We have no contact with this id = ${contactId}!`);
    }
    console.table(contact);
    return contact;
  } catch (error) {
    console.log("ERROR", error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter(({ id }) => id !== +contactId);

    if (contacts.length === newContacts.length) {
      throw new Error(`We have no contact with this id = ${contactId}!`);
    }
    await addNewContacts(newContacts);
    console.log(`Contact with id "${contactId}" deleted`);
    return newContacts;
  } catch (error) {
    console.log("ERROR", error.message);
  }
};

const addContact = async (name, email, phone) => {
  const newContact = {
    id: uuidv4(),
    name: name,
    email: email,
    phone: phone,
  };
  try {
    const contacts = await listContacts();
    contacts.push(newContact);
    await addNewContacts(contacts);
    console.table(contacts);
    return contacts;
  } catch (error) {
    console.log("ERROR", error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
