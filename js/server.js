// Initialize server side
if (Meteor.is_server) {
    Meteor.setInterval(Board.updateProjectStatuses, 5000);
    Meteor.setInterval(Board.updateIssues, 60000);
}