$(document).ready( () => {

    // Capture the click event
    $("button").click( (event) => {

        // The sort key is in the button id
        let sortKey = event.target.id

        // Get all the individual items
        let items = $('ul a').get();

        // If sortKey is english, hide items where english is not listed
        // as an official language
        if (sortKey === 'english') {
            $('*[data-english="false"]').toggle();

        // If sort key is anything else, sort the items accordingly
        } else {

            // This sorts the aforementioned items according to the sortKey
            items.sort(function(a,b){

                // Get the two comparable items' keys
                let keyA = $(a).children().first().data(sortKey);
                let keyB = $(b).children().first().data(sortKey);

                // Compare the two values
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
        }

        // Get the whole list of countries
        let ul = $('div ul');

        // This removes the country item from the old spot and moves it
        $.each(items, function(i, li){
          ul.append(li);
        });
    });
});
