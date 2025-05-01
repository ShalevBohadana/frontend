pipeline {
  agent any

  // 1) don’t do the implicit checkout before stages
  options {
    skipDefaultCheckout()
  }

  environment {
    // put your real IDs here
    REGISTRY        = "docker.io/shalev223"
    IMAGE_NAME      = "frontend"
    DOCKER_CREDS    = "dockerhub-credentials-id"
    KUBECONFIG_ID   = "kubeconfig-creds-id"
  }

  stages {
    stage('Clean workspace') {
      steps {
        cleanWs()    // from Pipeline Utility Steps
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Test React') {
      agent {
        docker {
          image 'node:18-alpine'
          args  '-u root:root'    // run as root inside the container
        }
      }
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('Build & Push Docker Image') {
      // this needs to run on a node that has Docker daemon access
      agent { label 'docker' }
      steps {
        script {
          docker.withRegistry('', DOCKER_CREDS) {
            // assumes your Dockerfile lives in the workspace root
            def img = docker.build("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
            img.push()
          }
        }
      }
    }

    stage('Deploy to K8s') {
      steps {
        withCredentials([file(credentialsId: KUBECONFIG_ID, variable: 'KUBECONFIG')]) {
          sh '''
            export KUBECONFIG=$KUBECONFIG
            kubectl set image deployment/frontend \
              frontend=${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
          '''
        }
      }
    }
  }

  post {
    always  { junit allowEmptyResults: true, testResults: '**/test-results/*.xml' }
    success { echo "✅ Deployment succeeded!" }
    failure { echo "❌ Build or deploy failed — check the logs above." }
  }
}
