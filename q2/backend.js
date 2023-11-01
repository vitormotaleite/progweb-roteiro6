async function fetch_disciplinas() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const db = localStorage.getItem("cc_db")
            const disciplinas = JSON.parse(db).disciplinas;
            res(disciplinas);
        }, latencia());
    });
}

async function add_disciplina(disciplina) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const db = localStorage.getItem("cc_db")
            const disciplinas = JSON.parse(db).disciplinas;
            disciplinas.push(disciplina);
            localStorage.setItem("cc_db", JSON.stringify({disciplinas}));
            res(disciplina);
        }, latencia());
    });
}

async function del_disciplina(idx) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const db = localStorage.getItem("cc_db")
            const disciplinas = JSON.parse(db).disciplinas;
            disciplinas.splice(idx, 1);
            localStorage.setItem("cc_db", JSON.stringify({disciplinas}));
            res(disciplinas);
        }, latencia());
    });
}

// Este e o objeto exportado por este modulo.
export const backend = {
    add_disciplina,
    fetch_disciplinas,
    del_disciplina
};

// Codigo de inicializaçao do mock do BD no localStorage.
(function init_mock_backend() {
    const cc_db = localStorage.getItem("cc_db");
    if (!cc_db) {
        const db = {disciplinas: []};
        localStorage.setItem("cc_db", JSON.stringify(db));
    }
}());

// Gera um numero aleatorio a ser usado para simular a 
// latecia do acesso a  API em cada acesso.
function latencia() {
    const MAX_TEMPO = 1000;
    return Math.trunc(Math.random() * MAX_TEMPO);
}

window._show = function () {
    // Esta funçao serve apenas para fins de depuraçao. Ela permite acompanhar o
    // valor do conteudo do banco de dados mock (mantido, na verdade, no
    // localStorage). Para usa-la, rode `_show()` no console do browser, apos
    // abrir a pagina do app.
    const db = JSON.parse(localStorage.getItem("cc_db"));
    console.clear();
    console.log(new Date());
    console.table(db.disciplinas);
    setTimeout(show, 250);
};