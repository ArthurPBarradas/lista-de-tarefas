
const Main = {

    tasks: [],  

    init: function() {  /*responsável por chamar as funções*/
        this.cacheSelectors() /*Primeiro eu digo para selecionar todo mundo que eu preciso para trabalhar*/
        this.bindEvents()  /* depois adiciona os eventos nesses caras todos */
        this.getStoraged() /* Respinsavel por armazenar as tarefas que ja foram salvas */
        this.buildTasks()

    },

    cacheSelectors: function() { /*cacheSelectors vai ser responsável só por selecionar os elementos (document.querySelectorAll)*/
        this.$checkButtons = document.querySelectorAll('.check') /* esse THIS está sendo ultilizado para que eu use essa variável em todas as funções, no caso bindEvents*/
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
        // para dizer que é um elemento do HTML eu coloco "$" antes do nome da variável
    },

    bindEvents: function() { /* adiciona os eventos do EVENTS */
        const self = this /* chamei self de this porque em algum momento THIS não funciona e eu teria que chamar o MAIN só que se MAIN fosse trocado por outro nome eu teria que mudar tudo então eu ja coloco uma variável CONST com esse valor.*/

        this.$checkButtons.forEach(function(button){ /*colocando uma ação de click para todos os butões de check com forEach(paraCada)*/
            button.onclick = self.Events.checkButtons_click /* button vai chamar o MAIN = 'self = this' procurar EVENTS que vai procurar a função do evento que é checkButtons_click dentro de EVENTS */
        })

        this.$inputTask.onkeypress = self.Events.$inputTask_keypress.bind(this)

        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.$removeButtons_click.bind(self)
        })
    },

    getStoraged: function() {
        const tasks = localStorage.getItem('tasks')

        this.tasks = JSON.parse(tasks)
    },

    getTaskHtml: function(task) {
        return `
            <li>
                <div class="check"></div>
                <label class="task">
                    ${task}
                </label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `        
    },

    buildTasks: function() {
        let html = ''

        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task)
        })

        this.$list.innerHTML = html
        this.cacheSelectors()
        this.bindEvents()
    },
    


    Events: { /* aqui vai ter cada função de evento que eu quero execultar, no caso dos bindEvents*/
        checkButtons_click: function(e) {
            const li = e.target.parentElement // quando procurei onde estava a li - porque eu quero adicionar uma classe para quando eu clicar. por isso eu não chamo no cacheSelectors
            const isDone = li.classList.contains('done') // esse (contains) verifica se a classe 'done' existe nessa (li), se existir seu valor é True.
                /* adicionei 'done' somente para qunado clicar a li ficasse com um tracinho e a bolinha verde */

            if (!isDone) { // se não tiver essa variável e ele entrar no if ele retorna um valor, que no caso adiciona a classe 'done'
                return li.classList.add('done') // o return é importante para que ele não passe diretamente para a linha de baixo, já que o ELSE usa muito processamento 
                                                // se tiver ela passa pelo return e vai remover com a linha de baixo
            }

            li.classList.remove('done')
        },

        $inputTask_keypress: function(e){
            const key = e.key
            const value = e.target.value

            if (key === 'Enter') {
                this.$list.innerHTML += this.getTaskHtml(value)

                e.target.value = ``

                this.cacheSelectors()
                this.bindEvents()

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksObj = JSON.parse(savedTasks)

                const obj = [
                    {task: value },
                    ...savedTasksObj,
                ]

                localStorage.setItem('tasks', JSON.stringify(obj))
            }
        },

        $removeButtons_click: function(e){
            const li = e.target.parentElement
            const value = e.target.dataset['task']

            const newTasksStage = this.tasks.filter(item => item.task !== value)
            
            localStorage.setItem('tasks', JSON.stringify(newTasksStage))

            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            }, 300)
        }
    }

}

Main.init()