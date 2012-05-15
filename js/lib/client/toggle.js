// Toggle handler
var Toggle = {
    // Toggle the setting
    rotate: function() {
        // Get current setting
        var toggled = Session.get('toggled');

        // Change the setting depending on current setting
        switch (toggled) {
            case 'support': toggled = 'builds'; break;
            case 'builds': toggled = ''; break;
            default: toggled = 'support'; break;
        }
        Session.set('toggled', toggled);

        // Show/hide parts
        Toggle.adjustDisplay();
    },

    // Adjust the display based on the current setting
    adjustDisplay: function() {
        // Get current setting
        var toggled = Session.get('toggled');

        // Adjust the display based on current setting
        switch (toggled) {
            case 'support':
                $('#redmine').slideDown(1000, function() {
                    $('#builds').slideUp(1000);
                });
                break;
            case 'builds':
                $('#redmine').slideUp(1000, function() {
                    $('#builds').slideDown(1000);
                });
                break;
            default:
                $('#redmine').slideDown();
                $('#builds').slideDown();
                break;
        }
    }
};