const appScriptURL = 'https://script.google.com/macros/s/AKfycbx_eh9mkoaZkD73qozj5ckIu2IY0la-DjsBrlWv2kqh8gj5kmFTzDAaYBwzW-XLciGU1w/exec';
const container = document.getElementById('survey-container');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let currentStep = 0;
const responses = {};
let questions = [];

function createProgressBar() {
  const barWrapper = document.createElement('div');
  barWrapper.id = 'progress-container';

  const bar = document.createElement('div');
  bar.id = 'progress-bar';

  barWrapper.appendChild(bar);
  document.body.insertBefore(barWrapper, container);
}

function updateProgressBar(index) {
  const bar = document.getElementById('progress-bar');
  const percent = Math.round((index + 1) / questions.length * 100);
  bar.style.width = `${percent}%`;
}

function createQuestions() {
  questions = [
    {
      id: 'Q1',
      type: 'multiple',
      text: 'Do you feel comfortable in Church meetings?',
      options: ['Yes', 'Somewhat', 'No']
    },
    {
      id: 'Q2',
      type: 'multiple',
      text: 'Do you feel comfortable at Church activities?',
      options: ['Yes', 'Somewhat', 'No']
    },
    {
      id: 'Q3',
      type: 'slider',
      text: 'How comfortable do you feel with "LDS Culture"?',
      min: 0, max: 99
    },
    {
      id: 'Q4',
      type: 'multiple',
      text: 'How Christ-Centered is LDS Culture?',
      options: ['Very', 'Somewhat', 'Not']
    },
    {
      id: 'Q5',
      type: 'multiple',
      text: 'Do you feel that you belong as part of the Ward Family?',
      options: ['Yes', 'Somewhat', 'No']
    },
    {
      id: 'Q6',
      type: 'multiple',
      text: 'Do you feel significant conflict or tension in your Church experience?',
      options: ['Yes', 'No']
    },
    {
      id: 'Q7',
      type: 'ranking',
      text: 'Drag to order by how important these are to YOU (top = most important)',
      options: [
        'Caring for the Poor',
        'Ministering',
        'Striving to be Christlike',
        'Faith in Jesus Christ and His Atonement',
        'Attending Meetings and Activities',
        'Following Church Leaders',
        'Covenants and Ordinances',
        'Family History Work',
        'Temple Attendance',
        'Sharing the Gospel',
        'Paying Tithing',
        'Dress and Grooming Standards'
      ],
      keys: [
        'Q7a','Q7b','Q7c','Q7d','Q7e','Q7f','Q7g','Q7h',
        'Q7i','Q7j','Q7k','Q7l'
      ]
    },
    {
      id: 'Q8',
      type: 'ranking',
      text: 'Drag to order by how important you feel these are to "LDS CULTURE" (top = most important)',
      options: [
        'Caring for the Poor',
        'Ministering',
        'Striving to be Christlike',
        'Faith in Jesus Christ and His Atonement',
        'Attending Meetings and Activities',
        'Following Church Leaders',
        'Covenants and Ordinances',
        'Family History',
        'Temple Attendance',
        'Sharing the Gospel',
        'Paying Tithing',
        'Dress and Grooming Standards'
      ],
      keys: [
        'Q8a','Q8b','Q8c','Q8d','Q8e','Q8f','Q8g','Q8h',
        'Q8i','Q8j','Q8k','Q8l'
      ]
    },
    {
      id: 'Q9',
      type: 'text',
      text: 'Please provide any thoughts or comments below:'
    }
  ];
}

function showStep(index) {
  const oldSection = document.querySelector('.question');
  if (oldSection) {
    oldSection.classList.remove('active');
    oldSection.classList.add('exit');

    setTimeout(() => {
      container.removeChild(oldSection);
      renderQuestion(index);
    }, 300);
  } else {
    renderQuestion(index);
  }
}

function renderQuestion(index) {
  const q = questions[index];
  const section = document.createElement('section');
  section.className = 'question active';

  const heading = document.createElement('h2');
  heading.textContent = q.text;
  section.appendChild(heading);

  if (q.type === 'multiple') {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    q.options.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = choice;
      btn.onclick = () => {
        responses[q.id] = choice;
        document.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      };
      optionsDiv.appendChild(btn);
    });
    section.appendChild(optionsDiv);

  } else if (q.type === 'slider') {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = q.min;
    input.max = q.max;
    input.value = Math.floor((q.min + q.max) / 2);
    input.style.width = '100%';
    input.oninput = () => responses[q.id] = input.value/100.0;
    section.appendChild(input);

    const labelRow = document.createElement('div');
    labelRow.className = 'slider-label';
    labelRow.innerHTML = `<span>Not at all</span><span>Completely</span>`;
    section.appendChild(labelRow);
    responses[q.id] = input.value/100.0;

  } else if (q.type === 'text') {
    const textarea = document.createElement('textarea');
    textarea.placeholder = "Type your response here…";
    textarea.oninput = () => responses[q.id] = textarea.value;
    section.appendChild(textarea);

  } else if (q.type === 'ranking') {
    const wrapperDiv = document.createElement('div');
    wrapperDiv.className = 'rank-wrapper';

    const list = document.createElement('ul');
    list.className = 'ranking-list';

    q.options.forEach((item, index) => {
      const li = document.createElement('li');
      li.setAttribute('data-original', item);
      li.innerHTML = `<strong>${index + 1}.</strong> ${item}`;
      list.appendChild(li);
    });

    wrapperDiv.appendChild(list);
    section.appendChild(wrapperDiv);

    new Sortable(list, {
      animation: 150,
      onEnd: () => {
        Array.from(list.children).forEach((li, idx) => {
          li.innerHTML = `<strong>${idx + 1}.</strong> ${li.getAttribute('data-original')}`;
        });
        const order = Array.from(list.children).map(li => li.getAttribute('data-original'));
        q.options.forEach((label, idx) => {
          const key = q.keys[idx];
          const rank = order.indexOf(label);
          responses[key] = 12 - rank;
        });
      }
    });

    q.options.forEach((label, idx) => {
      const key = q.keys[idx];
      responses[key] = 12 - idx;
    });
  }

  container.appendChild(section);
  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === questions.length - 1 ? 'Submit' : 'Next';
  updateProgressBar(index);
}

nextBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (currentStep < questions.length - 1) {
    currentStep++;
    showStep(currentStep);
  } else {
    submitSurvey();
  }
};

prevBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
};

// ---- Submit to Apps Script ----
function submitSurvey() {
  nextBtn.disabled = true;
  nextBtn.textContent = 'Submitting…';

  const formData = new FormData();
  Object.entries(responses).forEach(([k, v]) => formData.append(k, v));

  fetch(appScriptURL, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      container.innerHTML = `<h2>Thank you!</h2><p>Your response has been submitted.</p>`;
      document.getElementById('navigation').style.display = 'none';
      updateProgressBar(questions.length - 1);
    })
    .catch(err => {
      container.innerHTML = `<h2>Oops</h2><p>Something went wrong: ${err.message}</p>`;
    });
}

// ---- Initialize ----
createQuestions();
createProgressBar();
showStep(currentStep);
