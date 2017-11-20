$(document).ready( () => {

    // Capture the click event
    $('button').click( (event) => {

        let sortKey = event.target.id

        // Get all the individual items
        let items = $('ul a').get();

        /* If sortKey is english, hide items where english
         * is not listed as an official language */
        if (sortKey === 'english') {
            $('*[data-english="false"]').toggle();

        // If sortKey is anything else, sort the items accordingly
        } else {

            // Sort the aforementioned items according to the sortKey
            items.sort(function(a,b){

                // Get the two comparable items' keys
                const keyA = $(a).children().first().data(sortKey);
                const keyB = $(b).children().first().data(sortKey);

                // Compare the two values
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
        }

        // Get the whole list of countries
        const ul = $('div ul');

        // This removes the country item from the old spot and moves it
        $.each(items, function(i, li){
            ul.append(li);
        });
    });


    // When the dropdown menu is clicked, send an AJAX call to the
    // server to calculate the route to the chosen country
    $('select').on('change', (event) => {

        const currentUrl = window.location.pathname;
        const currentCountry = currentUrl.split("/").pop().toUpperCase();
        const targetCountry = event.target.value;

        $.ajax({
            method: "POST",
            url: currentUrl,
            data: {
                source : currentCountry,
                target : targetCountry
            }

        // If all goes well, display the result
        }).done( (msg) => {
            console.log(msg);
            $('.route').html(msg);

        // In case of error, state that the route couldn't be found
        }).fail( (msg) => {
            $('.route').html(msg);
        });
    });
});
