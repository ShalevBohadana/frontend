pipeline {
  agent any

  options {
    // Prevent the implicit SCM checkout at the top
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
        // now we do a single explicit checkout
        checkout scm
      }
    }

    stage('Build & Test React') {
      // spin up a container so Jenkins master doesn’t need node/npm installed
      agent {
        docker {
          image 'node:18-alpine'
          args  '-u root:root'  // ensure files are owned by Jenkins
        }
      }
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('Build & Push Docker Image') {
      // make sure this runs on a node with Docker installed
      agent { label 'docker' }
      steps {
        script {
          docker.withRegistry('', env.DOCKER_CREDS) {
            // build & tag with build number
            def img = docker.build("${env.REGISTRY}/${env.IMAGE_NAME}:${env.BUILD_NUMBER}")
            img.push()
            // optional: also push “latest”
            img.push('latest')
          }
        }
      }
    }

    stage('Deploy to K8s') {
  steps {
    withCredentials([file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG')]) {
      sh '''
        # now KUBECONFIG is your k3s-full.yaml
        kubectl set image deployment/frontend \
          frontend=${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}

        # wait for it to roll out
        kubectl rollout status deployment/frontend
      '''
    }
  }
}

  }

  post {
    always {
      // if you add real tests later, adjust this pattern
      junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
    }
    success {
      echo "✅ Deployment succeeded!"
    }
    failure {
      echo "❌ Build or deploy failed — check the logs above."
    }
  }
}
