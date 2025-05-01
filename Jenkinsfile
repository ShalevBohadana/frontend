pipeline {
  agent any

  // 1) Tell Jenkins to install Node.js for us
  tools {
    nodejs 'node16'     // Name it exactly in Manage Jenkins → Global Tool Configuration
  }

  environment {
    REGISTRY              = "docker.io/shalev223"
    IMAGE_NAME            = "frontend"
    DOCKER_CREDENTIALS_ID = "dockerhub-credentials-id"
    KUBECONFIG_ID         = "kubeconfig-creds-id"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Test React') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          // if you don't actually have tests yet, you can comment this out:
          // sh 'npm test'
          sh 'npm run build'
        }
      }
    }
stage('Build & Push Docker Image') {
  steps {
    script {
      docker.withRegistry('', 'dockerhub-credentials-id') {
        // Tell Docker to use the root‐level Dockerfile but build with "frontend/" as context
        def img = docker.build(
          "${env.REGISTRY}/${env.IMAGE_NAME}:${env.BUILD_NUMBER}",
          "-f Dockerfile frontend"
        )
        img.push()
      }
    }
  }
}


    stage('Deploy to k3s') {
      steps {
        withCredentials([file(credentialsId: KUBECONFIG_ID, variable: 'KUBECONFIG')]) {
          // ensure kubectl is on your PATH on this agent
          sh '''
            export KUBECONFIG=$KUBECONFIG
            kubectl set image deployment/frontend frontend=${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} --record
            kubectl rollout status deployment/frontend
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ Build & deploy successful: ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
    }
    failure {
      echo "❌ Build or deploy failed — check the logs above."
      // remove or comment-out mail until you configure SMTP
      // mail to: 'you@yourdomain.com',
      //      subject: "Build #${BUILD_NUMBER} Failed",
      //      body: "See ${env.BUILD_URL}"
    }
  }
}
