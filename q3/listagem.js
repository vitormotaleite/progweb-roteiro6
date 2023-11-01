import { PW_Cadastro } from "./cadastro.js";

const $template = document.createElement("template");
$template.innerHTML = `
    <h1>Disciplinas</h1>
    <div></div>
    <p></p>
`;

class PW_Listagem extends HTMLElement {

    cadastro = new PW_Cadastro()

    async notify() {
        this.cadastro.notify()
    }
    
    async connectedCallback() {
        let clone = $template.content.cloneNode(true);
        this.appendChild(clone);
        this.$disciplinas = this.querySelector("div");
        this.$contagem = this.querySelector("p");
        this.disciplinas = await this.cadastro.get_disciplinas()
        this.update();
    }

    update() {
        this.$disciplinas.innerHTML = "";
        this.disciplinas.forEach((d, i) => {
            const $d = document.createElement("pw-disciplina");
            $d.innerHTML = `
                <button>&times;</button>
                <pw-disc-nome>${d.nome}</pw-disc-nome>
                <pw-disc-periodo>${d.periodo}</pw-disc-periodo>
            `;
            this.$disciplinas.appendChild($d);
            const $b = $d.querySelector("button");
            $b.addEventListener("click", () => this.handle_click($d, i));
        });
        this.$contagem.innerText = `(${this.disciplinas.length} disciplinas)`;
    }

    async handle_click($d, i) {
        await this.cadastro.del_disciplina(i)
        this.disciplinas.splice(i,1)
        this.notify()
        this.update()

    }
}

//setInterval(() => location.reload(true), 2000);
customElements.define("pw-listagem", PW_Listagem);