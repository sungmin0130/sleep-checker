function getDuration(sleep, wake) {
    const [sh, sm] = sleep.split(':').map(Number);
    const [wh, wm] = wake.split(':').map(Number);
    let sleepTime = sh * 60 + sm;
    let wakeTime = wh * 60 + wm;
    if (wakeTime <= sleepTime) wakeTime += 24 * 60;
    return (wakeTime - sleepTime) / 60;
  }
  
  function analyze() {
    const weekdaySleep = document.getElementById('weekdaySleep').value;
    const weekdayWake = document.getElementById('weekdayWake').value;
    const weekendSleep = document.getElementById('weekendSleep').value;
    const weekendWake = document.getElementById('weekendWake').value;
    const nap = document.getElementById('nap').checked;
    const tired = document.getElementById('tired').checked;
  
    if (!weekdaySleep || !weekdayWake || !weekendSleep || !weekendWake) {
      alert("모든 시간을 입력해 주세요!");
      return;
    }
  
    const weekdayHours = getDuration(weekdaySleep, weekdayWake);
    const weekendHours = getDuration(weekendSleep, weekendWake);
    const avgSleep = ((weekdayHours * 5) + (weekendHours * 2)) / 7;
  
    let status = "";
    let issues = [];
    let tips = [];
  
    if (avgSleep < 6) {
      status = "위험";
      issues.push("수면 시간이 매우 부족합니다.");
      tips.push("매일 최소 7시간 이상 자도록 노력하세요.");
    } else if (avgSleep < 7.5) {
      status = "주의";
      issues.push("수면 시간이 다소 부족합니다.");
      tips.push("취침/기상 시간 고정을 시도해보세요.");
    } else {
      status = "양호";
    }
  
    const bedDiff = Math.abs(getDuration(weekdaySleep, weekendSleep));
    const wakeDiff = Math.abs(getDuration(weekdayWake, weekendWake));
    if (bedDiff > 2 || wakeDiff > 2) {
      issues.push("주말과 평일의 수면 패턴 차이가 큽니다.");
      tips.push("주말에도 평소 시간에 자고 일어나는 게 좋아요.");
    }
  
    if (tired) {
      issues.push("충분히 자도 피곤함을 느끼고 있어요.");
      tips.push("수면 환경 개선(예: 어두운 방, 스마트폰 금지)을 해보세요.");
    }
  
    if (nap) {
      issues.push("낮잠을 자주 자고 있습니다.");
      tips.push("낮잠은 20분 이내, 오후 3시 이전이 좋아요.");
    }
  
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
      <h2>분석 결과</h2>
      <p><strong>평균 수면 시간:</strong> ${avgSleep.toFixed(1)} 시간</p>
      <p><strong>수면 상태:</strong> ${status}</p>
      ${issues.length ? `<h3>문제점</h3><ul>${issues.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
      ${tips.length ? `<h3>개선 팁</h3><ul>${tips.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
    `;
  }
  