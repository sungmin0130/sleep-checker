const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "sleep-checker.firebaseapp.com",
  projectId: "sleep-checker"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function extractGradeAndGender(studentId) {
  const id = parseInt(studentId);
  const grade = Math.floor(id / 1000);
  const classGenderDigit = Math.floor(id / 100) % 10;

  let gender = "기타";
  if (classGenderDigit >= 1 && classGenderDigit <= 4) gender = "남자";
  else if (classGenderDigit >= 5 && classGenderDigit <= 8) gender = "여자";

  return { grade, gender };
}

function generateDetailedFeedback(data) {
  const {
    age, weekdaySleep, weekendSleep, weekdayNap, weekendNap, caffeine, tired
  } = data;

  const feedback = [];
  const recommended = age < 18 ? [8, 10] : [7, 9];

  if (weekdaySleep < recommended[0]) {
    const diff = recommended[0] - weekdaySleep;
    feedback.push(`❗ 평일 수면 시간이 ${weekdaySleep}시간으로 권장 기준보다 ${diff}시간 부족합니다. 이는 집중력, 면역력 저하를 유발할 수 있으니 최소 ${recommended[0]}시간 이상 수면을 확보해보세요. 스마트폰 사용 줄이기, 수면 루틴 만들기 등이 도움이 됩니다.`);
  }

  const delta = weekendSleep - weekdaySleep;
  if (delta > 2) {
    feedback.push(`⚠️ 주말 수면 시간이 평일보다 ${delta.toFixed(1)}시간 더 많습니다. 이런 수면 불균형은 생체 리듬을 혼란시켜 월요일 피로감을 높일 수 있어요. 주말에도 기상 시간을 일정하게 유지해보세요.`);
  }

  if (weekdayNap > 30 || weekendNap > 30) {
    feedback.push(`💤 낮잠 시간이 30분을 초과했습니다. 긴 낮잠은 밤 수면을 방해할 수 있으니 점심 식사 후 20~30분 이내의 짧은 낮잠을 권장합니다.`);
  }

  if (caffeine > 200) {
    feedback.push(`☕ 하루 카페인 섭취량이 ${caffeine}mg입니다. 이는 청소년 권장 섭취량(100mg)을 초과하며, 숙면을 방해할 수 있습니다. 특히 오후 섭취는 피하고, 물 또는 무카페인 음료로 대체해보세요.`);
  }

  if (tired === "yes") {
    feedback.push(`😴 충분히 자도 피곤함을 느끼고 있다면, 수면의 질이 낮거나 스트레스, 불안, 우울감 등 심리적 요인이 있을 수 있습니다. 자기 전 1시간 스마트폰 사용 줄이기, 명상, 따뜻한 물 샤워를 시도해보세요.`);
  }

  if (feedback.length === 0) {
    feedback.push("✅ 매우 안정적인 수면 습관을 유지하고 있습니다! 지금처럼 규칙적인 생활을 유지하세요.");
  }

  return feedback.join("<br><br>");
}

document.getElementById('sleepForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const studentId = document.getElementById('studentId').value.trim();
  const age = parseInt(document.getElementById('age').value);
  const weekdaySleep = parseFloat(document.getElementById('weekdaySleep').value);
  const weekendSleep = parseFloat(document.getElementById('weekendSleep').value);
  const weekdayNap = parseInt(document.getElementById('weekdayNap').value);
  const weekendNap = parseInt(document.getElementById('weekendNap').value);
  const caffeine = parseInt(document.getElementById('caffeine').value);
  const tired = document.getElementById('tired').value;

  const { grade, gender } = extractGradeAndGender(studentId);

  await db.collection("sleepRecords").add({
    studentId, age, weekdaySleep, weekendSleep,
    weekdayNap, weekendNap, caffeine, tired,
    grade, gender,
    createdAt: new Date()
  });

  const feedbackText = generateDetailedFeedback({
    age, weekdaySleep, weekendSleep,
    weekdayNap, weekendNap, caffeine, tired
  });

  document.getElementById('modalFeedbackText').innerHTML = feedbackText;
  document.getElementById('feedbackModal').classList.remove('hidden');

  document.getElementById('sleepForm').reset();
});

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('feedbackModal').classList.add('hidden');
});