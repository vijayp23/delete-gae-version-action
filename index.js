const core = require('@actions/core');
const execSync = require('child_process').execSync;
const fs = require('fs');

async function run() {
  try {
    
    const keyFile = `/tmp/${(new Date()).getTime()}.json`; 
    const projectId = core.getInput('project-id');
    const serviceName = core.getInput('service-name');
    const retainVersions = core.getInput('retain-versions');
    var isDebug = core.getInput('debug');

    core.startGroup('Copy service account');
    console.log('Copy service account');
    const keyFileBase64 = core.getInput('service-account')
    const keyFileContents = Buffer.from(keyFileBase64, 'base64').toString()
    fs.writeFileSync(keyFile, keyFileContents);
    core.endGroup();

    core.startGroup('Activate service account');
    console.log('Activate service account');
    execSync(`gcloud auth activate-service-account --key-file ${keyFile}`, { stdio: 'inherit' });
    core.endGroup();

    core.startGroup('List of all available versions');
    execSync(`gcloud app services list --format="table[box,title='Version List'](versions.id:label=VERSION,versions.traffic_split,versions.last_deployed_time.datetime:sort=1:label=DEPLOYED_TIME)" --flatten=versions --project=${projectId} --filter="id:${serviceName}"`, { stdio: 'inherit' });
    core.endGroup();

    core.startGroup('List versions to be deleted');
    var versionList = JSON.parse(execSync(`gcloud app versions list --project=${projectId} --service=${serviceName} --filter=TRAFFIC_SPLIT=0 --sort-by=~"last_deployed_time" --format="json"`).toString());
    var versions = "";
    for(var index in versionList){
        if ( index > retainVersions -1){
            console.log("Version: " + versionList[index]["id"] + " DeployedOn: " + versionList[index]["last_deployed_time"]["datetime"] );
            versions +=versionList[index]["id"]+" ";
        }
    }

    if (versions == ""){
      isDebug = true;
      console.log("There are no versions available to delete..");
    }

    core.endGroup();

    if (!isDebug) {
      core.startGroup('Delete versions');
      execSync(`gcloud app versions delete --project=${projectId} --service=${serviceName} ${versions} --quiet`, {stdio: 'inherit'});
      core.endGroup();
    }

    core.startGroup('Remove service account');
    fs.unlinkSync(keyFile);
    core.endGroup();
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();