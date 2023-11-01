import { PW_Cadastro } from "./cadastro.js";

const $template = document.createElement("template");
$template.innerHTML = `
    <h1>Status</h1>
    <div></div>
`;

class PW_Resumo extends HTMLElement {

    cadastro = new PW_Cadastro()

    async notify() {
        return this.cadastro.notify()
    }

    async connectedCallback() {
        let clone = $template.content.cloneNode(true)
        this.appendChild(clone)
        this.$resumo = this.querySelector("div");
        this.disciplinas = await this.cadastro.get_disciplinas()
        this.update()
    }

    update() {
        const disciplinasPorPeriodo = {};
        const periodosCadastrados = new Set();

        this.disciplinas.forEach(disciplina => {
            periodosCadastrados.add(disciplina.periodo);
        });

        this.disciplinas.forEach(disciplina => {
            const periodo = disciplina.periodo;
            disciplinasPorPeriodo[periodo] = (disciplinasPorPeriodo[periodo] || 0) + 1;

        });

        const numeroDePeriodos = periodosCadastrados.size;
        
        for (let p in disciplinasPorPeriodo) {
            const $periodo = document.createElement("pw-periodo");
            if (disciplinasPorPeriodo.hasOwnProperty(p)) {
                const numeroDisciplinas = disciplinasPorPeriodo[p];
                $periodo.innerHTML = `
                    <pw-num>${numeroDisciplinas}</pw-num>
                    <pw-text>disciplinas em</pw-text>
                    <pw-text>${p}</pw-text>
                `;
                this.$resumo.appendChild($periodo);
            }
        }

        this.$paragrafo = document.createElement("p");
        this.$paragrafo.innerHTML = `${this.disciplinas.length} disciplinas cadastradas e ${numeroDePeriodos} períodos cadastrados`
        this.$resumo.appendChild(this.$paragrafo)
    }
}

customElements.define("pw-status", PW_Resumo);