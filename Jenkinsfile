pipeline {
  agent any
  options { skipDefaultCheckout() }
  environment {
    REGISTRY      = "docker.io/shalev223"
    IMAGE_NAME    = "frontend"
    DOCKER_CREDS  = "dockerhub-credentials-id"
    KUBECONFIG_ID = "kubeconfig-creds-id"
  }

  stages {
    stage('Clean workspace') { steps { cleanWs() } }

    stage('Checkout')        { steps { checkout scm } }

    stage('Build & Test') {
      agent { docker { image 'node:18-alpine'; args '-u root:root' } }
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }
stage('Checkout Infra Manifests') {
  steps {
    // pull down the infra repo alongside your frontend code
    dir('infra') {
      git url: 'https://github.com/ShalevBohadana/infra.git', credentialsId: 'your‑git‑creds'
    }
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
        withCredentials([file(credentialsId: KUBECONFIG_ID, variable: 'KUBECONFIG')]) {
          sh '''
            kubectl apply -f k8s/frontend.yaml
            kubectl set image deployment/frontend \
              frontend=${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
            kubectl rollout status deployment/frontend
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
