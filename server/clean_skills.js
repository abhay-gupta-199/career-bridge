const mongoose = require('mongoose');

async function cleanJunkSkills() {
    try {
        await mongoose.connect('mongodb+srv://career-bridge:career-bridge%401234@career-bridge.7i4sjjw.mongodb.net/careerbridge?retryWrites=true&w=majority');
        console.log("Connected to MongoDB Atlas");
        
        const Student = require('./models/Student');
        const students = await Student.find({});
        
        let count = 0;
        for (const student of students) {
            if (student.skills && student.skills.length > 50) {
                console.log(`Student ${student.email} has ${student.skills.length} skills. Clearing them...`);
                student.skills = []; // Clear junk skills
                await student.save();
                count++;
            }
        }
        console.log(`Cleared junk skills for ${count} students.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanJunkSkills();
