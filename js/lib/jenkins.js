// Jenkins model
var Jenkins = {
    // The URL without a traling slash
    url: '',

    // Retrieve project status
    updateProjectStatus: function(project) {
        // Abort if there is no slug
        if (project.slug === undefined || project.slug === '') {
            return;
        }

        // Fetch project info
        Meteor.http.get(
            Jenkins.url + '/job/' + project.slug + '/api/json',
            function (error, result) {
                var data = Jenkins.parseResponseData(result);
                if (data === false) {
                    return;
                }

                // Fetch build info
                Meteor.http.get(data.lastBuild.url + 'api/json', function(error, result) {
                    var data = Jenkins.parseResponseData(result);
                    if (data === false) {
                        return;
                    }

                    Projects.update(
                        {_id: project._id},
                        {$set: {status: (data.building) ? 'building' : data.result.toLowerCase()}}
                    );
                });
            }
        );
    },

    // Parse response json data
    parseResponseData: function (result) {
        if (result.statusCode !== 200) {
            return false;
        }
        return eval('(' + result.content + ')');
    }
};