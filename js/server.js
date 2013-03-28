// Initialize server side
if (Meteor.is_server) {
    Meteor.setInterval(Board.updateProjectStatuses, 5000);
    Meteor.setInterval(Redmine.updateIssues, 60000);

//    Meteor.publish("current-version", function (session) {
//        console.log(session);
//        Redmine.setCurrentVersion(session.version);
//    });
//
//    Meteor.publish("version-count", function() {
//        return IssuesCountVersion.findOne({});
//    });
}
