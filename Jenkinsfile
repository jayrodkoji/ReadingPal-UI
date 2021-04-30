serviceName='readingpal-ui'

// image config
group = "com.readingpal"
image = "readingpal-ui"
registry = "registry.readingpal.com:5000"
imageTagName = "${registry}/${group}/${image}"
versionNumber = null
buildNumber = env.BUILD_NUMBER


node {
    stage('Checkout and Setup') {
        git branch: 'master',
            credentialsId: 'e77c32ec-e7bc-4cec-a9af-e1ab098c275c',
            url: 'https://capstone-cs.eng.utah.edu/student-reading-assessment/readingpal-ui.git'
        // reset DOCKER_HOST in case anything else has set it
        sh 'export DOCKER_HOST='
        versionNumber = getLatestVersionTag()
        env.VERSIONTAG="${versionNumber}.${buildNumber}"
        sh 'npm install'
    }

    stage('Ionic cordova build beta') {
        sh 'ionic integrations disable capacitor'
        sh 'ionic cordova build browser --beta'
    }

    stage('Build PROD and PROD Deploy, and Cleanup Docker images') {
        sh 'ionic cordova build browser --release'
    }

    stage('Docker Build Prod') {
        dockerBuild('prod')
    }

    stage('Deploy Production') {
        dockerDeploy("prod")
    }
}

def dockerBuild(env) {
    sh "ionic build"
    sh "docker build -t ${imageTagName}:${versionNumber}.${buildNumber} ."
    cleanIntermediateImages()
}

def dockerDeploy(env) {
    sh("docker stack rm readingpal_ui ")
    sleep 10
    sh("docker stack deploy -c stacks/readingpal-prod.yml readingpal_ui")
    }


def unDeploy(composeFileName) {
    // Remove the old version of the docker container running the old version of the binary.
    try {
       sh "docker stop ${serviceName}"
       sh "docker rm ${serviceName}"
    } catch (e) {
        echo "No Docker containers were able to be removed with the compose file ${composeFileName}. Error: ${e.getMessage()}"
    }
    echo "Successfully undeployed with compose file ${composeFileName} on host"
}


def cleanIntermediateImages() {
    try {
        sh 'docker rmi $(docker images | grep \"^<none>\" | awk \"{print $3}\")'
    } catch (e) {
        echo "Had trouble deleting all unnecessary intermediary docker images. Error message: ${e.getMessage()} \nError: ${e}"
    }
}


def getLatestVersionTag() {
    sh 'git describe --abbrev=0 --tags | tee versionTag'
    def versionTag = readFile('versionTag').trim()
    return versionTag
}
