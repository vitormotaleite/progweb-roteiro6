import { backend } from './backend.js';

const $template = document.createElement("template");
$template.innerHTML = `
    <h1>Cadastro</h1>
    <div>
      Nome: <input id="nome" type="text">
      Perído: <input id="periodo" type="text", size="3">
      <span></span>
      <button>&hellip;</button>
    </div>
    <p>(<span id="contagem">&hellip;</span> disciplinas)</p>
`;

class PW_Cadastro extends HTMLElement {

    observers = []

    subscribe(observer) {
        this.observers.push(observer);
    }
    
    notifyObservers(data) {
        this.observers.forEach((observer) => {
          observer.update(data)
          observer.notify(data)
        });
    }

    async get_disciplinas() {
        return backend.fetch_disciplinas();
    }

    async del_disciplina(i) {
        backend.del_disciplina(i)
    }

    notify(data) {
        this.disciplinas = data;
        this.update();
    }

    async connectedCallback() {
        
        let clone = $template.content.cloneNode(true);
        this.appendChild(clone);

        this.$nome = this.querySelector("#nome");
        this.$periodo = this.querySelector("#periodo");
        this.$button = this.querySelector("button");
        this.$contagem = this.querySelector("#contagem");

        this.disciplinas = await backend.fetch_disciplinas();
        this.$button.addEventListener("click", () => this.handle_click());
        this.$nome.addEventListener("change", () => this.$periodo.focus());
        this.$periodo.addEventListener("change", () => this.$button.focus());
        this.$nome.focus();
        const pwListagem = document.querySelector('pw-listagem');
        if (pwListagem) {
            pwListagem.subscribe(this);
        }
        this.update()
    }

    async handle_click() {
        const nome = this.$nome.value;
        const periodo = this.$periodo.value;
        if (!nome) {
            this.$nome.focus();
            return;
        }
        if (!periodo) {
            this.$periodo.focus();
            return;
        }
        this.$nome.disabled = true;
        this.$periodo.disabled = true;
        this.$button.style.backgroundColor = 'yellow';
        this.$button.innerText = "salvando...";
        await backend.add_disciplina({nome, periodo});
        this.disciplinas.push({nome, periodo});
        this.notifyObservers(this.disciplinas);
        this.$nome.value = "";
        this.$periodo.value = "";
        this.$nome.disabled = false;
        this.$periodo.disabled = false;
        this.$nome.focus();
        this.update()
    }

    update() {
        this.$button.style.backgroundColor = '';
        this.$button.innerText = "Salva disciplina";
        this.$contagem.innerText = this.disciplinas.length;
    }
}

export {PW_Cadastro}

customElements.define("pw-cadastro", PW_Cadastro);