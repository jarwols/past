(function(window, document, undefined) {
	var EntryView = {};

	/* Prepares entryTemplate to be rendered on button click. */
	var $entryTemplate = $(document.body).find("#entry-template")
	var templates = {
		renderEntryForm: Handlebars.compile($entryTemplate[0].innerHTML)
	};

	/* Finds error div within page */ 
	var $errorDiv = $(document.body).find('.error'); 

	/* Attaches listeners to all HTML elements via task delegation. Each 
	 * button is tasked appropriately to switch to the necessary model.
	 * The function takes in the $entry div, the array of entries, and 
	 * the currently active data. */
	function buttonListeners($entry, entries, activeEntryData) {
		var $actionsPane = $entry.find('.actions'); 
		$actionsPane[0].addEventListener('click', function(event) { 
			var target = event.target; 
			while(target && target.nodeName !== "BUTTON") {
				target = target.parentNode; 
			}
			if(target) {
				// direct to creatingView for green button 
				if(target.className == 'green new') {
					CreatingEntryView.render($entry); 
				// direct to editingView for entry on teal button 
				} else if (target.className == 'teal edit') { 
					EditingEntryView.render($entry, activeEntryData); 
				// remove entry on red button, enter creatingView if no entries remain  
				} else if (target.className == 'red delete') { 
					console.log(activeEntryData); 
					EntryModel.remove(activeEntryData.id, function (error) {
						if(error) {
							var errorDiv = document.getElementsByClassName('error'); 
							errorDiv[0].innerHTML = "Error: " + error; 
						} else {
							if(entries.length !== 0) {
								EntryView.render($entry, entries[0]); 
							} else {
								CreatingEntryView.render($entry); 
							}
						}
					});  
				} 
			}
		}); 
	}

	/* Renders an entry into the given $entry element. Requires the object
	* representing the active entry (activeEntryData). If this object is null,
	* picks the first existing entry. If no entry exists, this view will display
	* the CreatingEntryView. */
	EntryView.render = function($entry, activeEntryData) {
		EntryModel.loadAll(function(error, entries) {
			if (error) {
				$errorDiv[0].innerHTML = "Error: " + error;
			} else {
				// create an object by parsing all entries by id 
				var activeEntryObject = entries.filter(function (element) {
					return element.id == activeEntryData; 
				}); 
				// if no entry exists, set the object to be the first element
				if(activeEntryObject.length == 0) activeEntryObject = entries;
				$entry[0].innerHTML = templates.renderEntryForm({
					viewing: true,
					entries: entries,
					activeEntryData: activeEntryObject[0]
				});
				// attach listeners to newly-rendered page 
				buttonListeners($entry, entries, activeEntryObject[0]);
				// attack listener to dropdown menu to render entry 
				var $select = $entry.find('select');
				$select[0].addEventListener('change', function(event) {
					var input = $select.val();
					EntryView.render($entry, input); 
				});
				// pass map object into googleMapView model
				var $map = $entry.find('.map'); 
				GoogleMapView.render($map, activeEntryObject[0]);
			}
		});
	}

  	window.EntryView = EntryView;
})(this, this.document);
