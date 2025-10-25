# CI/CD Pipeline Guide

This document describes the Continuous Integration and Continuous Deployment (CI/CD) setup for the Storybox application.

## Overview

The CI/CD pipeline is built with **GitHub Actions** and automates:
- Code quality checks
- Testing (unit, integration, E2E)
- Building production bundles
- Deployment to production
- Error tracking with Sentry

## Pipeline Workflow

### Triggers

The pipeline runs automatically on:
- **Push** to `main` or `develop` branches
- **Pull Requests** to `main` or `develop` branches

### Stages

```
Lint → Test → E2E → Build → Deploy → Notify
```

#### 1. Lint Stage
- Runs ESLint on all JavaScript/TypeScript files
- Checks code quality and style
- Continues even if linting fails (non-blocking)

#### 2. Test Stage
- Runs Jest unit and integration tests
- Generates code coverage reports
- Uploads coverage to Codecov
- Fails pipeline if tests fail

#### 3. E2E Stage
- Runs Playwright end-to-end tests
- Tests critical user flows
- Captures screenshots on failures
- Uploads test reports as artifacts

#### 4. Build Stage
- Builds Next.js production bundle
- Optimizes assets and images
- Generates static pages
- Uploads build artifacts
- **Only runs if lint and test pass**

#### 5. Deploy Stage
- Deploys to production environment
- **Only runs on `main` branch**
- **Only runs if build and E2E pass**
- Creates Sentry release for error tracking
- Tags deployment with Git SHA

#### 6. Notify Stage
- Sends deployment notifications
- Reports success/failure status
- **Always runs** (even if deployment fails)

## Configuration

### GitHub Secrets

Configure these secrets in your GitHub repository:
**Settings → Secrets and variables → Actions**

#### Required Secrets

| Secret | Description | Example |
|--------|-------------|---------|
| `SENTRY_DSN` | Sentry project DSN | `https://xxx@xxx.ingest.sentry.io/xxx` |
| `SENTRY_AUTH_TOKEN` | Sentry API authentication token | `sntrys_xxx...` |
| `NEXT_PUBLIC_BASE_URL` | Production base URL | `https://your-domain.com` |

#### Optional Secrets

| Secret | Description |
|--------|-------------|
| `DEPLOYMENT_TOKEN` | Token for deployment service |
| `SLACK_WEBHOOK` | Slack webhook for notifications |
| `AWS_ACCESS_KEY_ID` | AWS credentials (if using AWS) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret (if using AWS) |

### Environment Variables

Set these in `.env` file or GitHub Secrets:

```env
# Sentry
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=storybox
SENTRY_PROJECT=nextjs

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NODE_ENV=production
```

## Deployment Strategies

### Option 1: Vercel Deployment

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

### Option 2: Docker Deployment

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: your-registry/storybox:latest
    
- name: Deploy to server
  run: |
    ssh user@server 'docker pull your-registry/storybox:latest'
    ssh user@server 'docker-compose up -d'
```

### Option 3: SSH Deployment

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.HOST }}
    username: ${{ secrets.USERNAME }}
    key: ${{ secrets.SSH_KEY }}
    script: |
      cd /var/www/storybox
      git pull origin main
      yarn install
      yarn build
      pm2 restart storybox
```

## Monitoring

### Build Status Badge

Add to README.md:
```markdown
![CI/CD](https://github.com/your-username/storybox/workflows/CI%2FCD%20Pipeline/badge.svg)
```

### Sentry Integration

After deployment, the pipeline automatically:
- Creates a new Sentry release
- Associates errors with specific deployments
- Tracks deployment frequency
- Monitors release health

View in Sentry: **Releases → [Your Release]**

### Artifacts

Pipeline generates the following artifacts:

| Artifact | Retention | Description |
|----------|-----------|-------------|
| `build` | 7 days | Production build files |
| `playwright-report` | 30 days | E2E test results |
| `coverage` | 7 days | Test coverage reports |

Access: **Actions → [Workflow Run] → Artifacts**

## Troubleshooting

### Common Issues

#### 1. Tests Failing in CI

**Problem**: Tests pass locally but fail in CI

**Solutions**:
- Check Node.js version matches (v18)
- Verify all environment variables are set
- Check for timing issues (increase timeouts)
- Review test logs in Actions tab

#### 2. Build Failing

**Problem**: Build succeeds locally but fails in CI

**Solutions**:
- Clear build cache in GitHub Actions
- Check for missing dependencies
- Verify environment variables
- Review build logs

#### 3. Deployment Failing

**Problem**: Deployment step fails

**Solutions**:
- Verify deployment credentials/secrets
- Check server/service status
- Review deployment logs
- Test deployment manually

#### 4. Sentry Release Not Created

**Problem**: Deployment succeeds but no Sentry release

**Solutions**:
- Verify `SENTRY_AUTH_TOKEN` is correct
- Check Sentry project and org names
- Review Sentry API permissions
- Check Sentry action logs

### Debug Mode

Enable debug logging:
```yaml
- name: Debug Info
  run: |
    echo "Node version: $(node --version)"
    echo "Yarn version: $(yarn --version)"
    echo "Git SHA: ${{ github.sha }}"
    env
```

## Best Practices

1. **Branch Protection**
   - Require status checks to pass before merging
   - Require pull request reviews
   - Require branches to be up to date

2. **Environment Separation**
   - Use `develop` for staging
   - Use `main` for production
   - Test in staging before production

3. **Rollback Strategy**
   - Tag releases with version numbers
   - Keep previous builds available
   - Document rollback procedure

4. **Security**
   - Never commit secrets to repository
   - Use GitHub Secrets for sensitive data
   - Rotate credentials regularly
   - Review access permissions

5. **Monitoring**
   - Set up Sentry alerts
   - Monitor deployment frequency
   - Track error rates
   - Review performance metrics

## Maintenance

### Regular Tasks

- **Weekly**: Review failed builds
- **Monthly**: Update dependencies
- **Quarterly**: Review pipeline efficiency
- **Annually**: Audit security practices

### Performance Optimization

- Cache dependencies (already configured)
- Run tests in parallel
- Skip unnecessary steps
- Optimize Docker layers
- Use matrix builds for multi-environment testing

## Advanced Configuration

### Matrix Builds

Test multiple Node.js versions:
```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
```

### Conditional Deployment

Deploy only with specific commit message:
```yaml
if: contains(github.event.head_commit.message, '[deploy]')
```

### Scheduled Runs

Run tests nightly:
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
```

## Support

For issues with CI/CD pipeline:
1. Check GitHub Actions documentation
2. Review workflow logs
3. Contact DevOps team
4. File an issue in repository
