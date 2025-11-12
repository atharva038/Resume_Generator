# ⚡ Quick Update Cheat Sheet

## 📍 File Locations
```
client/src/config/
  ├── systemConfig.js     ← Tech stack, stats, features
  ├── revenueConfig.js    ← Pricing, revenue projections
  ├── roadmapConfig.js    ← Future features roadmap
  └── growthConfig.js     ← Growth metrics, marketing
```

---

## 🔥 Most Common Updates

### Update User Count
```javascript
// systemConfig.js → Line ~85
stats: {
  totalUsers: 10000,  ← CHANGE THIS NUMBER
  totalResumes: 25000,
  aiRequests: 50000,
  activeToday: 850
}
```

### Change Pro Tier Price
```javascript
// revenueConfig.js → Line ~18
{
  name: "Pro Tier",
  price: "$9.99/month",  ← CHANGE THIS
  ...
}
```

### Add New Technology
```javascript
// systemConfig.js → Line ~10
frontend: [
  { name: "React 18", color: "blue" },
  { name: "Your New Tech", color: "blue" },  ← ADD HERE
  ...
]
```

### Mark Feature as Complete
```javascript
// 1. Remove from roadmapConfig.js
// 2. Add to systemConfig.js → features array:
features: [
  { icon: "🚀", title: "New Feature", description: "..." },  ← ADD
  ...
]
```

### Update Revenue Projection
```javascript
// revenueConfig.js → Line ~85
yearOneProjection: {
  freeUsers: 10000,        ← Update these
  proUsers: 500,           ← Update these
  totalRevenue: "$150K+"   ← Update this
}
```

### Reached Growth Milestone
```javascript
// growthConfig.js → Line ~35
growthMetrics: [
  {
    year: "Year 1",
    users: "10K",     ← Update to actual number
    focus: "Product-market fit ✅",
    ...
  }
]
```

---

## 💡 Pro Tips

1. **Test After Updates** - Refresh `/system-flowchart` to see changes
2. **Keep Backups** - Git commit before major config changes
3. **Be Consistent** - Use same format/style as existing entries
4. **Update Regularly** - Set monthly reminder to update stats
5. **Document Why** - Add comments for major changes

---

## 🎯 Priority Updates (Do These First!)

| Priority | What | File | Why |
|----------|------|------|-----|
| 🔴 High | User count stats | `systemConfig.js` | Shows growth |
| 🔴 High | Revenue projections | `revenueConfig.js` | Investor-ready |
| 🟡 Medium | New features | `systemConfig.js` | Shows progress |
| 🟡 Medium | Completed roadmap | `roadmapConfig.js` | Track milestones |
| 🟢 Low | Tech stack | `systemConfig.js` | Keep current |

---

## 🚀 Example: Complete Feature Launch Update

**Scenario**: You just launched "Cover Letter Generator"

```javascript
// STEP 1: roadmapConfig.js - Remove from Phase 1
phase1: {
  features: [
    // DELETE THIS:
    // {
    //   name: "Cover Letter Generator",
    //   ...
    // }
  ]
}

// STEP 2: systemConfig.js - Add to features
features: [
  { 
    icon: "📝", 
    title: "Cover Letter Generator", 
    description: "AI-powered custom cover letters" 
  },
  ...existing features
]

// STEP 3: revenueConfig.js - Update if it affects pricing
pricingTiers: [
  {
    name: "Pro Tier",
    features: [
      { included: true, text: "Cover Letter Generator" },  ← Add
      ...
    ]
  }
]
```

**Done!** Flowchart now shows it as a live feature! 🎉

---

## ⚠️ Common Mistakes to Avoid

❌ **Wrong**: Editing SystemFlowchart.jsx component  
✅ **Right**: Edit config files only

❌ **Wrong**: Forgetting to update related configs  
✅ **Right**: Update all relevant configs (see example above)

❌ **Wrong**: Using different naming conventions  
✅ **Right**: Copy-paste existing format and modify

❌ **Wrong**: Leaving outdated data  
✅ **Right**: Regular monthly updates

---

## 📞 Quick Help

**Can't find something?** Use search:
- `Ctrl+Shift+F` in VS Code
- Search for the text you want to change
- It will show you which config file

**Broke something?** 
- `git checkout -- client/src/config/*.js`
- Restores all config files to last commit

**Want to add entirely new section?**
- Copy existing section format
- Paste and modify
- Component auto-renders it!

---

**💪 You've got this! Update configs with confidence!**
