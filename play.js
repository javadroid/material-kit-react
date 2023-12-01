
import React from 'react'
import { addData, updateData } from 'src/service/Api';

export default function play(examRooms,exams,totalExamWeeks,lecturerSamples,lecturernumber,setexamWeeksAll) {
  
   examRooms = [
  { venueName: 'Room A', venueCode: 'A001', department: 'Mathematics', capacity: 60 },
  { venueName: 'Room B', venueCode: 'B002', department: 'Physics', capacity: 80 },
  { venueName: 'Room C', venueCode: 'C003', department: 'Chemistry', capacity: 50 },
  { venueName: 'Room D', venueCode: 'D004', department: 'Computer Science', capacity: 70 },
  { venueName: 'Room E', venueCode: 'E005', department: 'Economics', capacity: 45 },
  { venueName: 'Room F', venueCode: 'F006', department: 'Psychology', capacity: 55 },
  { venueName: 'Room G', venueCode: 'G007', department: 'History', capacity: 40 },
  { venueName: 'Room H', venueCode: 'H008', department: 'English', capacity: 60 },
  { venueName: 'Room I', venueCode: 'I009', department: 'Biology', capacity: 50 },
  { venueName: 'Room J', venueCode: 'J010', department: 'Music', capacity: 35 },

  // Add more rooms as needed
];
exams = [
   
  { course: 'Math101', faculty: 'Science', department: 'Mathematics', creditHours: 3, level: 100, venue: 'Room A', examDuration: 2, students: 50 },
  { course: 'Physics201', faculty: 'Science', department: 'Physics', creditHours: 4, level: 200, venue: 'Room B', examDuration: 3, students: 60 },
  { course: 'Chemistry301', faculty: 'Science', department: 'Chemistry', creditHours: 3, level: 300, venue: 'Room C', examDuration: 2, students: 45 },
  { course: 'CompSci101', faculty: 'Engineering', department: 'Computer Science', creditHours: 3, level: 100, venue: 'Room D', examDuration: 2, students: 55 },
  { course: 'Econ101', faculty: 'Social Sciences', department: 'Economics', creditHours: 3, level: 100, venue: 'Room E', examDuration: 2, students: 40 },
  { course: 'Psychology201', faculty: 'Social Sciences', department: 'Psychology', creditHours: 3, level: 200, venue: 'Room F', examDuration: 2, students: 50 },
  { course: 'History301', faculty: 'Arts', department: 'History', creditHours: 3, level: 300, venue: 'Room G', examDuration: 2, students: 35 },
  { course: 'English101', faculty: 'Arts', department: 'English', creditHours: 3, level: 100, venue: 'Room H', examDuration: 2, students: 40 },
  { course: 'Bio10112', faculty: 'Science', department: 'Biology', creditHours: 3, level: 100, venue: 'Room I', examDuration: 2, students: 48 },
  { course: 'Music201', faculty: 'Arts', department: 'Music', creditHours: 2, level: 200, venue: 'Room J', examDuration: 1, students: 30 },
  
];// Step 1: Define Parameters

  // const lecturerSamples = [];

  // for (let i = 1; i <= 1000; i++) {
  //   const lecturer = {
  //     lecturerName: `Prof. ${getRandomName()}`,
  //     department: getRandomDepartment(),
  //   };
  //   lecturerSamples.push(lecturer);
  // }
  
  // function getRandomName() {
  //   const names = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  //   const randomIndex = Math.floor(Math.random() * names.length);
  //   return names[randomIndex];
  // }
  
  // function getRandomDepartment() {
  //   const departments = ['Chemistry', 'Physics', 'Computer Science', 'Biology', 'Mathematics', 'Economics',"Psychology","Music","History","English"];
  //   const randomIndex = Math.floor(Math.random() * departments.length);
  //   return departments[randomIndex];
  // }
  // console.log(lecturerSamples);
  // Step 2: Group Exams
  const groupedExams = groupExams(exams);
  
  function groupExams(exams) {
    const grouped = {};
    exams.forEach((exam) => {
      const key = `${exam.faculty}_${exam.department}_${exam.level}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(exam);
    });
    return grouped;
  }

//   console.log(JSON.stringify(groupedExams,null,2))
// Step 3: Determine Exam Weeks
// const totalExamWeeks = 2; // You can adjust the number of weeks as needed
const examsPerWeek = Math.ceil(exams.length / totalExamWeeks);

// Distribute exams evenly across the weeks
const examWeeks = [];
for (let i = 0; i < totalExamWeeks; i++) {
  const startIdx = i * examsPerWeek;
  const endIdx = startIdx + examsPerWeek;
  examWeeks.push(exams.slice(startIdx, endIdx));
}

// console.log('Exam Weeks:', examWeeks);

// Step 4: Establish Exam Hours
const examDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const examStartTime = 8; // 8am
const examEndTime = 17; // 5pm

// Define the break on Fridays (1pm to 3pm)
const fridayBreakStart = 13; // 1pm
const fridayBreakEnd = 15; // 3pm

// Create a function to generate the exam schedule for each day
function generateExamSchedule(day, startHour, endHour) {
  const schedule = [];
  for (let hour = startHour; hour < endHour; hour++) {
    if (day === 'Friday' && hour === fridayBreakStart) {
      // Skip the break on Fridays
      hour = fridayBreakEnd;
    } else {
      schedule.push(`${hour}:00 - ${hour + 2}:00`);
    }
  }
  return schedule;
}


  function generateCompleteScheduleWithLecturers(exams, examSchedule, lecturers) {
    exams.forEach(exam => {
      let scheduled = false;
  
      while (!scheduled) {
        // Randomly select a day and time for the exam
        const randomDay = examDays[Math.floor(Math.random() * examDays.length)];
        let randomTime = examSchedule[randomDay][Math.floor(Math.random() * examSchedule[randomDay].length)];
        randomTime = randomTime?.time ? randomTime?.time : randomTime;
  
        exam.day = randomDay;
        exam.time = randomTime;
  
        // Assign 3-5 lecturers to the exam
        const examLecturers = [];
        const departmentLecturers = lecturers.filter(lecturer => lecturer.department === exam.department);
        const numLecturers = Math.floor(Math.random() * (5 - 3 + 1)) + 3; // Random number between 3 and 5
  
        for (let i = 0; i < lecturernumber; i++) {
          let availableLecturers = departmentLecturers.filter(lecturer =>
            !examLecturers.some(assignedLecturer => hasLecturerTimeConflict(assignedLecturer, lecturer))
          );
  // console.log(availableLecturers)
          if (availableLecturers.length > 0) {
            const selectedLecturer = availableLecturers[Math.floor(Math.random() * availableLecturers.length)];
            examLecturers.push(selectedLecturer);
          } else {
            // If no available lecturers, retry scheduling the exam
            scheduled = false;
            break;
          }
        }
  
        // Update the exam schedule and check for conflicts
        scheduled = updateExamSchedule(examSchedule, exam);
  
        // If scheduled, assign the lecturers to the exam
        if (scheduled) {
          exam.lecturers = examLecturers;
        }
      }
    });
  }
  // Generate the exam schedule for each day
const examSchedule = {};
  // Generate the complete exam schedule with lecturers
  function hasLecturerTimeConflict(existingLecturer, potentialLecturer) {
    return existingLecturer?.schedule?.some(existingSlot => {
      return potentialLecturer.schedule.some(potentialSlot => {
        return existingSlot.day === potentialSlot.day && existingSlot.time === potentialSlot.time;
      });
    });
  }
  

examDays.forEach(day => {
    
  examSchedule[day] = generateExamSchedule(day, examStartTime, examEndTime);
});


// Step 5: Allocate Rooms with Modified examRooms Structure

  // Create a function to assign a room to an exam based on capacity
  function assignRoom(exam, rooms) {
    const availableRooms = rooms.filter(room => room.capacity >= exam.students);
    return availableRooms.length > 0 ? availableRooms[0] : null;
  }
  
  // Assign rooms to exams
  exams.forEach(exam => {
    exam.room = assignRoom(exam, examRooms);
  });

  // Step 5: Allocate Rooms with Room Availability Check
function isRoomFree(room, day, time, schedule) {
    const existingExamsOnDay = schedule[day] || [];
    return !existingExamsOnDay.some(existingExam => {
      return existingExam.room.venueCode === room.venueCode && existingExam.time === time;
    });
  }
  
  function assignRoom1(exam, rooms, schedule) {
    const availableRooms = rooms.filter(room => room.capacity >= exam.students && isRoomFree(room, exam.day, exam.time, schedule));
    return availableRooms.length > 0 ? availableRooms[0] : null;
  }
  
  exams.forEach(exam => {
    let assignedRoom = null;
  
    while (!assignedRoom) {
      exam.room = assignRoom1(exam, examRooms, examSchedule);
  
      if (exam.room) {
        // Check if the room is available at the scheduled time and day
        const roomIsFree = isRoomFree(exam.room, exam.day, exam.time, examSchedule);
  
        if (roomIsFree) {
          // If the room is available, mark it as assigned
          assignedRoom = exam.room;
  
          // Update the exam schedule
          if (!examSchedule[exam.day]) {
            examSchedule[exam.day] = [];
          }
          examSchedule[exam.day].push({ course: exam.course, time: exam.time, room: exam.room });
        }
      }
    }
  });
  
//   console.log('Exams with Assigned Rooms:', exams);

// Step 6: Avoid Time Conflicts
function hasTimeConflict(existingExam, newExam) {
  return existingExam.day === newExam.day && existingExam.time === newExam.time;
}

// Create a function to check for time conflicts and update the schedule
function updateExamSchedule(examSchedule, exam) {
  const daySchedule = examSchedule[exam.day];

  // Check for time conflicts with existing exams on the same day
  const conflicts = daySchedule.some(existingExam => hasTimeConflict(existingExam, exam));

  if (!conflicts) {
    // If no conflicts, add the exam to the schedule
    daySchedule.push({ course: exam.course, time: exam.time, room: exam.room });
    return true;
  } else {
    // If conflicts, reschedule the exam for another available time
    return false;
  }
}

// Create a function to generate the complete exam schedule
function generateCompleteSchedule(exams, examSchedule) {
  exams.forEach(exam => {
    let scheduled = false;

    while (!scheduled) {
      // Randomly select a day and time for the exam
      const randomDay = examDays[Math.floor(Math.random() * examDays.length)];
      let randomTime = examSchedule[randomDay][Math.floor(Math.random() * examSchedule[randomDay].length)];
      randomTime =randomTime?.time?randomTime?.time:randomTime
      
      exam.day = randomDay;
      exam.time = randomTime;

      // Update the exam schedule and check for conflicts
      scheduled = updateExamSchedule(examSchedule, exam);
    }
  });
}

// Generate the complete exam schedule
// generateCompleteSchedule(exams, examSchedule);
generateCompleteScheduleWithLecturers(exams, examSchedule, lecturerSamples);

// console.log('Final Exam Schedule:', exams);

// Step 7: Optimization (Simple Randomization)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Shuffle the exam schedule to add randomness
  shuffleArray(exams);
  
//   
exams.sort((exam1, exam2) => {
    // Sort by day first
    const dayOrder = examDays.indexOf(exam1.day) - examDays.indexOf(exam2.day);
    if (dayOrder !== 0) {
      return dayOrder;
    }
  
     // Then sort by time
  const timeOrder = examSchedule[exam1.day].indexOf(exam1.time) - examSchedule[exam2.day].indexOf(exam2.time);
  return timeOrder;
  });


  // console.log('Optimized Exam Schedule:', exams);

// Display the final exam schedule with lecturers for each week with sorting
for (let week = 0; week < totalExamWeeks; week++) {
  // Sort exams within each week by day and time
  examWeeks[week].sort((exam1, exam2) => {
    const dayOrder = examDays.indexOf(exam1.day) - examDays.indexOf(exam2.day);
    if (dayOrder !== 0) {
      return dayOrder;
    }

    const timeOrder =
      examSchedule[exam1.day].indexOf(exam1.time) - examSchedule[exam2.day].indexOf(exam2.time);
    return timeOrder;
  });

  console.log(`Week ${week + 1} Exam Schedule:`);
  console.log('-----------------------------------------------------');
  console.log('| Course    | Day       | Time          | Room       | Lecturers                      |');
  console.log('-----------------------------------------------------');
 
  examWeeks[week].forEach(exam => {
    const lecturerNames = exam.lecturers.map(lecturer => lecturer.lecturerName).join(', ');
    // console.log(lecturerNames)
    console.log(
      `| ${exam.course?.padEnd(10)} | ${exam.day?.padEnd(9)} | ${exam.time?.padEnd(14)} | ${exam.room.venueName?.padEnd(
        10
      )} | ${lecturerNames.padEnd(30)} |`
    );
  });

  console.log('-----------------------------------------------------\n');
  setexamWeeksAll(examWeeks)

  
  // return {examWeeks,exams}
}
function handleCloseModal(){

}
function setReload(dcs){

}
console.log('---------------------------examWeeks--------------------------\n',examWeeks);
addData("TimeTable", {examWeeks:JSON.stringify(examWeeks)}, handleCloseModal, setReload)
}

