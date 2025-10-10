const AttendanceSchema = new mongoose.Schema({
  class: String,
  section: String,
  date: { type: Date, required: true },
  records: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, status: { type: String, enum: ['present','absent','late'] } }],
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
