const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const PostsSchema = new Schema(
  {
    uuid: String,
    email: String,
    name: {
      type: String,
      required: true,
    },
    verified: Boolean,
    status: { type: Boolean, default: true }, //for Post status
    phone: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return /(9{1})(\d{0,8})$/.test(v);
        },
        message: (props) => `${props.value} no es un número válido!`,
      },
    },
    age: Object,
    nationality: Object,
    degree: Object,
    languages: Array,
    images: Array,
    profession: Object,
    presentation: String,
    hair: Object,
    eye: Object,
    dimensions: Object,
    height: Number,
    weight: Number,
    rate_30m: Number,
    rate_1h: Number,
    rate_2h: Number,
    rate_3h: Number,
    rate_allNight: Number,
    rate_travel: Number,
    pay_method: Array,
    services: Array,
    place: Array,
    departmentValue: Object,
    provinceValue: Object,
    districtValue: Array,
  },
  { timestamps: true }
);

PostsSchema.plugin(mongoosePaginate);

const Posts = mongoose.model("Post", PostsSchema);

module.exports = Posts;
