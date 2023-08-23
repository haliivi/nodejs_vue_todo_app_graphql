new Vue({
    el: '#app',
    data() {
        return {
            isDark: true,
            show: true,
            todoTitle: '',
            todos: []
        }
    },
    created() {
        const query = `
            query {
                getTodos {
                    title
                    createdAt
                    updatedAt
                    done
                    id
                }
            }
        `
        fetch(
            '/graphql',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({query})
            }
        )
        .then(res => res.json())
        .then(({data: {getTodos: todos}}) => {
            this.todos = todos
        })
        .catch(e => console.log(e))
    },
    methods: {
        addTodo() {
            const title = this.todoTitle.trim()
            if (!title) {
                return
            }
            const query = `
                mutation {
                    createTodo(todo: {title: "${title}"}) {
                        id
                        title
                        done
                        createdAt
                        updatedAt
                    }
                }
            `
            fetch('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({query})
            })
            .then(res => res.json())
            .then(({data: {createTodo: todo}}) => {
                this.todos.push(todo)
                this.todoTitle = ''
            })
            .catch(e => console.log(e))
        },
        removeTodo(id) {
            const query = `
                mutation {
                    deleteTodo(id: "${id}")
                }
            `
            fetch(
                `/graphql`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({query})
                }
            )
            .then(() => {
                this.todos = this.todos.filter(t => t.id !== id)
            })
            .catch(e => console.log(e))
        },
        completeTodo(id) {
            const query = `
                mutation {
                    completeTodo(id: "${id}") {
                        updatedAt
                    }
                }
            `
            fetch(
                `/graphql`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({query})
                }
            )
            .then(res => res.json())
            .then(({data: {completeTodo: todo}}) => {
                const idx = this.todos.findIndex(t => t.id === id)
                this.todos[idx].updatedAt = todo.updatedAt
            })
            .catch(e => console.log(e))
        }
    },
    filters: {
        capitalize(value) {
            return value.toString().charAt(0).toUpperCase() + value.slice(1)
        },
        date(value, withTime) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
            }
            if (withTime) {
                options.hour = '2-digit'
                options.minute = '2-digit'
                options.second = '2-digit'
            }
            return new Intl.DateTimeFormat('ru-RU', options).format(new Date(+value))
        }
    }
})