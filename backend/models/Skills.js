import mongoose from "mongoose"

const skillsSchema = mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String,
    }, 
    category : {
        type: String
    }
},
    { timestamps: true }
)

const Skills = mongoose.model("Skills", skillsSchema)
export default Skills