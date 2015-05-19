(function(window, document, undefined) {
	var CreatingEntryView = {};

	/* Prepares entryTemplate to be rendered on button click. */
	var $entryTemplate = $(document.body).find("#entry-template")
	var templates = {
		renderEntryForm: Handlebars.compile($entryTemplate[0].innerHTML)
	};

	/* Searches div $entry for all necessary HTML elements in the document. */
	function findElements($entry) {
		return {
			add: $entry.find("button")[0],
			name: $entry.find("[name=name]"), 
			address: $entry.find("[name=address]"),
			description: $entry.find("[name=description]")	
		};
	}

  /* Renders a view to allow the user to create an entry. Requires the $entry
   * element. */
  CreatingEntryView.render = function($entry) {
	$entry[0].innerHTML = templates.renderEntryForm({
		creating: true,
		entries: null,
		activeEntryData: null
	});
	var elements = findElements($entry);  
	// attach listener to add button HTML element
	elements.add.addEventListener("click", function(event) { 
		var objectData = {
				address: elements.address.val(), 
				name: elements.name.val(), 
				description: elements.description.val()
		};
		// If object was successfully added, entryView is rendered
		EntryModel.add(objectData, function(error, entry) {
			if(error) {
				var $errorDiv = $(document.body).find('.error'); 
				$errorDiv[0].innerHTML = "Error: " + error;
			} else { 
				EntryView.render($entry, objectData); 
			}
		});
	});
  };

  window.CreatingEntryView = CreatingEntryView;
})(this, this.document);
