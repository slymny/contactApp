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



function save(e) {
  e.preventDefault();

  const contact = {
    name: nameElement.value,
    lastName: lastNameElement.value,
    email: emailElement.value,
  };
  const result = dataControl(contact);
  if (result.status) {
    addContact(contact);
  } else {
      createInfo(result.message, result.status);
  }
  console.log(allContacts);
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
  const {name, lastName, email} = contact;
  newContact.innerHTML = `<td>${name}</td>
    <td>${lastName}</td>
    <td>${email}</td>
    <td>
      <button class="btn btn--edit"><i class="far fa-edit"></i></button>
      <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
    </td>`;
  contactList.appendChild(newContact);
  allContacts.push(newContact);
  createInfo("Contact added successfully", true);
}
 
function contactActions(e) {
    if(e.target.classList.contains('btn--delete')) {
        const deletingContact = e.target.parentElement.parentElement;
        removeContact(deletingContact);
    } else if (e.target.classList.contains('btn--edit')) {
        console.log('editing');
    }
}

function removeContact(deletingElement) {
    deletingElement.remove();
    allContacts.splice(allContacts.indexOf(deletingElement), 1);
}