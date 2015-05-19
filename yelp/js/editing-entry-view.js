(function(window, document, undefined) {
  var EditingEntryView = {};

	/* Prepares entryTemplate to be rendered on button click. */
	var $entryTemplate = $(document.body).find("#entry-template")
	var templates = {
		renderEntryForm: Handlebars.compile($entryTemplate[0].innerHTML)
	};

	/* Finds error div within page */ 
	var $errorDiv = $(document.body).find('.error'); 

	/* Searches div $entry for all necessary HTML elements in the document. */
	function findElements($entry) {
		return {
			update: $entry.find("button")[0],
			name: $entry.find("[name=name]"), 
			address: $entry.find("[name=address]"),
			description: $entry.find("[name=description]")	
		};
	}

  /* Renders a view to allow the user to edit an entry. Requires the $entry
   * element and an object representing the active entry. */
  EditingEntryView.render = function($entry, activeEntryData) {
    $entry[0].innerHTML = templates.renderEntryForm({
		editing: true,
		entries: null,
		activeEntryData: activeEntryData
	});
	// find all elements 
    var elements = findElements($entry);
	elements.update.addEventListener("click", function(event) { 
		var objectData = {
				id: activeEntryData.id,
				address: elements.address.val(), 
				name: elements.name.val(), 
				description: elements.description.val()
		};
		// if event successfully updates, render page with entry 
		EntryModel.update(objectData, function(error, entry) {
			if(error) {
				$errorDiv[0].innerHTML = "Error: " + error;
			} else { 
				EntryView.render($entry, objectData); 
			}
		});
	});
  };

  window.EditingEntryView = EditingEntryView;
})(this, this.document);
