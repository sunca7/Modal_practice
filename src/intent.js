window.addEventListener('load', function() {
    const newIntent = document.getElementsByClassName('new-intent');
    const buttons = document.querySelectorAll('#modal button');
    const modal = document.getElementById('modal');
    const backdrop = document.getElementById('backdrop');
    const container = document.getElementById('container');
    let chats = [];
    const chats_local = localStorage.getItem('chats');
    if (chats_local)
        chats = JSON.parse(chats_local);
    generate_intents();

    function generate_intents() {
        container.innerHTML = '';
        chats.forEach(({ title }, id) => createIntent(id, title));
    }

    function insertStorage(title, expression, answer) {
        chats.push({
            title,
            expression,
            answer
        });
        localStorage.setItem('chats', JSON.stringify(chats));
        return chats.length - 1;
    }

    // Button Functions
    function confirmInsert() {
        closeModal();
        const editedTitle = document.getElementById('title').value;
        const editedExpressions = document.getElementById('expression').value;
        const editedAnswer = document.getElementById('answer').value;
        const id = insertStorage(editedTitle, editedExpressions, editedAnswer);
        createIntent(id, editedTitle);
    }

    function confirmUpdate(event) {
        closeModal();
        const editedTitle = document.getElementById('title').value;
        const editedExpressions = document.getElementById('expression').value;
        const editedAnswer = document.getElementById('answer').value;
        const id = event.target.getAttribute('intent-id');
        if (!id)
            return;
        const chat = chats[id];
        chat.title = editedTitle;
        chat.expression = editedExpressions;
        chat.answer = editedAnswer;
        localStorage.setItem('chats', JSON.stringify(chats));
        const heading = document.querySelector(`div[intent-id='${id}'] h2`);
        heading.innerHTML = editedTitle;
    }

    function confirmRemove(event) {
        closeModal();
        const targetId = event.target.getAttribute('intent-id');
        chats.splice(targetId, 1);
        localStorage.setItem('chats', JSON.stringify(chats));
        generate_intents();
    }

    // Create and Update Intent
    function createIntent(id, title) {
        const addIntent = document.createElement('div');
        addIntent.className = 'add-intent';
        const intentHeading = document.createElement('h2');
        addIntent.setAttribute('intent-id', id);
        intentHeading.textContent = title;
        addIntent.appendChild(intentHeading);
        container.appendChild(addIntent);
        container.insertBefore(addIntent, container.firstChild);
    }

    function openModal(edit) {
        modal.style.display = 'block';
        backdrop.style.display = 'block';
        if (edit) {
            buttons[2].style.display = 'inline-block';
            buttons[1].addEventListener('click', confirmUpdate);

        } else {
            buttons[2].style.display = 'none';
            buttons[1].addEventListener('click', confirmInsert);
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        backdrop.style.display = 'none';
        buttons[2].style.display = 'none';
        buttons[1].removeEventListener('click', confirmInsert);
        buttons[1].removeEventListener('click', confirmUpdate);
    }

    newIntent[0].addEventListener('click', () => {
        const editedTitle = document.getElementById('title');
        const editedExpressions = document.getElementById('expression');
        const editedAnswer = document.getElementById('answer');
        editedTitle.value = '';
        editedExpressions.value = '';
        editedAnswer.value = '';
        openModal(false);
    });

    //Cancel button
    buttons[0].addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    buttons[2].addEventListener('click', confirmRemove);

    document.querySelector('#container').addEventListener('click', (event) => {
        const intent = event.target.getAttribute('intent-id') || event.target.parentNode.getAttribute('intent-id');
        if (!intent)
            return;
        const editedTitle = document.getElementById('title');
        const editedExpressions = document.getElementById('expression');
        const editedAnswer = document.getElementById('answer');
        const targetIntent = chats[intent];
        editedTitle.value = targetIntent.title;
        editedExpressions.value = targetIntent.expression;
        editedAnswer.value = targetIntent.answer;
        openModal(true);
        buttons[2].setAttribute('intent-id', intent);
        buttons[1].setAttribute('intent-id', intent);
    });
});