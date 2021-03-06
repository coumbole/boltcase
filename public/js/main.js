$(document).ready( () => {

    // Capture the click event
    $('button').click( (event) => {

        const sortKey = event.target.id

        // Get all the individual items
        let items = $('ul a').get();

        /* If sortKey is english, hide items where english
         * is not listed as an official language */
        if (sortKey === 'english') {
            $('*[data-english="false"]').toggle();

        // If sortKey is anything else, sort the items accordingly
        } else {

            // Sort the aforementioned items according to the sortKey
            items.sort( (first, second) => {

                // Get the two comparable items' keys
                const keyA = $(first)
                    .children()
                    .first()
                    .data(sortKey) || 0;

                const keyB = $(second)
                    .children()
                    .first()
                    .data(sortKey) || 0;

                // Compare the two values
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
        }

        // Get the whole list of countries
        const ul = $('div ul');

        // This removes the country item from the old spot and moves it
        $.each(items, (i, li) => {
            ul.append(li);
        });
    });


    /* When the dropdown menu is clicked, send an AJAX call to the
     * server to calculate the route to the chosen country */
    $('select').on('change', (event) => {

        const currentUrl = window
            .location
            .pathname;

        const currentCountry = currentUrl
            .split('/')
            .pop()
            .toUpperCase();

        const targetCountry = event.target.value;

        $.ajax({
            method: 'POST',
            url: currentUrl,
            data: {
                source : currentCountry,
                target : targetCountry
            }

        // If all goes well, display the result
        }).done( (msg) => {
            $('.route').html(msg);

        // In case of error, state that the route wasn't found
        }).fail( (msg) => {
            $('.route').html(msg);
        });
    });
});
