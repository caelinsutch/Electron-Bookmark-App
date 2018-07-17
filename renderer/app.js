
// Modules
const {ipcRenderer} = require('electron');
const items = require("./items.js");
const menu = require('./menu.js');

// Navigate with up and down keys
$(document).keydown((e) => {
  switch (e.key) {
      case 'ArrowUp':
        items.changeItem('up')
        break;
      case 'ArrowDown':
        items.changeItem('down')
        break;
  }
})

// Show add-modal
$('.open-add-modal').click(() => {
  $('#add-modal').addClass('is-active');
})
// Close add-modal
$('.close-add-modal').click(() => {
  $('#add-modal').removeClass('is-active');
})

$('#add-button').click(() => {

  // Get URL from input
  let newItemURL = $('#item-input').val()
  if(newItemURL) {

    // Send URL to main process via IPC
    ipcRenderer.send('new-item', newItemURL)

    // Disable modal UI
    $('#item-input').prop('disabled', true)
    $('#add-button').addClass('is-loading')
    $('.close-add-modal').addClass('is-disabled')

  }

})

// Listen for new item from main.js
ipcRenderer.on('new-item-success', (e, item) => {

  // Add items to items array
  items.toreadItems.push(item)

  // Save items
  items.saveItems()

  // Add Item
  items.addItem(item)

  // Close and reset the modal
  $('#add-modal').removeClass('is-active');
  $('#item-input').prop('disabled', false).val('');
  $('#add-button').removeClass('is-loading');
  $('.close-add-modal').removeClass('is-disabled');

  // If first item being added, select it
    if (items.toreadItems.length === 1) {
      $('.read-item:first()').addClass('is-active')
    }
})

// Simulate add click on Enter

$('#item-input').keyup((e) => {
  if(e.key === 'Enter') $('#add-button').click()
});

// Filter Items by Title
$('#search').keyup( (e) => {

  // Get current search input
  let filter = $(e.currentTarget).val();
  $('.read-item').each((i, el) => {
    $(el).text().toLowerCase().includes(filter) ? $(el).show(): $(el).hide();
  })
});

// Add items when app loads
if(items.toreadItems.length) {
  items.toreadItems.forEach(items.addItem);
  $('.read-item:first()').addClass('is-active')
}
