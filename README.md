# The Board

A project status board built using Meteor.

Shows project statuses from Jenkins, allows you to manage deployment versions, and shows you statistics from Redmine.


Setting it up for development
-----------------------------

1. Install meteor if you haven't done so already

    curl install.meteor.com | /bin/sh

2. Check out this project from GitHub and change current dir

    git clone git@github.com:fvdb/theboard.git
    cd theboard

3. Copy the default configuration file into place

    cp config.js.dist config.js

3. After you've changed the configuration file, start meteor

    meteor


Running it in production
------------------------

To run it in production, you need to have MongoDB and Node.js installed on your server before you start. Meteor right now only supports production builds that have been created on the same machine as its deployed on, so you also need to have a copy of the source code somewhere on the server.

1. Change into the directory wherever you checked out the project

    cd theboard-src

2. Tell meteor to create a production tarball

    meteor bundle theboard.tgz

3. Unpack the tarball in place where you're going to run it from. This will create a directory called "bundle."

    cd ../ && tar -xvzf theboard-src/theboard.tgz

4. Start Node.js, specifying the port it should run on and where it can find MongoDB

    PORT=3000 MONGO_URL=mongodb://localhost:27017/theboard node bundle/main.js &
