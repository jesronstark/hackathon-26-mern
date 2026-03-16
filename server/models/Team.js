const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, trim: true },
    leaderName: { type: String, required: true, trim: true },
    member1: { type: String, required: true, trim: true },
    member2: { type: String, required: true, trim: true },
    member3: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    college: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    pptFileUrl: { type: String, required: true },
    tableNumber: { type: Number, unique: true },
  },
  { timestamps: true }
);

// Auto-assign tableNumber before saving
teamSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Team').countDocuments();
    if (count >= 25) {
      return next(new Error('Registration closed. Maximum 25 teams reached.'));
    }
    this.tableNumber = count + 1;
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);
