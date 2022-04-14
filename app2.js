class Contact {
  constructor(firstName, lastName, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

class Util {
  static controlEmptyField(...fields) {
    return fields.every(field => field.length !== 0);
  }

  static isEmailValid(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
  }
}

class Ui {
  constructor() {
    this.firstName = document.getElementById('name');
    this.lastName = document.getElementById('last-name');
    this.email = document.getElementById('email');
    this.saveUpdateBtn = document.querySelector('.save-update');
    this.form = document.getElementById('form-contact');
    this.form.addEventListener('submit', this.saveUpdate.bind(this));
    this.contactList = document.querySelector('.contact-list');
    this.contactList.addEventListener('click', this.updateOrDelete.bind(this));
    this.selectedRow = undefined;
    this.db = new Db();
    this.createContactListFromLocal();
  }

  cleanInputFields() {
    this.firstName.value = '';
    this.lastName.value = '';
    this.email.value = '';
  }

  updateOrDelete(e) {
    if (e.target.classList.contains('btn--delete')) {
      this.selectedRow = e.target.parentElement.parentElement;
      this.deleteContactFromUi();
      this.createInfo('Successfully deleted', true);
    } else if (e.target.classList.contains('btn--edit')) {
      this.selectedRow = e.target.parentElement.parentElement;
      this.saveUpdateBtn.value = 'Update';
      const [oldName, odlLastName, oldEmail, ...rest] = this.selectedRow.cells;
      this.firstName.value = oldName.textContent;
      this.lastName.value = odlLastName.textContent;
      this.email.value = oldEmail.textContent;
    }
  }

  updateContactUi(contact) {
    const result = this.db.updateContact(this.selectedRow.cells[2].textContent, contact);
    if (!result) {
      this.createInfo('The email is already used', false);
      return;
    }
    this.selectedRow.cells[0].textContent = contact.firstName;
    this.selectedRow.cells[1].textContent = contact.lastName;
    this.selectedRow.cells[2].textContent = contact.email;

    this.selectedRow = undefined;
    this.saveUpdateBtn.value = 'Save';
    this.createInfo('Successfully updated', true);
    this.cleanInputFields();
  }

  deleteContactFromUi() {
    this.selectedRow.remove();
    this.db.deleteContact(this.selectedRow.cells[2].textContent);
    this.selectedRow = undefined;
  }

  createContactListFromLocal() {
    this.db.allContacts.forEach(contact => {
      this.addContactToUi(contact);
    });
  }

  addContactToUi(contact) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `<td>${contact.firstName}</td>
    <td>${contact.lastName}</td>
    <td>${contact.email}</td>
    <td>
      <button class="btn btn--edit"><i class="far fa-edit"></i></button>
      <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
    </td>`;
    this.contactList.appendChild(newRow);
  }

  saveUpdate(e) {
    e.preventDefault();
    const newContact = new Contact(this.firstName.value, this.lastName.value, this.email.value);
    const result = Util.controlEmptyField(newContact.firstName, newContact.lastName, newContact.email);
    const isEmailValid = Util.isEmailValid(this.email.value);

    if (result) {
      if (!isEmailValid) {
        this.createInfo('Please enter a valid email', false);
        return;
      }
      if (this.selectedRow) {
        this.updateContactUi(newContact);
      } else {
        const resultAdd = this.db.addContact(newContact);
        if (resultAdd) {
          this.addContactToUi(newContact);
          this.createInfo('Successfully added', true);
          this.cleanInputFields();
        } else {
          this.createInfo('This email is already used', false);
        }
      }
    } else {
      this.createInfo('Please fill empty spaces', false);
    }
  }

  createInfo(msg, status) {
    const info = document.querySelector('.info');
    info.textContent = msg;
    info.classList.add(status ? 'info--success' : 'info--error');

    setTimeout(() => (info.className = 'info'), 1500);
  }
}

class Db {
  constructor() {
    this.allContacts = this.getData();
  }
  isEmailUnique(email) {
    const result = this.allContacts.some(contact => contact.email === email);
    return !result;
  }
  getData() {
    let allContactsLocal;
    if (localStorage.getItem('allContacts') === null) {
      allContactsLocal = [];
    } else {
      allContactsLocal = JSON.parse(localStorage.getItem('allContacts'));
    }
    return allContactsLocal;
  }
  addContact(contact) {
    if (this.isEmailUnique(contact.email)) {
      this.allContacts.push(contact);
      localStorage.setItem('allContacts', JSON.stringify(this.allContacts));
      return true;
    } else {
      return false;
    }
  }
  deleteContact(email) {
    const indexToDelete = this.allContacts.indexOf(this.allContacts.find(contact => contact.email === email));
    this.allContacts.splice(indexToDelete, 1);
    localStorage.setItem('allContacts', JSON.stringify(this.allContacts));
  }
  updateContact(email, updatedContact) {
    if (this.isEmailUnique(updatedContact.email) || updatedContact.email === email) {
      const indexToDelete = this.allContacts.indexOf(this.allContacts.find(contact => contact.email === email));
      this.allContacts[indexToDelete] = updatedContact;
      localStorage.setItem('allContacts', JSON.stringify(this.allContacts));
      return true;
    } else {
      return false;
    }
  }
}

document.addEventListener('DOMContentLoaded', function (e) {
  const ui = new Ui();
});
