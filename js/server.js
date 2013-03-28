// Initialize server side
if (Meteor.is_server) {
    Meteor.setInterval(Board.updateProjectStatuses, 5000);
    Meteor.setInterval(Redmine.updateIssues, 60000);

    Meteor.startup(Redmine.loadProjectVersions);
    Meteor.setInterval(Redmine.loadProjectVersions, 10800000);
}
