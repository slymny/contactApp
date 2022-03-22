//UI Elements
const nameElement = document.getElementById('name');
const lastNameElement = document.getElementById('last-name');
const emailElement = document.getElementById('email');

const form = document.getElementById('form-contact');

//event listeners
form.addEventListener('submit', save);
function save(e) {
  e.preventDefault();

  const contact = {
    name: nameElement.value,
    lastName: lastNameElement.value,
    email: emailElement.value,
  };
  const result = dataControl(contact);
  createInfo(result.message, result.status);
  if (result.status) {
    addContact(contact);
  }
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
  cleanForms();
  return {
    status: true,
    message: 'Person Saved',
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

function cleanForms() {
  nameElement.value = '';
  lastNameElement.value = '';
  emailElement.value = '';
}

function addContact(contact) {
    const newContact = document.createElement('tr');
    const newName = document.createElement('td');
    const newLastName = document.createElement('td');
    const newEmail = document.createElement('td');
    const newActions = document.createElement('td');
    newName.textContent = contact.name;
    newLastName.textContent = contact.lastName;
    newEmail.textContent = contact.email;
    newActions.innerHTML = `<button class="btn btn--edit"><i class="far fa-edit"></i></button>
  <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>`;
    newContact.appendChild(newName);
    newContact.appendChild(newLastName);
    newContact.appendChild(newEmail);
    newContact.appendChild(newActions);
    document.querySelector('tbody').appendChild(newContact);
}