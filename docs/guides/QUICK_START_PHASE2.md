# 🚀 Quick Reference - Phase 2 Backend

## Installation (5 minutes)

```bash
# 1. Install packages
cd server
npm install

# 2. Add to .env
OPENAI_API_KEY=sk-your-key-here
RAZORPAY_KEY_ID=rzp_test_your-key
RAZORPAY_KEY_SECRET=your-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# 3. Run migration
npm run migrate:users

# 4. Test models
npm run test:models

# 5. Start server
npm run dev
```

---

## API Endpoints

### Public
```
GET /api/subscription/pricing
```

### Protected (need JWT token)
```
GET  /api/subscription/status      # Current subscription
GET  /api/subscription/usage       # Usage stats
POST /api/subscription/create-order # Create payment
POST /api/subscription/verify-payment # Activate subscription
POST /api/subscription/cancel      # Cancel subscription
```

---

## Pricing Tiers

| Tier | Price | AI | Resumes |
|------|-------|-----|---------|
| FREE | ₹0 | Gemini | 1/mo |
| ONE-TIME | ₹49 | GPT-4o | 1 |
| PRO | ₹149/mo | Hybrid | ∞ |
| PREMIUM | ₹249/mo | GPT-4o | ∞ |
| STUDENT | ₹99/3mo | Hybrid | ∞ |
| LIFETIME | ₹499 | GPT-4o | ∞ |

---

## AI Routing

**FREE** → Gemini (₹0.02/resume)  
**ONE-TIME** → GPT-4o (₹6/resume)  
**PRO** → 70% Gemini + 30% GPT-4o (₹2/resume)  
**PREMIUM** → GPT-4o (₹6/resume)  
**LIFETIME** → GPT-4o (₹6/resume)  

---

## Testing

```bash
# Get pricing
curl http://localhost:5000/api/subscription/pricing

# Login first
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get status (replace TOKEN)
curl http://localhost:5000/api/subscription/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Test Cards (Razorpay)

**Success:** `4111 1111 1111 1111`  
**Fail:** `4000 0000 0000 0002`  

---

## Files Created

### Services:
- `services/openai.service.js` - GPT-4o integration
- `services/aiRouter.service.js` - AI routing logic
- `services/payment.service.js` - Razorpay integration

### Controllers & Routes:
- `controllers/subscription.controller.js` - API logic
- `routes/subscription.routes.js` - API endpoints

### Middleware:
- `middleware/subscription.middleware.js` - Subscription checks

---

## NPM Scripts

```bash
npm run dev           # Start dev server
npm run migrate:users # Migrate existing users
npm run test:models   # Test database models
```

---

## Environment Variables

```env
# Required for Phase 2
OPENAI_API_KEY=sk-...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=whsec_...
```

---

## Cost Analysis

**Gemini:** ₹0.02/resume (FREE tier)  
**GPT-4o:** ₹6/resume (PREMIUM quality)  
**Hybrid:** ₹2/resume (60% savings)  

**Margins:**
- ONE-TIME: 88% (₹43 profit on ₹49)
- PRO: 87%+ (₹147+ profit on ₹149)
- PREMIUM: 82%+ (₹243+ profit on ₹249)

---

## Next Steps

1. ✅ Install packages (`npm install`)
2. ✅ Configure `.env` file
3. ✅ Run migration script
4. ✅ Test endpoints
5. ⏳ Build frontend (Phase 3)

---

## Support

- 📖 Full Guide: `INSTALLATION_GUIDE_PHASE2.md`
- 📊 Complete Docs: `PHASE_2_COMPLETE.md`
- 🎯 Summary: `PHASE_2_SUMMARY.md`

---

## Status: ✅ READY FOR PHASE 3!
