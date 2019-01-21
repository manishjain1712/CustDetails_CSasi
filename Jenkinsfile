pipeline {
    agent any
    stages {
        stage('checkout') {
            steps {
                checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/manishjain1712/CustDetails_CSasi.git']]]
            }
        }
        stage('Build') {
            steps {
                nodejs('node11.7')  {
                sh 'npm install'
                }
            }
        }
        stage('test')
        {
          steps
          {
            echo 'test succuss '
          }
        }
        stage('Deliver') {
            steps {
                nodejs('node11.7')  {
              
                sh 'npm run setup'
                sh 'npm start'
                }

            }
        }
    }
}
