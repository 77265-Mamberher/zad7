document.addEventListener("DOMContentLoaded", function() {

    const themeLink = document.getElementById("theme-style");
    const themeBtn = document.getElementById("theme-toggle-btn");

    const savedTheme = localStorage.getItem('cv_theme') || 'red.css';
    themeLink.setAttribute('href', savedTheme);
    themeBtn.innerText = savedTheme === 'red.css' ? 'Zmień motyw na Zielony' : 'Zmień motyw na Czerwony';

    themeBtn.addEventListener("click", function() {
        if (themeLink.getAttribute("href") === "red.css") {
            themeLink.setAttribute("href", "green.css");
            themeBtn.innerText = "Zmień motyw na Czerwony";
            localStorage.setItem('cv_theme', 'green.css');
        } else {
            themeLink.setAttribute("href", "red.css");
            themeBtn.innerText = "Zmień motyw na Zielony";
            localStorage.setItem('cv_theme', 'red.css');
        }
    });

    const projectsContent = document.getElementById("projects-content");
    const toggleProjectsBtn = document.getElementById("toggle-projects-btn");

    toggleProjectsBtn.addEventListener("click", function() {
        if (projectsContent.style.display !== "none") {
            projectsContent.style.display = "none";
            toggleProjectsBtn.innerText = "Pokaż sekcję";
        } else {
            projectsContent.style.display = "block";
            toggleProjectsBtn.innerText = "Ukryj sekcję";
        }
    });

    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        document.querySelectorAll('.error-message').forEach(el => el.innerText = '');
        successMessage.style.display = 'none';

        if (firstName === '') {
            document.getElementById('error-firstName').innerText = 'Imię jest wymagane.';
            isValid = false;
        } else if (/\d/.test(firstName)) {
            document.getElementById('error-firstName').innerText = 'Imię nie może zawierać cyfr.';
            isValid = false;
        }

        if (lastName === '') {
            document.getElementById('error-lastName').innerText = 'Nazwisko jest wymagane.';
            isValid = false;
        } else if (/\d/.test(lastName)) {
            document.getElementById('error-lastName').innerText = 'Nazwisko nie może zawierać cyfr.';
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            document.getElementById('error-email').innerText = 'E-mail jest wymagany.';
            isValid = false;
        } else if (!emailPattern.test(email)) {
            document.getElementById('error-email').innerText = 'Podaj poprawny adres e-mail.';
            isValid = false;
        }

        if (message === '') {
            document.getElementById('error-message').innerText = 'Wiadomość jest wymagana.';
            isValid = false;
        }

        if (isValid) {
            successMessage.style.display = 'block';
            contactForm.reset();
        }
    });

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const skillsList = document.getElementById('skills-list');
            data.skills.forEach(skill => {
                const li = document.createElement('li');
                li.innerHTML = skill;
                skillsList.appendChild(li);
            });

            const projectsList = document.getElementById('projects-list');
            data.projects.forEach(project => {
                const li = document.createElement('li');
                li.innerHTML = project;
                projectsList.appendChild(li);
            });
        })
        .catch(error => console.error(error));

    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');

    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('cv_notes')) || [];
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '8px';
            li.style.padding = '10px';
            li.style.backgroundColor = 'rgba(0,0,0,0.03)';
            li.style.border = '1px solid rgba(0,0,0,0.1)';
            li.style.borderRadius = '5px';

            const span = document.createElement('span');
            span.innerText = note;

            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Usuń';
            deleteBtn.className = 'copy-btn';
            deleteBtn.style.margin = '0';
            deleteBtn.onclick = function() {
                deleteNote(index);
            };

            li.appendChild(span);
            li.appendChild(deleteBtn);
            notesList.appendChild(li);
        });
    }

    function addNote() {
        const text = noteInput.value.trim();
        if (text !== '') {
            const notes = JSON.parse(localStorage.getItem('cv_notes')) || [];
            notes.push(text);
            localStorage.setItem('cv_notes', JSON.stringify(notes));
            noteInput.value = '';
            loadNotes();
        }
    }

    function deleteNote(index) {
        const notes = JSON.parse(localStorage.getItem('cv_notes')) || [];
        notes.splice(index, 1);
        localStorage.setItem('cv_notes', JSON.stringify(notes));
        loadNotes();
    }

    addNoteBtn.addEventListener('click', addNote);
    noteInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addNote();
    });

    loadNotes();

});