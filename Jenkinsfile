pipeline {
  agent any

  environment {
    REGISTRY = "docker.io/shalev223"
    IMAGE_NAME = "frontend"
    KUBECONFIG_CREDENTIALS = 'kubeconfig-creds-id'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build & Test React') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm test'
          sh 'npm run build'
        }
      }
    }

stage('Build & Push Docker Image') {
  steps {
    script {
      docker.withRegistry('', 'dockerhub-credentials-id') {
        // omit the “-f … frontend” context flag
        def img = docker.build("${REGISTRY}/${IMAGE_NAME}:$BUILD_NUMBER")
        img.push()
      }
    }
  }
}


    stage('Deploy to K8s') {
      steps {
        withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG')]) {
          sh '''
            export KUBECONFIG=$KUBECONFIG
            kubectl set image deployment/frontend frontend=${REGISTRY}/${IMAGE_NAME}:$BUILD_NUMBER
          '''
        }
      }
    }
  }

  post {
    always { junit allowEmptyResults: true, testResults: '**/frontend/test-results/*.xml' }
    success { echo 'Deployment succeeded!' }
    failure { mail to: 'bohadanashalev@gmail.com', subject: "Build #${BUILD_NUMBER} Failed", body: "${env.JOB_NAME} #${BUILD_NUMBER} failed." }
  }
}
