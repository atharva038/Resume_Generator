# 🧪 Tests & Scripts

This folder contains all test scripts and setup utilities for the ATS Resume Generator.

## 📋 Test Scripts

### Security & Validation Tests
- **`test-security-headers.sh`** - Tests security headers implementation
- **`test-rate-limiting.sh`** - Tests rate limiting middleware
- **`test-rate-limiting-full.sh`** - Comprehensive rate limiting tests
- **`test-validation.sh`** - Tests input validation
- **`test-validation-quick.sh`** - Quick validation tests

### Setup & Deployment
- **`setup.sh`** - Initial project setup script
- **`check-deployment.sh`** - Validates deployment readiness

## 🚀 Usage

### Run Security Tests
```bash
bash tests/test-security-headers.sh
```

### Run Rate Limiting Tests
```bash
bash tests/test-rate-limiting.sh
```

### Run Validation Tests
```bash
bash tests/test-validation.sh
```

### Check Deployment Readiness
```bash
bash tests/check-deployment.sh
```

### Setup Project
```bash
bash tests/setup.sh
```

## 📝 Notes

- Make sure scripts are executable: `chmod +x tests/*.sh`
- Run from project root directory
- Some tests require the server to be running
- Check individual script comments for specific requirements

## 🔗 Related Documentation

- Main README: `../README.md`
- Testing Guide: `../docs/TESTING_GUIDE.md`
- Security Documentation: `../docs/SECURITY_*.md`
