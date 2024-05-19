import mongoose from "mongoose";

const { Schema } = mongoose;
const happyThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
    validate: {
      validator: function(v) {
        return v === this.default;
      },
      message: props => `${props.value} is not a valid initial value for hearts!`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HappyThought = mongoose.model("HappyThought", happyThoughtSchema);

export default HappyThought;
