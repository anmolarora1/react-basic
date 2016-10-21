var ContactForm = React.createClass({
  propTypes: {
      value: React.PropTypes.object.isRequired,
      onChange: React.PropTypes.func.isRequired,
      onSubmit: React.PropTypes.func.isRequired
  },
  render: function() {
    var errors = this.props.value.errors || {};
    var oldContact = this.props.value;
    var onChange = this.props.onChange;
    var onSubmit = this.props.onSubmit;
      
    return (
      React.createElement('form', {onSubmit: function(e){
          e.preventDefault();
          onSubmit();
      }, className: 'ContactForm', noValidate: true},
        React.createElement('input', {
          type:'text',
          placeholder: 'Name (required)',
          className: errors.name && 'ContactForm-error',
          value: this.props.value.name,
          onChange: function(e) {
            onChange(Object.assign({}, oldContact, {name: e.target.value}));
          }
      }),React.createElement('input', {
          type:'text',
          className: errors.email && 'ContactForm-error',
          placeholder: 'Email ',
          value: this.props.value.email,
          onChange: function(e) {
            onChange(Object.assign({}, oldContact, {email: e.target.value}));
          }
      }),React.createElement('textarea', {
          placeholder: 'Description',
          value: this.props.value.description,
          onChange: function(e) {
            onChange(Object.assign({}, oldContact, {description: e.target.value}));
          }
      }),React.createElement('button', {
          type: 'submit'
      }, "Add Contact")
      )
    )
  },
})
var ContactItem = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
  },

  render: function() {
    // I wrap mult-line return statements in parentheses to avoid the
    // inevitable bugs caused by forgetting that JavaScript will throw away
    // the final lines when possible. The parentheses are not strictly
    // necessary.
    return (
      React.createElement('li', {className: 'ContactItem'},
        React.createElement('h2', {className: 'ContactItem-name'}, this.props.name),
        React.createElement('a', {className: 'ContactItem-email', href: 'mailto:'+this.props.email}, this.props.email),
        React.createElement('div', {className: 'ContactItem-description'}, this.props.description)
      )
    )
  },
})
var ContactView = React.createClass({
  propTypes: {
    contacts: React.PropTypes.array.isRequired,
    newContact: React.PropTypes.object.isRequired,
    onContactChange: React.PropTypes.func.isRequired,
    onContactSubmit: React.PropTypes.func.isRequired
  },

  render: function() {
    var contactItemElements = this.props.contacts
      .filter(function(contact) { return contact.email })
      .map(function(contact) { return React.createElement(ContactItem, contact) })
    
    var onContactChange = this.props.onContactChange;
    var onSubmit = this.props.onSubmit;
    var onContactSubmit = this.props.onContactSubmit;
      
    return (
      React.createElement('div', {className: 'ContactView'},
        React.createElement('h1', {className: 'ContactView-title'}, "Contacts"),
        React.createElement('ul', {className: 'ContactView-list'}, contactItemElements),
        React.createElement(ContactForm, {
          value: this.props.newContact,
          onChange: function(contact) {console.log(contact); onContactChange(contact);},
          onSubmit: function(contact) {console.log(contact); onContactSubmit(contact);}
      })
      )
    )
  },
})

      
function updateNewContact(contact) {
  setState({ newContact: contact });
}


function submitNewContact() {
    console.log(state.contacts.length);
    var contact = Object.assign({}, state.newContact, {key: state.contacts.length + 1, errors: {}});
    
    if (!contact.name || contact.name=='') {
      contact.errors.name = ["Please enter your new contact's name"];
    }
    if (!/.+@.+\..+/.test(contact.email)) {
      contact.errors.email = ["Please enter your new contact's email"]
    }
    console.log(contact);
    setState(
      Object.keys(contact.errors).length === 0
      ? {
          newContact: Object.assign({}, CONTACT_TEMPLATE),
          contacts: state.contacts.slice(0).concat(contact),
        }
      : { newContact: contact }
    );
}
      
var state = {};
var CONTACT_TEMPLATE = {name: "", email: "", description: "", errors: null};
// Make the given changes to the state and perform any required housekeeping
function setState(changes) {
  Object.assign(state, changes);
  
  ReactDOM.render(
    React.createElement(ContactView, Object.assign({}, state, {
      onContactChange: updateNewContact,
      onContactSubmit: submitNewContact
    })),
    document.getElementById('react-app')
  );
}

// Set initial data
setState({
  contacts: [
    {key: 1, name: "James K Nelson", email: "james@jamesknelson.com", description: "Front-end Unicorn"},
    {key: 2, name: "Jim", email: "jim@example.com"},
  ],
  newContact: Object.assign({}, CONTACT_TEMPLATE)
});