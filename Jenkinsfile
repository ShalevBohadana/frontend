pipeline {
  agent any

  environment {
    REGISTRY      = "docker.io/shalev223"
    IMAGE_NAME    = "frontend"
    DOCKER_CREDS  = "dockerhub-credentials-id"
    KUBECONFIG_ID = "kubeconfig-creds-id"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build & Test React') {
      agent {
        docker {
          image 'node:18-alpine'
          args  '-u root:root'          // so generated files are owned by jenkins
        }
      }
      steps {
        sh 'npm ci'
        sh 'npm test'
        sh 'npm run build'
      }
    }

    stage('Build & Push Docker Image') {
      agent { label 'docker' }   // ensure this runs on a node with Docker daemon access
      steps {
        script {
          docker.withRegistry('', env.DOCKER_CREDS) {
            // root of workspace has your Dockerfile now
            def img = docker.build("${REGISTRY}/${IMAGE_NAME}:$BUILD_NUMBER")
            img.push()
          }
        }
      }
    }

    stage('Deploy to K8s') {
      steps {
        withCredentials([file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG')]) {
          sh '''
            export KUBECONFIG=$KUBECONFIG
            kubectl set image deployment/frontend \
              frontend=${REGISTRY}/${IMAGE_NAME}:$BUILD_NUMBER
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
