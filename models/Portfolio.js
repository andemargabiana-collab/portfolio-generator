const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EducationSchema = new Schema({
  school: String,
  degree: String,
  startYear: String,
  endYear: String,
  details: String
}, { _id: false });

const ExperienceSchema = new Schema({
  company: String,
  position: String,
  startDate: String,
  endDate: String,
  details: String
}, { _id: false });

const ProjectSchema = new Schema({
  title: String,
  description: String,
  link: String
}, { _id: false });

const SocialSchema = new Schema({
  platform: String,
  url: String
}, { _id: false });

const PortfolioSchema = new Schema({
  fullName: String,
  profileImageUrl: String,
  email: String,
  contactNumber: String,
  address: String,
  aboutMe: String,
  educations: [EducationSchema],
  skills: [String],
  projects: [ProjectSchema],
  experiences: [ExperienceSchema],
  socialLinks: [SocialSchema],
  templateChoice: { type: String, enum: ['simple','modern','creative'], default: 'simple' }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
