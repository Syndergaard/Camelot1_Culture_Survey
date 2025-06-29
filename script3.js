const appScriptURL = 'https://script.google.com/macros/s/AKfycbzTQXVzEyMtZeemiIVuOSzRN6lag8Od-h4MTXcTQB0fmDtbYIj-dlxlA485FQFXpn9a/exec';
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

// ---- Question Config ----
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
        text: 'How comfortable do you feel with "Church Culture"? (0 = not at all, 5 = completely)',
        min: 0, max: 100
      },
      {
        id: 'Q4',
        type: 'multiple',
        text: 'Do you feel that you belong as part of the Ward Family?',
        options: ['Yes', 'Somewhat', 'No']
      },
      {
        id: 'Q5',
        type: 'multiple',
        text: 'Do you feel significant conflict or tension in your Church experience?',
        options: ['Yes', 'Somewhat', 'No']
      },
      {
        id: 'Q6',
        type: 'multiple',
        text: 'How Christ-Centered is Church Culture?',
        options: ['Very', 'Somewhat', 'Not']
      },
      {
        id: 'Q7',
        type: 'ranking',
        text: 'Drag to order these by how important they are to YOU (top = most important)',
        options: [
          'Love and Care for the Poor and Needy',
          'Love and Serve Others',
          'Strive to be Christlike',
          'Believe in and Follow Jesus Christ and His Teachings',
          'Keep the Commandments',
          'Live the Doctrine of Christ',
          'Attend Meetings and Activities',
          'Stay on the Covenant Path',
          'Follow Church Leaders',
          'Be Sealed in the Temple',
          'Attend the Temple',
          'Keep the Word of Wisdom',
          'Serve a full-time mission',
          'Dress and Groom Appropriately'
        ],
        keys: [
          'Q7a','Q7b','Q7c','Q7d','Q7e','Q7f','Q7g','Q7h',
          'Q7i','Q7j','Q7k','Q7l','Q7m','Q7n'
        ]
      },
      {
        id: 'Q8',
        type: 'ranking',
        text: 'Drag to order these by how important you feel they are to the CHURCH (top = most important)',
        options: [
          'Love and Care for the Poor and Needy',
          'Love and Serve Others',
          'Strive to be Christlike',
          'Believe in and Follow Jesus Christ and His Teachings',
          'Keep the Commandments',
          'Live the Doctrine of Christ',
          'Attend Meetings and Activities',
          'Stay on the Covenant Path',
          'Follow Church Leaders',
          'Be Sealed in the Temple',
          'Attend the Temple',
          'Keep the Word of Wisdom',
          'Serve a full-time mission',
          'Dress and Groom Appropriately'
        ],
        keys: [
          'Q8a','Q8b','Q8c','Q8d','Q8e','Q8f','Q8g','Q8h',
          'Q8i','Q8j','Q8k','Q8l','Q8m','Q8n'
        ]
      },
      {
        id: 'Q9',
        type: 'text',
        text: 'Please provide any thoughts or comments below:'
      }
    ];
}

// ---- Rendering Logic ----
function showStep(index) {
    const oldSection = document.querySelector('.question');
    if (oldSection) {
      oldSection.classList.remove('active');
      oldSection.classList.add('exit');
  
      setTimeout(() => {
        container.removeChild(oldSection);
        renderQuestion(index);
      }, 300); // match with CSS transition duration
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
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '1rem';
    
        const minLabel = document.createElement('span');
        minLabel.textContent = "Not at all";
    
        const maxLabel = document.createElement('span');
        maxLabel.textContent = "Completely";
    
        const input = document.createElement('input');
        input.type = 'range';
        input.min = q.min;
        input.max = q.max;
        input.value = Math.floor((q.min + q.max) / 2);
        input.style.flex = '1';
        input.oninput = () => responses[q.id] = input.value;
    
        wrapper.appendChild(minLabel);
        wrapper.appendChild(input);
        wrapper.appendChild(maxLabel);
        section.appendChild(wrapper);
    
        responses[q.id] = input.value;
    
      } else if (q.type === 'text') {
        const textarea = document.createElement('textarea');
        textarea.placeholder = "Type your response here…";
        textarea.oninput = () => responses[q.id] = textarea.value;
        section.appendChild(textarea);
    
      } else if (q.type === 'ranking') {
        const list = document.createElement('ul');
        list.className = 'ranking-list';
        list.id = `sortable-${q.id}`;
    
        q.options.forEach((item, index) => {
          const li = document.createElement('li');
          li.setAttribute('data-original', item);
          li.innerHTML = `<strong>${index + 1}.</strong> ${item}`;
          list.appendChild(li);
        });
        section.appendChild(list);
    
        new Sortable(list, {
          animation: 150,
          onEnd: () => {
            Array.from(list.children).forEach((li, idx) => {
              li.innerHTML = `<strong>${idx + 1}.</strong> ${li.getAttribute('data-original')}`;
            });
            const order = Array.from(list.children).map(li => li.getAttribute('data-original'));
            q.options.forEach((label, idx) => {
              const key = q.keys[idx];
              const rank = order.indexOf(label) + 1;
              responses[key] = rank;
            });
          }
        });
    
        // Initialize default ranks
        q.options.forEach((label, idx) => {
          const key = q.keys[idx];
          responses[key] = idx + 1;
        });
      }
  
    container.appendChild(section);
  
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === questions.length - 1 ? 'Submit' : 'Next';
    updateProgressBar(index);
}
  

// ---- Navigation ----
nextBtn.onclick = () => {
  if (currentStep < questions.length - 1) {
    currentStep++;
    showStep(currentStep);
  } else {
    submitSurvey();
  }
};

prevBtn.onclick = () => {
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
