pipeline {
  agent any

  options {
    skipDefaultCheckout()
  }

  environment {
    REGISTRY        = "docker.io/shalev223"
    IMAGE_NAME      = "frontend"
    DOCKER_CREDS    = "dockerhub-credentials-id"
    KUBECONFIG_ID   = "kubeconfig-creds-id"
  }

  stages {
    stage('Clean workspace') {
      steps {
        cleanWs()
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
          args  '-u root:root'
        }
      }
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('Build & Push Docker Image') {
      agent { label 'docker' }
      steps {
        script {
          docker.withRegistry('', DOCKER_CREDS) {
            def img = docker.build("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
            img.push()
          }
        }
      }
    }

stage('Deploy to K8s') {
  steps {
    sh '''
      export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
      kubectl set image deployment/frontend frontend=${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
    '''
  }
}


  } 

  post {
    always  { junit allowEmptyResults: true, testResults: '**/test-results/*.xml' }
    success { echo "✅ Deployment succeeded!" }
    failure { echo "❌ Build or deploy failed — check the logs above." }
  }
}
