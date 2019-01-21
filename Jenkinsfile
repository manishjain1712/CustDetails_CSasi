pipeline {
    agent any
    stages {

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
                sh 'npm run build'
                sh 'npm run setup'
                sh 'npm start'
                }

            }
        }
    }
}
