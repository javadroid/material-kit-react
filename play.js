import React from 'react'
import { addData, updateData } from 'src/service/Api';

export default function play(examRooms, exams, totalExamWeeks, lecturerSamples, lecturernumber, setexamWeeksAll) {


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
    const levelsScheduled = {};
    exams.forEach(exam => {
      let scheduled = false;
      const maxAttempts = 100;
      let attempts=0
      while (!scheduled&& attempts < maxAttempts) {
        attempts++;
        // Randomly select a day and time for the exam
        const randomDay = examDays[Math.floor(Math.random() * examDays.length)];
        let randomTime = examSchedule[randomDay][Math.floor(Math.random() * examSchedule[randomDay].length)];
        randomTime = randomTime?.time ? randomTime?.time : randomTime;

        if (!levelsScheduled[randomTime]) {
          levelsScheduled[randomTime] = new Set();
        }
        if (!levelsScheduled[randomTime].has(exam.level)) {
          exam.day = randomDay;
          exam.time = randomTime;
  // Assign 3-5 lecturers to the exam
  const examLecturers = [];
  const departmentLecturers = lecturers?.filter(lecturer => lecturer.department === exam.department);
  const numLecturers = Math.floor(Math.random() * (5 - 3 + 1)) + 3; // Random number between 3 and 5

  for (let i = 0; i < lecturernumber; i++) {
    let availableLecturers = departmentLecturers?.filter(lecturer =>
      !examLecturers?.some(assignedLecturer => hasLecturerTimeConflict(assignedLecturer, lecturer))
    );
    // console.log(availableLecturers)
    if (availableLecturers?.length > 0) {
      const selectedLecturer = availableLecturers[Math.floor(Math.random() * availableLecturers?.length)];
      examLecturers?.push(selectedLecturer);
    } else {
      // If no available lecturers, retry scheduling the exam
      scheduled = false;
      break;
    }
  }
          // Update the exam schedule and check for conflicts
          scheduled = updateExamSchedule(examSchedule, exam);
  
          // If scheduled, mark the level as scheduled for that time
          if (scheduled) {
             exam.lecturers = examLecturers;
            levelsScheduled[randomTime].add(exam.level);
          }
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
    let qq=0
    while (!assignedRoom&&qq<20) {
      exam.room = assignRoom1(exam, examRooms, examSchedule);
qq++
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
        }else {
          // Handle the case when the room is not free
          console.error('Error: Room is not free for exam:', exam);
          // You might want to set a different room or reschedule the exam
        }
      }else {
        // Handle the case when exam.room is falsy (e.g., room assignment failed)
        if(qq>15){
          exam.room = assignRoom(exam, examRooms, examSchedule);
          assignedRoom = exam.room;
          // Update the exam schedule
          if (!examSchedule[exam.day]) {
            examSchedule[exam.day] = [];
          }
          examSchedule[exam.day].push({ course: exam.course, time: exam.time, room: exam.room });
        }
        // console.error('Error: Room assignment failed for exam:', exam);
        // You might want to set a default room or take other corrective actions
      }
    }
  });

  //   console.log('Exams with Assigned Rooms:', exams);

  // Step 6: Avoid Time Conflicts
  function hasTimeConflict(existingExam, newExam) {
    // console.log(first)
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
  // function generateCompleteSchedule(exams, examSchedule) {
  //   exams.forEach(exam => {
  //     let scheduled = false;

  //     while (!scheduled) {
  //       // Randomly select a day and time for the exam
  //       const randomDay = examDays[Math.floor(Math.random() * examDays.length)];
  //       let randomTime = examSchedule[randomDay][Math.floor(Math.random() * examSchedule[randomDay].length)];
  //       randomTime = randomTime?.time ? randomTime?.time : randomTime

  //       exam.day = randomDay;
  //       exam.time = randomTime;

  //       // Update the exam schedule and check for conflicts
  //       scheduled = updateExamSchedule(examSchedule, exam);
  //     }
  //   });
  // }

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
      const lecturerNames = exam.lecturers?.map(lecturer => lecturer.lecturerName).join(', ');
      // console.log(lecturerNames)
      console.log(
        `| ${exam.course?.padEnd(10)} | ${exam.day?.padEnd(9)} | ${exam.time?.padEnd(14)} | ${exam.room?.venueName?.padEnd(
          10
        )} | ${lecturerNames?.padEnd(30)} |`
      );
    });

    console.log('-----------------------------------------------------\n');
    setexamWeeksAll(examWeeks)


    // return {examWeeks,exams}
  }
  function handleCloseModal() {

  }
  function setReload(dcs) {

  }
  console.log('---------------------------examWeeks--------------------------\n', examWeeks);
  addData("TimeTable", { examWeeks: JSON.stringify(examWeeks) }, handleCloseModal, setReload)
}