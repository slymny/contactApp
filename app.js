//UI Elements
const nameElement = document.getElementById('name');
const lastNameElement = document.getElementById('last-name');
const emailElement = document.getElementById('email');
const contactList = document.querySelector('.contact-list');

const form = document.getElementById('form-contact');

//event listeners
form.addEventListener('submit', save);
contactList.addEventListener('click', contactActions);

let allContacts = [];
let selectedRow = undefined;

function save(e) {
  e.preventDefault();

  const contact = {
    name: nameElement.value,
    lastName: lastNameElement.value,
    email: emailElement.value,
  };
  const result = dataControl(contact);
  if (result.status) {
    if (selectedRow) {
      updateContact(contact); 
    } else {
      addContact(contact);
    }
  } else {
    createInfo(result.message, result.status);
  }
}

function updateContact(contact) {
  const indexOfUpdate = allContacts.indexOf(allContacts.find(obj => obj.email === selectedRow.cells[2].textContent));
  allContacts[indexOfUpdate] = contact;
  
  selectedRow.cells[0].textContent = contact.name;
  selectedRow.cells[1].textContent = contact.lastName;
  selectedRow.cells[2].textContent = contact.email;

  document.querySelector('.save-update').value = 'Save';
  selectedRow = undefined;
}

function dataControl(contact) {
  for (const value in contact) {
    if (!contact[value]) {
      return {
        status: false,
        message: 'Please Fill Each of the Information',
      };
    }
  }
  clearForms();
  return {
    status: true,
  };
}

function createInfo(msg, status) {
  const createdData = document.createElement('div');
  createdData.textContent = msg;
  createdData.className = 'info';
  createdData.classList.add(status ? 'info--success' : 'info--error');

  document.querySelector('.container').insertBefore(createdData, form);
  setTimeout(() => createdData.remove(), 1500);
}

function clearForms() {
  nameElement.value = '';
  lastNameElement.value = '';
  emailElement.value = '';
}

function addContact(contact) {
  const newContact = document.createElement('tr');
  const {name, lastName, email} = contact;
  newContact.innerHTML = `<td>${name}</td>
    <td>${lastName}</td>
    <td>${email}</td>
    <td>
      <button class="btn btn--edit"><i class="far fa-edit"></i></button>
      <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
    </td>`;
  contactList.appendChild(newContact);
  allContacts.push(contact);
  createInfo('Contact added successfully', true);
}

function contactActions(e) {
  if (e.target.classList.contains('btn--delete')) {
    const deletingContact = e.target.parentElement.parentElement;
    removeContact(deletingContact);
  } else if (e.target.classList.contains('btn--edit')) {
    document.querySelector('.save-update').value = 'Update';
    const selectedTr = e.target.parentElement.parentElement;
    
    nameElement.value = selectedTr.cells[0].textContent;
    lastNameElement.value = selectedTr.cells[1].textContent;
    emailElement.value = selectedTr.cells[2].textContent;

    selectedRow = selectedTr;
  }
}

function removeContact(deletingElement) {
  deletingElement.remove();
  console.log(deletingElement);
  const deletingContact = {
    name: deletingElement.cells[0].textContent,
    lastName: deletingElement.cells[1].textContent,
    email: deletingElement.cells[2].textContent,
  }
  console.log(deletingContact);
  console.log(allContacts);
  const indexToDelete = allContacts.indexOf(allContacts.find(obj => obj.email === deletingContact.email));
  allContacts.splice(indexToDelete, 1);
  console.log(allContacts);
  clearForms();
  document.querySelector('.save-update').value = 'Save';
}
